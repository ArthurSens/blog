import type Post from "../interfaces/post";

// Presentation lives outside the original writing. No article needs to be rewritten.
export function topicFor(post: Pick<Post, "translationKey">) {
  return post.translationKey === "grief" ? "life" : "systems";
}
export function readingMinutes(content: string) {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220));
}
