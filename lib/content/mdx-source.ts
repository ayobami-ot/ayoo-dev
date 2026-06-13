import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { ContentSource, Post, Project, Bio } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

async function readMdxFile(filePath: string): Promise<{ data: Record<string, unknown>; content: string }> {
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { data, content };
}

export class MdxContentSource implements ContentSource {
  async listPosts({ tag, includeDrafts = false }: { tag?: string; includeDrafts?: boolean } = {}): Promise<Post[]> {
    const dir = path.join(CONTENT_DIR, "posts");
    let files: string[];
    try {
      files = await fs.readdir(dir);
    } catch {
      return [];
    }

    const posts = await Promise.all(
      files
        .filter((f) => f.endsWith(".mdx"))
        .map(async (file) => {
          const slug = file.replace(/\.mdx$/, "");
          const { data, content } = await readMdxFile(path.join(dir, file));
          const rt = readingTime(content);
          return {
            slug,
            title: (data.title as string) ?? slug,
            description: (data.description as string) ?? "",
            body: content,
            tags: (data.tags as string[]) ?? [],
            publishedAt: (data.publishedAt as string) ?? "",
            updatedAt: data.updatedAt as string | undefined,
            draft: (data.draft as boolean) ?? false,
            canonicalUrl: data.canonicalUrl as string | undefined,
            readingTime: rt.text,
          } satisfies Post;
        })
    );

    return posts
      .filter((p) => includeDrafts || !p.draft)
      .filter((p) => (tag ? p.tags.includes(tag) : true))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    const filePath = path.join(CONTENT_DIR, "posts", `${slug}.mdx`);
    try {
      const { data, content } = await readMdxFile(filePath);
      const rt = readingTime(content);
      return {
        slug,
        title: (data.title as string) ?? slug,
        description: (data.description as string) ?? "",
        body: content,
        tags: (data.tags as string[]) ?? [],
        publishedAt: (data.publishedAt as string) ?? "",
        updatedAt: data.updatedAt as string | undefined,
        draft: (data.draft as boolean) ?? false,
        canonicalUrl: data.canonicalUrl as string | undefined,
        readingTime: rt.text,
      };
    } catch {
      return null;
    }
  }

  async listTags(): Promise<{ tag: string; count: number }[]> {
    const posts = await this.listPosts();
    const counts: Record<string, number> = {};
    for (const post of posts) {
      for (const tag of post.tags) {
        counts[tag] = (counts[tag] ?? 0) + 1;
      }
    }
    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  async listProjects(): Promise<Project[]> {
    const dir = path.join(CONTENT_DIR, "projects");
    let files: string[];
    try {
      files = await fs.readdir(dir);
    } catch {
      return [];
    }

    const projects = await Promise.all(
      files
        .filter((f) => f.endsWith(".json"))
        .map(async (file) => {
          const raw = await fs.readFile(path.join(dir, file), "utf-8");
          return JSON.parse(raw) as Project;
        })
    );

    return projects.sort((a, b) => a.order - b.order);
  }

  async getBios(): Promise<Bio> {
    const filePath = path.join(CONTENT_DIR, "bios.json");
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Bio;
  }
}
