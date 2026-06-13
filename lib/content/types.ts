export interface Post {
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  publishedAt: string; // ISO date string YYYY-MM-DD
  updatedAt?: string;
  draft: boolean;
  canonicalUrl?: string;
  readingTime?: string; // e.g. "4 min read"
}

export interface Project {
  slug: string;
  name: string;
  description: string;
  status: "live" | "building" | "sunset" | "paused";
  role: string;
  links: { label: string; url: string }[];
  featured: boolean;
  order: number;
}

export interface Bio {
  short: string;
  medium: string;
  long: string;
}

export interface ContentSource {
  listPosts(opts?: { tag?: string; includeDrafts?: boolean }): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | null>;
  listTags(): Promise<{ tag: string; count: number }[]>;
  listProjects(): Promise<Project[]>;
  getBios(): Promise<Bio>;
}
