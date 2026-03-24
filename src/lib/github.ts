const REPO = import.meta.env.VITE_GITHUB_REPO ?? ""; // "owner/repo"
const WRITING_PATH = "src/content/writing.ts";
const DRAFTS_STORAGE_KEY = "alex-day-drafts";

let token = "";

export function setGithubToken(t: string) {
  token = t;
}

function headers() {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function validateToken(): Promise<boolean> {
  if (!REPO) return false;
  const res = await fetch(`https://api.github.com/repos/${REPO}`, {
    headers: headers(),
  });
  return res.ok;
}

// --- Draft storage (localStorage in production) ---

import type { Post } from "./types";

export function getDrafts(): Post[] {
  try {
    const raw = localStorage.getItem(DRAFTS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Post[];
  } catch {
    return [];
  }
}

function saveDraftsToStorage(drafts: Post[]) {
  localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
}

export function saveDraft(post: Post) {
  const drafts = getDrafts();
  const idx = drafts.findIndex((d) => d.slug === post.slug);
  if (idx >= 0) {
    drafts[idx] = post;
  } else {
    drafts.unshift(post);
  }
  saveDraftsToStorage(drafts);
}

export function deleteDraft(slug: string) {
  saveDraftsToStorage(getDrafts().filter((d) => d.slug !== slug));
}

// --- Publishing via GitHub API ---

function escapeTemplateString(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$/g, "\\$");
}

function buildPostEntry(post: Post): string {
  const tagsStr = post.tags?.length
    ? `\n    tags: [${post.tags.map((t) => `"${t}"`).join(", ")}],`
    : "";

  return `  {
    slug: "${post.slug}",
    title: "${post.title.replace(/"/g, '\\"')}",
    date: "${post.date}",
    summary:
      "${(post.summary ?? "").replace(/"/g, '\\"')}",
    body: \`${escapeTemplateString(post.body)}\`,${tagsStr}
  },`;
}

export async function publishDraft(slug: string): Promise<void> {
  const drafts = getDrafts();
  const post = drafts.find((d) => d.slug === slug);
  if (!post) throw new Error("Draft not found");

  // 1. Get current writing.ts from GitHub
  const fileRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${WRITING_PATH}`,
    { headers: headers() },
  );
  if (!fileRes.ok) throw new Error("Failed to fetch writing.ts from GitHub");

  const fileData = await fileRes.json();
  const currentContent = atob(fileData.content.replace(/\n/g, ""));
  const sha = fileData.sha;

  // 2. Insert the new post at the top of the array
  const postEntry = buildPostEntry(post);
  const insertIndex = currentContent.indexOf("[\n") + 2;
  const updatedContent =
    currentContent.slice(0, insertIndex) +
    postEntry +
    "\n" +
    currentContent.slice(insertIndex);

  // 3. Commit the update
  const commitRes = await fetch(
    `https://api.github.com/repos/${REPO}/contents/${WRITING_PATH}`,
    {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({
        message: `publish: ${post.title}`,
        content: btoa(unescape(encodeURIComponent(updatedContent))),
        sha,
      }),
    },
  );

  if (!commitRes.ok) {
    const err = await commitRes.json();
    throw new Error(err.message ?? "Failed to commit");
  }

  // 4. Remove draft from localStorage
  deleteDraft(slug);
}
