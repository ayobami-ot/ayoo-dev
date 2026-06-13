import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { content } from "@/lib/content";
import { renderMdx } from "@/lib/mdx";
import { Tag } from "@/components/tag";
import { BlogPostingJsonLd } from "@/components/json-ld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await content.listPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await content.getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
      images: [{ url: `/api/og?slug=${slug}`, width: 1200, height: 630 }],
    },
    alternates: post.canonicalUrl ? { canonical: post.canonicalUrl } : undefined,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await content.getPostBySlug(slug);
  if (!post || post.draft) notFound();

  const allPosts = await content.listPosts();
  const idx = allPosts.findIndex((p) => p.slug === slug);
  const prev = allPosts[idx + 1] ?? null;
  const next = allPosts[idx - 1] ?? null;

  const { content: mdxContent } = await renderMdx(post.body);

  return (
    <>
      <BlogPostingJsonLd
        title={post.title}
        description={post.description}
        slug={post.slug}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        tags={post.tags}
      />
    <div
      className="mx-auto w-full px-6 py-16"
      style={{ maxWidth: "var(--measure-wide)" }}
    >
      {/* Back */}
      <Link
        href="/writing"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors mb-10"
      >
        <ArrowLeft size={12} strokeWidth={1.5} />
        writing
      </Link>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--fg)] leading-snug mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--fg-muted)]">
          <time dateTime={post.publishedAt} className="tabular-nums">
            {post.publishedAt}
          </time>
          {post.updatedAt && post.updatedAt !== post.publishedAt && (
            <span>updated {post.updatedAt}</span>
          )}
          {post.readingTime && (
            <span className="flex items-center gap-1">
              <Clock size={11} strokeWidth={1.5} />
              {post.readingTime}
            </span>
          )}
          {post.tags.map((t) => (
            <Tag key={t} tag={t} href={`/writing?tag=${t}`} />
          ))}
        </div>
      </header>

      <hr className="mb-10" />

      {/* Body */}
      <article className="prose">{mdxContent}</article>

      <hr className="mt-12 mb-8" />

      {/* Prev / Next */}
      <nav
        className="flex justify-between gap-4 text-xs text-[var(--fg-muted)]"
        aria-label="Post navigation"
      >
        <div className="flex-1">
          {prev && (
            <Link
              href={`/writing/${prev.slug}`}
              className="flex items-center gap-1.5 hover:text-[var(--accent)] transition-colors"
            >
              <ArrowLeft size={11} strokeWidth={1.5} />
              {prev.title}
            </Link>
          )}
        </div>
        <div className="flex-1 text-right">
          {next && (
            <Link
              href={`/writing/${next.slug}`}
              className="flex items-center justify-end gap-1.5 hover:text-[var(--accent)] transition-colors"
            >
              {next.title}
              <ArrowRight size={11} strokeWidth={1.5} />
            </Link>
          )}
        </div>
      </nav>
    </div>
    </>
  );
}
