import type { Post } from "./types";
import * as github from "./github";

const isDev = import.meta.env.DEV;
const LOCAL_API = "/api/drafts";

// --- Auth ---

export async function authenticate(password: string): Promise<boolean> {
  if (isDev) {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return res.ok;
  } else {
    github.setGithubToken(password);
    return github.validateToken();
  }
}

// --- Drafts ---

export async function getDrafts(): Promise<Post[]> {
  if (isDev) {
    const res = await fetch(LOCAL_API);
    if (!res.ok) return [];
    return res.json();
  }
  return github.getDrafts();
}

export async function saveDraft(post: Post): Promise<void> {
  if (isDev) {
    await fetch(`${LOCAL_API}/${encodeURIComponent(post.slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
  } else {
    github.saveDraft(post);
  }
}

export async function deleteDraft(slug: string): Promise<void> {
  if (isDev) {
    await fetch(`${LOCAL_API}/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
  } else {
    github.deleteDraft(slug);
  }
}

// --- Publish ---

export async function publishDraft(slug: string): Promise<void> {
  if (isDev) {
    await fetch(`${LOCAL_API}/${encodeURIComponent(slug)}/publish`, {
      method: "POST",
    });
  } else {
    await github.publishDraft(slug);
  }
}
