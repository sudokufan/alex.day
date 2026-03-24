import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type RefObject,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";
import type { Post } from "../lib/types";
import {
  authenticate,
  getDrafts,
  saveDraft,
  deleteDraft,
  publishDraft,
} from "../lib/posts";
import { formatDate } from "../lib/formatDate";
import PageTransition from "../components/PageTransition";

const AUTOSAVE_DELAY = 1000;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

interface FormatAction {
  label: string;
  icon: string;
  prefix: string;
  suffix: string;
  block?: boolean;
}

const formatActions: FormatAction[] = [
  { label: "Bold", icon: "B", prefix: "**", suffix: "**" },
  { label: "Italic", icon: "I", prefix: "*", suffix: "*" },
  { label: "Heading", icon: "H2", prefix: "## ", suffix: "", block: true },
  { label: "Link", icon: "🔗", prefix: "[", suffix: "](url)" },
  { label: "Quote", icon: '"', prefix: "> ", suffix: "", block: true },
  { label: "List", icon: "•", prefix: "- ", suffix: "", block: true },
];

function FormattingToolbar({
  textareaRef,
  body,
  setBody,
  onchange,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  body: string;
  setBody: (v: string) => void;
  onchange: () => void;
}) {
  const applyFormat = (action: FormatAction) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = body.slice(start, end);

    let newText: string;
    let cursorPos: number;

    if (action.block) {
      // For block formats, ensure we're on a new line
      const before = body.slice(0, start);
      const needsNewline = before.length > 0 && !before.endsWith("\n");
      const prefix = (needsNewline ? "\n" : "") + action.prefix;

      if (selected) {
        newText = before + prefix + selected + action.suffix + body.slice(end);
        cursorPos =
          start + prefix.length + selected.length + action.suffix.length;
      } else {
        newText = before + prefix + action.suffix + body.slice(end);
        cursorPos = start + prefix.length;
      }
    } else {
      if (selected) {
        newText =
          body.slice(0, start) +
          action.prefix +
          selected +
          action.suffix +
          body.slice(end);
        cursorPos =
          start + action.prefix.length + selected.length + action.suffix.length;
      } else {
        newText =
          body.slice(0, start) +
          action.prefix +
          action.suffix +
          body.slice(end);
        cursorPos = start + action.prefix.length;
      }
    }

    setBody(newText);
    onchange();

    // Restore focus and cursor position
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "X-Filename": file.name },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();

      const ta = textareaRef.current;
      if (!ta) return;
      const pos = ta.selectionStart;
      const imgMarkdown = `\n![${file.name}](${url})\n`;
      const newText = body.slice(0, pos) + imgMarkdown + body.slice(pos);
      setBody(newText);
      onchange();

      requestAnimationFrame(() => {
        ta.focus();
        const newPos = pos + imgMarkdown.length;
        ta.setSelectionRange(newPos, newPos);
      });
    } catch {
      // silently fail
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex gap-1 mb-1.5">
      {formatActions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => applyFormat(action)}
          title={action.label}
          className={`px-2 py-1 text-xs rounded border border-parchment bg-warm-white text-stone hover:text-ink hover:border-accent transition-colors duration-150 ${
            action.label === "Bold" ? "font-bold" : ""
          } ${action.label === "Italic" ? "italic" : ""}`}
        >
          {action.icon}
        </button>
      ))}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        title="Insert image"
        disabled={uploading}
        className="px-2 py-1 text-xs rounded border border-parchment bg-warm-white text-stone hover:text-ink hover:border-accent transition-colors duration-150 disabled:opacity-40"
      >
        {uploading ? "..." : "📷"}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function DraftEditor({
  initial,
  onBack,
  onPublished,
}: {
  initial?: Post;
  onBack: () => void;
  onPublished: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().slice(0, 10),
  );
  const [summary, setSummary] = useState(initial?.summary ?? "");
  const [body, setBody] = useState(initial?.body ?? "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") ?? "");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [showPreview, setShowPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const slugRef = useRef(initial?.slug ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentPost = useCallback((): Post | null => {
    if (!title.trim()) return null;
    if (!slugRef.current) slugRef.current = slugify(title);
    return {
      slug: slugRef.current,
      title: title.trim(),
      date,
      summary: summary.trim(),
      body,
      tags: tags
        ? tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : undefined,
    };
  }, [title, date, summary, body, tags]);

  const doSave = useCallback(async () => {
    const post = currentPost();
    if (!post) return;
    setSaveStatus("saving");
    try {
      await saveDraft(post);
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  }, [currentPost]);

  // Auto-save on changes
  const triggerAutosave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaveStatus("idle");
    timerRef.current = setTimeout(() => {
      doSave();
    }, AUTOSAVE_DELAY);
  }, [doSave]);

  // Generate slug from title on first edit (new drafts only)
  useEffect(() => {
    if (!initial && title.trim()) {
      slugRef.current = slugify(title);
    }
  }, [title, initial]);

  const handlePublish = async () => {
    const post = currentPost();
    if (!post || !post.body.trim()) return;

    setPublishing(true);
    try {
      // Save first to ensure latest content is on disk
      await saveDraft(post);
      await publishDraft(post.slug);
      onPublished();
    } catch {
      setSaveStatus("error");
      setPublishing(false);
    }
  };

  const statusText =
    saveStatus === "saving"
      ? "Saving..."
      : saveStatus === "saved"
        ? "Saved"
        : saveStatus === "error"
          ? "Error saving"
          : "";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="font-sans text-sm text-accent hover:text-accent-hover underline underline-offset-4 transition-colors duration-200"
        >
          &larr; All drafts
        </button>
        <div className="flex items-center gap-4">
          <span className="font-sans text-xs text-warm-gray">{statusText}</span>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="font-sans text-xs text-stone hover:text-ink transition-colors duration-200"
          >
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="py-4">
          <h1 className="text-3xl font-serif font-light text-ink leading-tight">
            {title || "Untitled"}
          </h1>
          <p className="mt-2 font-sans text-sm text-stone">
            {formatDate(date)}
          </p>
          <div className="mt-8 prose text-lg leading-relaxed text-charcoal">
            <Markdown>{body || "*No content yet.*"}</Markdown>
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="block font-sans text-xs text-stone mb-1.5">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                triggerAutosave();
              }}
              className="w-full px-3 py-2 bg-warm-white border border-parchment rounded-lg font-serif text-ink focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-sans text-xs text-stone mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  triggerAutosave();
                }}
                className="w-full px-3 py-2 bg-warm-white border border-parchment rounded-lg font-sans text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div className="flex-1">
              <label className="block font-sans text-xs text-stone mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => {
                  setTags(e.target.value);
                  triggerAutosave();
                }}
                placeholder="reflection, pace"
                className="w-full px-3 py-2 bg-warm-white border border-parchment rounded-lg font-sans text-sm text-ink placeholder:text-warm-gray focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>
          <div>
            <label className="block font-sans text-xs text-stone mb-1.5">
              Summary
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => {
                setSummary(e.target.value);
                triggerAutosave();
              }}
              className="w-full px-3 py-2 bg-warm-white border border-parchment rounded-lg font-serif text-ink focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block font-sans text-xs text-stone mb-1.5">
              Body
            </label>
            <FormattingToolbar
              textareaRef={textareaRef}
              body={body}
              setBody={setBody}
              onchange={triggerAutosave}
            />
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                triggerAutosave();
              }}
              rows={18}
              className="w-full px-3 py-2 bg-warm-white border border-parchment rounded-lg font-mono text-sm text-ink leading-relaxed focus:outline-none focus:border-accent transition-colors resize-y"
            />
          </div>
        </>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handlePublish}
          disabled={!title.trim() || !body.trim() || publishing}
          className="px-4 py-2 bg-ink text-cream font-sans text-sm rounded-lg hover:bg-charcoal transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {publishing ? "Publishing..." : "Publish"}
        </button>
        <p className="font-sans text-xs text-warm-gray">
          Publishes to /writing and deletes the draft.
        </p>
      </div>
    </div>
  );
}

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [drafts, setDrafts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const loadDrafts = useCallback(async () => {
    const d = await getDrafts();
    setDrafts(d);
  }, []);

  useEffect(() => {
    if (authed) loadDrafts();
  }, [authed, loadDrafts]);

  const isDev = import.meta.env.DEV;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ok = await authenticate(password);
      if (ok) {
        setAuthed(true);
        setError(false);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  };

  if (!authed) {
    return (
      <PageTransition>
        <div className="max-w-xs mx-auto py-20">
          <h1 className="text-2xl font-serif font-light text-ink mb-8 text-center">
            Admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder={isDev ? "Password" : "GitHub personal access token"}
              className="w-full px-3 py-2 bg-warm-white border border-parchment rounded-lg font-sans text-sm text-ink placeholder:text-warm-gray focus:outline-none focus:border-accent transition-colors"
              autoFocus
            />
            {error && (
              <p className="font-sans text-xs text-red-700">
                {isDev ? "Wrong password." : "Invalid token or repo not found."}
              </p>
            )}
            {!isDev && (
              <p className="font-sans text-xs text-warm-gray leading-relaxed">
                Enter a GitHub PAT with repo access. Drafts save to your
                browser; publishing commits to posts.ts.
              </p>
            )}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-ink text-cream font-sans text-sm rounded-lg hover:bg-charcoal transition-colors duration-200"
            >
              Enter
            </button>
          </form>
        </div>
      </PageTransition>
    );
  }

  // Editing or creating a draft
  if (creating || editing) {
    return (
      <PageTransition>
        <AnimatePresence mode="wait">
          <motion.div
            key={editing ?? "new"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <DraftEditor
              initial={
                editing ? drafts.find((d) => d.slug === editing) : undefined
              }
              onBack={() => {
                setEditing(null);
                setCreating(false);
                loadDrafts();
              }}
              onPublished={() => {
                setEditing(null);
                setCreating(false);
                loadDrafts();
              }}
            />
          </motion.div>
        </AnimatePresence>
      </PageTransition>
    );
  }

  // Draft list
  return (
    <PageTransition>
      <div className="flex items-baseline justify-between mb-10">
        <h1 className="text-3xl font-serif font-light text-ink">Drafts</h1>
        <button
          onClick={() => setCreating(true)}
          className="font-sans text-sm text-accent hover:text-accent-hover underline underline-offset-4 transition-colors duration-200"
        >
          + New draft
        </button>
      </div>

      <div className="space-y-4">
        {drafts.length === 0 ? (
          <p className="text-stone py-8 text-center">
            No drafts. Start writing something new.
          </p>
        ) : (
          drafts.map((post) => (
            <div
              key={post.slug}
              className="p-4 bg-warm-white border border-parchment rounded-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <button
                  onClick={() => setEditing(post.slug)}
                  className="text-left"
                >
                  <p className="font-serif text-ink hover:text-accent transition-colors duration-200">
                    {post.title || "Untitled"}
                  </p>
                  <p className="mt-1 font-sans text-xs text-stone">
                    {formatDate(post.date)}
                  </p>
                </button>
                <button
                  onClick={async () => {
                    await deleteDraft(post.slug);
                    loadDrafts();
                  }}
                  className="font-sans text-xs text-stone hover:text-red-700 transition-colors duration-200 shrink-0"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-16 pt-8 border-t border-parchment">
        <p className="font-sans text-xs text-warm-gray leading-relaxed">
          {isDev ? (
            <>
              Drafts auto-save to{" "}
              <code className="text-xs bg-parchment px-1 py-0.5 rounded font-mono">
                src/drafts/
              </code>{" "}
              as you type. Publishing moves the post into{" "}
              <code className="text-xs bg-parchment px-1 py-0.5 rounded font-mono">
                posts.ts
              </code>{" "}
              and deletes the draft file.
            </>
          ) : (
            <>
              Drafts auto-save to your browser. Publishing commits the post to{" "}
              <code className="text-xs bg-parchment px-1 py-0.5 rounded font-mono">
                posts.ts
              </code>{" "}
              in your GitHub repo, triggering a rebuild.
            </>
          )}
        </p>
      </div>
    </PageTransition>
  );
}
