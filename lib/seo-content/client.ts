// Build-time data layer for the Scarab SEO content channel.
//
// This module is server/build only. It reads a secret token from the
// environment and must never be imported into a client component. The guard
// below makes accidental client usage fail loudly rather than leaking the token.
//
// Configuration (all build-time env, never NEXT_PUBLIC_):
//   CONTENT_API_BASE_URL    – host of the Scarab content OS
//   CONTENT_API_READ_TOKEN  – bearer token for the read API
//   CONTENT_API_PRODUCT_KEY – this storefront's product key in Scarab (default "ayoo")
//
// When the API is *not configured* (no base URL / token) the layer is disabled
// and returns nothing, so the existing site keeps building before secrets are
// wired. When it *is* configured but the API errors, we throw — a publish must
// never silently ship a site with missing content (guardrail, Section 5).

import type {
  ContentAsset,
  ContentListItem,
  ContentListResponse,
} from "./types";

if (typeof window !== "undefined") {
  throw new Error("lib/seo-content/client must not be used on the client");
}

// `||` (not `??`) so an unset GitHub variable that arrives as an empty build-arg
// still falls back to the default rather than producing an empty product key.
const PRODUCT_KEY = process.env.CONTENT_API_PRODUCT_KEY?.trim() || "ayoo";
const PAGE_SIZE = 50;

// Root route segments that already exist as static pages. Content route groups
// that collide with these are skipped so dynamic pages can never shadow them.
const RESERVED_ROUTE_GROUPS = new Set([
  "about",
  "api",
  "building",
  "now",
  "writing",
  "rss.xml",
  "sitemap.xml",
  "robots.txt",
  "icon.svg",
]);

function config(): { baseUrl: string; token: string } | null {
  const baseUrl = process.env.CONTENT_API_BASE_URL?.replace(/\/$/, "");
  const token = process.env.CONTENT_API_READ_TOKEN;
  if (!baseUrl || !token) return null;
  return { baseUrl, token };
}

export function isContentApiConfigured(): boolean {
  return config() !== null;
}

async function apiFetch(path: string): Promise<unknown> {
  const cfg = config();
  if (!cfg) throw new Error("content API is not configured");

  const url = `${cfg.baseUrl}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        Accept: "application/json",
      },
    });
  } catch (err) {
    throw new Error(
      `content API request failed (${url}): ${(err as Error).message}`,
    );
  }

  const text = await res.text();
  if (!res.ok) {
    throw new Error(
      `content API returned ${res.status} for ${url}: ${text.slice(0, 200)}`,
    );
  }
  try {
    return JSON.parse(text);
  } catch {
    const contentType = res.headers.get("content-type") ?? "unknown";
    throw new Error(
      `content API returned non-JSON (content-type: ${contentType}) for ${url}. ` +
        `First bytes: "${text.slice(0, 120).replace(/\s+/g, " ").trim()}". ` +
        `Check that CONTENT_API_BASE_URL points at the Scarab API host (not an app/login page) and CONTENT_API_READ_TOKEN is valid.`,
    );
  }
}

function isRenderableGroup(routeGroup: string): boolean {
  return Boolean(routeGroup) && !RESERVED_ROUTE_GROUPS.has(routeGroup);
}

/** Full published list, paginated through every page. Empty when disabled. */
export async function listPublishedAssets(): Promise<ContentListItem[]> {
  if (!isContentApiConfigured()) return [];

  const all: ContentListItem[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const raw = (await apiFetch(
      `/api/content/${PRODUCT_KEY}?channel=seo&status=published&page=${page}&page_size=${PAGE_SIZE}`,
    )) as ContentListResponse;

    const items = Array.isArray(raw?.items) ? raw.items : [];
    all.push(...items);
    totalPages = raw?.pagination?.totalPages ?? page;
    page += 1;
  } while (page <= totalPages);

  const renderable = all.filter((a) => isRenderableGroup(a.routeGroup));

  if (isContentApiConfigured() && renderable.length === 0) {
    // Configured but nothing came back — surface it without failing the build,
    // since "no content published yet" is a legitimate state.
    console.warn(
      `[seo-content] content API configured for product "${PRODUCT_KEY}" but returned 0 renderable assets`,
    );
  }
  return renderable;
}

/** Distinct, non-reserved route groups present in the published list. */
export async function listRouteGroups(): Promise<string[]> {
  const assets = await listPublishedAssets();
  return [...new Set(assets.map((a) => a.routeGroup))].sort();
}

/** A single published asset by slug, including body + jsonLd. */
export async function getAssetBySlug(
  slug: string,
): Promise<ContentAsset | null> {
  if (!isContentApiConfigured()) return null;

  const raw = (await apiFetch(
    `/api/content/${PRODUCT_KEY}/${encodeURIComponent(slug)}`,
  )) as ContentAsset | { item: ContentAsset } | null;

  const asset =
    raw && "item" in (raw as object)
      ? (raw as { item: ContentAsset }).item
      : (raw as ContentAsset | null);

  if (!asset || !isRenderableGroup(asset.routeGroup)) return null;
  return asset;
}
