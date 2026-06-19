import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import {
  listPublishedAssets,
  listRouteGroups,
} from "@/lib/seo-content/client";
import { humanizeGroup } from "@/lib/seo-content/format";

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
  const inGroup = assets.filter(
    (a) => a.routeGroup === routeGroup && a.index,
  );
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
      </div>

      <div>
        {inGroup.map((asset) => (
          <Link
            key={asset.slug}
            href={`/${routeGroup}/${asset.slug}`}
            className="group flex items-start justify-between gap-4 py-4 border-b border-[var(--border)]"
          >
            <div>
              <span className="text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                {asset.title}
              </span>
              {asset.metaDescription && (
                <p className="mt-1 text-xs text-[var(--fg-muted)] leading-relaxed max-w-prose">
                  {asset.metaDescription}
                </p>
              )}
            </div>
            <ArrowRight
              size={13}
              strokeWidth={1.5}
              className="mt-1 shrink-0 text-[var(--fg-faint)] group-hover:text-[var(--accent)] transition-colors"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
