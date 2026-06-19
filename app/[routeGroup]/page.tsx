import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import {
  listPublishedAssets,
  listRouteGroups,
} from "@/lib/seo-content/client";
import { formatDate, humanizeGroup } from "@/lib/seo-content/format";

interface Props {
  params: Promise<{ routeGroup: string }>;
}

// Archetype-agnostic: a hub exists for whatever route groups the OS publishes.
export const dynamicParams = false;

export async function generateStaticParams() {
  const groups = await listRouteGroups();
  return groups.map((routeGroup) => ({ routeGroup }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { routeGroup } = await params;
  const label = humanizeGroup(routeGroup);
  return {
    title: label,
    description: `${label} from Ayo Owolabi.`,
    alternates: { canonical: `${SITE_URL}/${routeGroup}` },
  };
}

export default async function HubPage({ params }: Props) {
  const { routeGroup } = await params;
  const assets = await listPublishedAssets();
  const inGroup = assets
    .filter((a) => a.routeGroup === routeGroup && a.index)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  if (inGroup.length === 0) notFound();

  return (
    <div
      className="mx-auto w-full px-6 py-16"
      style={{ maxWidth: "var(--measure-wide)" }}
    >
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--fg)] mb-2">
          {humanizeGroup(routeGroup)}
        </h1>
        <p className="text-sm text-[var(--fg-muted)]">
          {inGroup.length} {inGroup.length === 1 ? "piece" : "pieces"}
        </p>
      </div>

      <div>
        {inGroup.map((asset) => (
          <Link
            key={asset.slug}
            href={`/${routeGroup}/${asset.slug}`}
            className="group flex items-baseline gap-4 py-2.5 border-b border-[var(--border)] hover:border-[var(--fg-faint)] transition-colors"
          >
            <time
              dateTime={asset.publishedAt}
              className="shrink-0 text-xs text-[var(--fg-muted)] tabular-nums w-24"
            >
              {formatDate(asset.publishedAt)}
            </time>
            <span className="flex-1 text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
              {asset.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
