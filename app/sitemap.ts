import type { MetadataRoute } from "next";
import { content } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import {
  listPublishedAssets,
  listRouteGroups,
} from "@/lib/seo-content/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, seoAssets, seoGroups] = await Promise.all([
    content.listPosts(),
    listPublishedAssets(),
    listRouteGroups(),
  ]);

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/writing/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Per-routeGroup hub pages (only groups with at least one indexable asset).
  const indexableGroups = new Set(
    seoAssets.filter((a) => a.index).map((a) => a.routeGroup),
  );
  const hubEntries: MetadataRoute.Sitemap = seoGroups
    .filter((group) => indexableGroups.has(group))
    .map((group) => ({
      url: `${SITE_URL}/${group}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }));

  // Published SEO content pages, excluding noindex assets.
  const seoEntries: MetadataRoute.Sitemap = seoAssets
    .filter((a) => a.index)
    .map((a) => ({
      url: `${SITE_URL}/${a.routeGroup}/${a.slug}`,
      lastModified: new Date(a.updatedAt ?? a.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/writing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/building`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/now`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...postEntries,
    ...hubEntries,
    ...seoEntries,
  ];
}
