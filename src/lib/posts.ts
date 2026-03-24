import type { Post } from "./types";

const API = "/api/drafts";

export async function getDrafts(): Promise<Post[]> {
  const res = await fetch(API);
  if (!res.ok) return [];
  return res.json();
}

export async function saveDraft(post: Post): Promise<void> {
  await fetch(`${API}/${encodeURIComponent(post.slug)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
}

export async function deleteDraft(slug: string): Promise<void> {
  await fetch(`${API}/${encodeURIComponent(slug)}`, { method: "DELETE" });
}

export async function publishDraft(slug: string): Promise<void> {
  await fetch(`${API}/${encodeURIComponent(slug)}/publish`, {
    method: "POST",
  });
}
