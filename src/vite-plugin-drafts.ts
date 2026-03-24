import fs from "node:fs";
import path from "node:path";
import type { Plugin, ViteDevServer } from "vite";

const DRAFTS_DIR = path.resolve("src/drafts");
const WRITING_FILE = path.resolve("src/content/writing.ts");

function ensureDraftsDir() {
  if (!fs.existsSync(DRAFTS_DIR)) {
    fs.mkdirSync(DRAFTS_DIR, { recursive: true });
  }
}

function readBody(req: import("node:http").IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk: Buffer) => (data += chunk.toString()));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function escapeTemplateString(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

export default function draftsPlugin(): Plugin {
  return {
    name: "drafts-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";

        if (!url.startsWith("/api/")) {
          return next();
        }

        res.setHeader("Content-Type", "application/json");

        try {
          // POST /api/auth — validate password server-side
          if (url === "/api/auth" && req.method === "POST") {
            const body = await readBody(req);
            const { password } = JSON.parse(body);
            const expected = process.env.ADMIN_PASSWORD ?? "letmein";
            if (password === expected) {
              res.end(JSON.stringify({ ok: true }));
            } else {
              res.statusCode = 401;
              res.end(JSON.stringify({ error: "Wrong password" }));
            }
            return;
          }

          if (!url.startsWith("/api/drafts")) {
            return next();
          }

          ensureDraftsDir();
          // GET /api/drafts — list all drafts
          if (url === "/api/drafts" && req.method === "GET") {
            const files = fs
              .readdirSync(DRAFTS_DIR)
              .filter((f) => f.endsWith(".json"));
            const drafts = files.map((f) => {
              const content = fs.readFileSync(
                path.join(DRAFTS_DIR, f),
                "utf-8",
              );
              return JSON.parse(content);
            });
            res.end(JSON.stringify(drafts));
            return;
          }

          // Match /api/drafts/:slug and /api/drafts/:slug/publish
          const publishMatch = url.match(/^\/api\/drafts\/([^/]+)\/publish$/);
          const slugMatch = url.match(/^\/api\/drafts\/([^/]+)$/);

          // POST /api/drafts/:slug/publish — publish a draft to writing.ts
          if (publishMatch && req.method === "POST") {
            const slug = decodeURIComponent(publishMatch[1]);
            const filePath = path.join(DRAFTS_DIR, `${slug}.json`);

            if (!fs.existsSync(filePath)) {
              res.statusCode = 404;
              res.end(JSON.stringify({ error: "Draft not found" }));
              return;
            }

            const draft = JSON.parse(fs.readFileSync(filePath, "utf-8"));
            const writingSource = fs.readFileSync(WRITING_FILE, "utf-8");

            // Build the post entry string
            const tagsStr = draft.tags?.length
              ? `\n    tags: [${draft.tags.map((t: string) => `"${t}"`).join(", ")}],`
              : "";

            const postEntry = `  {
    slug: "${draft.slug}",
    title: "${draft.title.replace(/"/g, '\\"')}",
    date: "${draft.date}",
    summary:
      "${draft.summary.replace(/"/g, '\\"')}",
    body: \`${escapeTemplateString(draft.body)}\`,${tagsStr}
  },`;

            // Insert after "export const posts: Post[] = [\n"
            const insertIndex = writingSource.indexOf("[\n") + 2;
            const updated =
              writingSource.slice(0, insertIndex) +
              postEntry +
              "\n" +
              writingSource.slice(insertIndex);

            fs.writeFileSync(WRITING_FILE, updated);
            fs.unlinkSync(filePath);

            res.end(JSON.stringify({ ok: true }));
            return;
          }

          if (slugMatch) {
            const slug = decodeURIComponent(slugMatch[1]);
            const filePath = path.join(DRAFTS_DIR, `${slug}.json`);

            // GET /api/drafts/:slug
            if (req.method === "GET") {
              if (!fs.existsSync(filePath)) {
                res.statusCode = 404;
                res.end(JSON.stringify({ error: "Not found" }));
                return;
              }
              res.end(fs.readFileSync(filePath, "utf-8"));
              return;
            }

            // PUT /api/drafts/:slug — create or update
            if (req.method === "PUT") {
              const body = await readBody(req);
              fs.writeFileSync(filePath, body);
              res.end(JSON.stringify({ ok: true }));
              return;
            }

            // DELETE /api/drafts/:slug
            if (req.method === "DELETE") {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
              res.end(JSON.stringify({ ok: true }));
              return;
            }
          }

          res.statusCode = 404;
          res.end(JSON.stringify({ error: "Not found" }));
        } catch (err) {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              error: err instanceof Error ? err.message : "Unknown error",
            }),
          );
        }
      });
    },
  };
}
