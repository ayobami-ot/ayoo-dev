/**
 * SupabaseContentSource — stub for Scarab HQ integration.
 *
 * When Scarab approves/publishes content into Supabase, wire this up
 * and switch CONTENT_SOURCE=supabase in your env.
 *
 * Expected Supabase schema:
 *
 *   posts (
 *     id          uuid primary key,
 *     slug        text unique not null,
 *     title       text not null,
 *     description text,
 *     body        text,       -- MDX source
 *     tags        text[],
 *     published_at date,
 *     updated_at  date,
 *     draft       boolean default true,
 *     canonical_url text
 *   )
 *
 *   projects (
 *     id          uuid primary key,
 *     slug        text unique not null,
 *     name        text not null,
 *     description text,
 *     status      text,       -- live | building | sunset | paused
 *     role        text,
 *     links       jsonb,      -- {label, url}[]
 *     featured    boolean,
 *     "order"     int
 *   )
 *
 *   bios (
 *     id     uuid primary key,
 *     short  text,
 *     medium text,
 *     long   text
 *   )
 */

import type { ContentSource, Post, Project, Bio } from "./types";

export class SupabaseContentSource implements ContentSource {
  // TODO: inject supabase client here, e.g.:
  // constructor(private supabase: SupabaseClient) {}

  async listPosts(_opts?: { tag?: string; includeDrafts?: boolean }): Promise<Post[]> {
    // TODO:
    // const query = this.supabase.from("posts").select("*").eq("draft", false).order("published_at", { ascending: false });
    // if (opts?.tag) query.contains("tags", [opts.tag]);
    // if (opts?.includeDrafts) remove the .eq("draft", false) filter
    throw new Error("SupabaseContentSource.listPosts: not yet implemented");
  }

  async getPostBySlug(_slug: string): Promise<Post | null> {
    // TODO:
    // const { data } = await this.supabase.from("posts").select("*").eq("slug", slug).single();
    // return data ? mapRow(data) : null;
    throw new Error("SupabaseContentSource.getPostBySlug: not yet implemented");
  }

  async listTags(): Promise<{ tag: string; count: number }[]> {
    // TODO: derive from posts table via a Postgres function or aggregate
    throw new Error("SupabaseContentSource.listTags: not yet implemented");
  }

  async listProjects(): Promise<Project[]> {
    // TODO:
    // const { data } = await this.supabase.from("projects").select("*").order("order");
    // return data ?? [];
    throw new Error("SupabaseContentSource.listProjects: not yet implemented");
  }

  async getBios(): Promise<Bio> {
    // TODO:
    // const { data } = await this.supabase.from("bios").select("*").single();
    // return data;
    throw new Error("SupabaseContentSource.getBios: not yet implemented");
  }
}
