import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { content } from "@/lib/content";
import { StatusBadge } from "@/components/status-badge";

export const metadata: Metadata = {
  title: "Building",
  description: "Products and projects in various stages of life.",
};

export default async function BuildingPage() {
  const projects = await content.listProjects();

  return (
    <div
      className="mx-auto w-full px-6 py-16"
      style={{ maxWidth: "var(--measure-wide)" }}
    >
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--fg)] mb-2">Building</h1>
        <p className="text-sm text-[var(--fg-muted)] max-w-prose">
          A portfolio of products at different stages. I operate as a solo founder
          across all of these — some are live, some are in progress.
        </p>
      </div>

      <div className="space-y-0">
        {projects.map((project) => (
          <div
            key={project.slug}
            className="py-6 border-b border-[var(--border)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-base font-semibold text-[var(--fg)]">
                    {project.name}
                  </span>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-3 max-w-prose">
                  {project.description}
                </p>
                <p className="text-xs text-[var(--fg-faint)]">
                  Role: {project.role}
                </p>
              </div>
              {project.links.length > 0 && (
                <div className="flex flex-col gap-2 shrink-0">
                  {project.links.map((link) => (
                    <Link
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
                    >
                      {link.label}
                      <ExternalLink size={11} strokeWidth={1.5} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
