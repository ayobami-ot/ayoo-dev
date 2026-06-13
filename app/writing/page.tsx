import type { Metadata } from "next";
import { content } from "@/lib/content";
import { Tag } from "@/components/tag";
import { WritingRow } from "@/components/writing-row";

export const metadata: Metadata = {
  title: "Writing",
  description: "Thinking out loud about building, technology, and operating at small scale.",
};

interface Props {
  searchParams: Promise<{ tag?: string }>;
}

export default async function WritingPage({ searchParams }: Props) {
  const { tag } = await searchParams;

  const [posts, tags] = await Promise.all([
    content.listPosts({ tag }),
    content.listTags(),
  ]);

  const allPosts = await content.listPosts();

  return (
    <div
      className="mx-auto w-full px-6 py-16"
      style={{ maxWidth: "var(--measure-wide)" }}
    >
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--fg)] mb-2">Writing</h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {allPosts.length} post{allPosts.length !== 1 ? "s" : ""} — thinking out loud about
          building, technology, and operating at small scale.
        </p>
      </div>

      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Tag tag="all" href="/writing" active={!tag} />
          {tags.map(({ tag: t }) => (
            <Tag key={t} tag={t} href={`/writing?tag=${t}`} active={t === tag} />
          ))}
        </div>
      )}

      <div>
        {posts.length === 0 ? (
          <p className="text-sm text-[var(--fg-muted)] py-8">No posts found.</p>
        ) : (
          posts.map((post) => <WritingRow key={post.slug} post={post} />)
        )}
      </div>
    </div>
  );
}
