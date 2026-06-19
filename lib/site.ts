// Canonical/site base URL. Distinct from any future app-domain var so canonicals
// and sitemap entries always point at the marketing domain (ayoo.dev).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayoo.dev"
).replace(/\/$/, "");
