import Link from "next/link";
import { Tag } from "@/components/tag";
import type { Post } from "@/lib/content";

interface WritingRowProps {
  post: Post;
  showTags?: boolean;
}

export function WritingRow({ post, showTags = true }: WritingRowProps) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group flex items-baseline gap-4 py-2.5 border-b border-[var(--border)] hover:border-[var(--fg-faint)] transition-colors"
    >
      <time
        dateTime={post.publishedAt}
        className="shrink-0 text-xs text-[var(--fg-muted)] tabular-nums w-24"
      >
        {post.publishedAt}
      </time>
      <span className="flex-1 text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
        {post.title}
      </span>
      {showTags && post.tags.length > 0 && (
        <span className="hidden sm:flex gap-1.5 shrink-0">
          {post.tags.slice(0, 2).map((t) => (
            <Tag key={t} tag={t} />
          ))}
        </span>
      )}
    </Link>
  );
}
