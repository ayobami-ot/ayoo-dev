// Canonical/site base URL. Distinct from any future app-domain var so canonicals
// and sitemap entries always point at the marketing domain (ayoo.dev).
// `||` (not `??`) so an unset GitHub variable arriving as an empty build-arg
// falls back to the default instead of yielding an empty base URL.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://ayoo.dev"
).replace(/\/$/, "");
