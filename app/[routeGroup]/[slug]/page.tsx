import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import {
  getAssetBySlug,
  listPublishedAssets,
} from "@/lib/seo-content/client";
import { ContentBody } from "@/components/seo-content/blocks";
import { humanizeGroup } from "@/lib/seo-content/format";

interface Props {
  params: Promise<{ routeGroup: string; slug: string }>;
}

// Only the real published pairs are generated; every other path 404s.
export const dynamicParams = false;

export async function generateStaticParams() {
  const assets = await listPublishedAssets();
  return assets.map((a) => ({ routeGroup: a.routeGroup, slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { routeGroup, slug } = await params;
  const asset = await getAssetBySlug(slug);
  if (!asset || asset.routeGroup !== routeGroup) return {};

  const canonical = `${SITE_URL}/${routeGroup}/${slug}`;
  return {
    title: asset.metaTitle,
    description: asset.metaDescription,
    alternates: { canonical },
    robots: asset.index ? undefined : { index: false, follow: false },
    openGraph: {
      title: asset.metaTitle,
      description: asset.metaDescription,
      url: canonical,
      type: "article",
      images: [{ url: "/api/og", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: asset.metaTitle,
      description: asset.metaDescription,
    },
  };
}

export default async function ContentPage({ params }: Props) {
  const { routeGroup, slug } = await params;
  const asset = await getAssetBySlug(slug);
  if (!asset || asset.routeGroup !== routeGroup) notFound();

  return (
    <>
      {asset.jsonLd != null && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(asset.jsonLd) }}
        />
      )}
      <div
        className="mx-auto w-full px-6 py-16"
        style={{ maxWidth: "var(--measure-wide)" }}
      >
        <Link
          href={`/${routeGroup}`}
          className="inline-flex items-center gap-1.5 text-xs text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors mb-10"
        >
          <ArrowLeft size={12} strokeWidth={1.5} />
          {humanizeGroup(routeGroup)}
        </Link>

        <header className="mb-10">
          <h1 className="text-2xl font-semibold text-[var(--fg)] leading-snug">
            {asset.title}
          </h1>
        </header>

        <hr className="mb-10" />

        <article className="prose">
          <ContentBody blocks={asset.body} />
        </article>
      </div>
    </>
  );
}
