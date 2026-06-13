import type { ContentSource } from "./types";
import { MdxContentSource } from "./mdx-source";

function getContentSource(): ContentSource {
  const source = process.env.CONTENT_SOURCE ?? "mdx";
  if (source === "supabase") {
    // Lazy-require so the Supabase SDK is not bundled unless needed
    const { SupabaseContentSource } = require("./supabase-source") as typeof import("./supabase-source");
    return new SupabaseContentSource();
  }
  return new MdxContentSource();
}

export const content: ContentSource = getContentSource();
export type { ContentSource, Post, Project, Bio } from "./types";
