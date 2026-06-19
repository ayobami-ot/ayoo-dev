import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { content } from "@/lib/content";
import { WritingRow } from "@/components/writing-row";
import { StatusBadge } from "@/components/status-badge";
import { HeroCursor } from "@/components/hero-cursor";

export const metadata: Metadata = {
  title: "Ayo Owolabi",
  description:
    "Building a portfolio of products and writing about where technology is going.",
};

export default async function HomePage() {
  const [posts, projects] = await Promise.all([
    content.listPosts(),
    content.listProjects(),
  ]);

  const recentPosts = posts.slice(0, 5);
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div
      className="mx-auto w-full px-6 py-16"
      style={{ maxWidth: "var(--measure-wide)" }}
    >
      {/* Hero */}
      <section className="mb-16">
        <div className="mb-6">
          <HeroCursor />
        </div>
        <p className="text-base text-[var(--fg)] leading-relaxed max-w-prose">
          Building a portfolio of products and writing about where technology is
          going.
        </p>
        <p className="mt-4 text-sm text-[var(--fg-muted)] leading-relaxed max-w-prose">
          I build software that takes real problems off people&apos;s plates: the
          scattered, repetitive work that quietly runs a business, handled well so
          one person can operate like a team. If you&apos;re curious about what
          I&apos;m building or how I think about it, have a look around.
        </p>
      </section>

      <hr className="mb-12" />

      {/* Writing */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-sm font-semibold text-[var(--fg-muted)] uppercase tracking-widest">
            Writing
          </h2>
          <Link
            href="/writing"
            className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
          >
            see all <ArrowRight size={11} strokeWidth={1.5} />
          </Link>
        </div>
        <div>
          {recentPosts.map((post) => (
            <WritingRow key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <hr className="mb-12" />

      {/* Building */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-semibold text-[var(--fg-muted)] uppercase tracking-widest">
            Building
          </h2>
          <Link
            href="/building"
            className="flex items-center gap-1 text-xs text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
          >
            see all <ArrowRight size={11} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="space-y-4">
          {featuredProjects.map((project) => (
            <div
              key={project.slug}
              className="flex items-start justify-between gap-4 py-3 border-b border-[var(--border)]"
            >
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-medium text-[var(--fg)]">
                    {project.name}
                  </span>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-xs text-[var(--fg-muted)] leading-relaxed max-w-md">
                  {project.description}
                </p>
              </div>
              {project.links[0] && (
                <Link
                  href={project.links[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[var(--fg-faint)] hover:text-[var(--accent)] transition-colors"
                  aria-label={`Visit ${project.name}`}
                >
                  <ExternalLink size={13} strokeWidth={1.5} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      <hr className="mb-12" />

      {/* Contact hook */}
      <section className="text-sm text-[var(--fg-muted)] leading-relaxed">
        <p className="max-w-prose">
          If you&apos;re organising something and want someone who can speak to
          building with AI without the hype,{" "}
          <Link
            href="/about"
            className="text-[var(--accent)] hover:underline underline-offset-3"
          >
            get in touch
          </Link>
          .
        </p>
        <p className="mt-2">
          <a
            href="mailto:ayo@bedrockteam.com"
            className="text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
          >
            → ayo@bedrockteam.com
          </a>
        </p>
      </section>
    </div>
  );
}
