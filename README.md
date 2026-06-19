# ayoo.dev

Personal site for Ayo Owolabi. Next.js App Router, TypeScript strict, Tailwind v4, Geist Mono, shadcn/ui primitives.

## Dev

```bash
npm run dev
```

## How to add a post

Drop an `.mdx` file in `content/posts/`. Frontmatter:

```yaml
---
title: "Your post title"
description: "One sentence description for SEO and list views."
tags: ["tag1", "tag2"]
publishedAt: "2026-01-15"   # YYYY-MM-DD
draft: false                 # true to hide from public
---
```

The slug is derived from the filename. `my-post.mdx` → `/writing/my-post`.

## How to add a project

Drop a `.json` file in `content/projects/`. Schema:

```json
{
  "slug": "my-project",
  "name": "My Project",
  "description": "One sentence.",
  "status": "live",        // live | building | paused | sunset
  "role": "Founder",
  "links": [{ "label": "myproject.com", "url": "https://myproject.com" }],
  "featured": true,        // appears on the home page
  "order": 4               // sort order on /building
}
```

## How to swap fonts or accent colour

- **Font:** Change the Google Font import in `app/layout.tsx` (swap `Geist_Mono` for another) and update `--font-geist-mono` CSS variable references in `globals.css` to match the new variable name.
- **Accent colour:** Change `--accent` in `app/globals.css` — one variable in `:root` (light) and one in `.dark`. Done.

## Scarab SEO content layer

Beyond the hand-authored MDX writing, the site renders SEO/GEO content published
by the **Scarab content OS**. These pages are fetched **at build time** from a
read API and statically generated; nothing is fetched at runtime and the read
token never reaches the client or the runtime image.

**How it works**

- The build-time data layer lives in `lib/seo-content/`. It pages through the
  published list and fetches each asset by slug.
- Routing is **archetype-agnostic**: `app/[routeGroup]/[slug]/page.tsx` and the
  hub `app/[routeGroup]/page.tsx` generate their params from the published list,
  so whatever route groups Scarab emits (`compare`, `guides`, `explainers`,
  `takes`, `teardowns`, …) become URL subdirectories automatically on the next
  rebuild — no code changes. Existing static routes always take precedence, and
  reserved root segments are skipped (`lib/seo-content/client.ts`).
- Block content is rendered by `components/seo-content/blocks.tsx`. Inline HTML
  (`paragraph`/`list`) is sanitized to an allowlist (`strong, em, b, i, a[href],
  code, br`) by `rich-text.tsx`, which parses to React elements and never uses
  `dangerouslySetInnerHTML` — unknown tags/attrs degrade to plain text.
- `noindex` assets get a `robots: noindex` meta and are excluded from the
  sitemap; the sitemap and footer pick up the hub pages automatically.

**Environment** (build-time only — see `.env.example`)

| Var | Required | Purpose |
| --- | --- | --- |
| `CONTENT_API_BASE_URL` | to enable | Scarab content OS host |
| `CONTENT_API_READ_TOKEN` | to enable | Bearer token for the read API (secret) |
| `CONTENT_API_PRODUCT_KEY` | no (default `ayoo`) | This storefront's product key in Scarab |
| `NEXT_PUBLIC_SITE_URL` | no (default `https://ayoo.dev`) | Base for canonicals/sitemap |

If the API vars are unset, the content layer is disabled and the site builds
without those pages. If they are set but the API errors, **the build fails
loudly** rather than shipping empty content.

**Deployment** — the GitHub Actions deploy (`.github/workflows/deploy.yml`)
passes these to `docker build` as build args (consumed in the builder stage,
not carried into the runner image). Wire `CONTENT_API_BASE_URL` /
`CONTENT_API_READ_TOKEN` as repo **secrets** and `CONTENT_API_PRODUCT_KEY` /
`NEXT_PUBLIC_SITE_URL` as repo **variables**. A publish in Scarab fires
`repository_dispatch` with `event_type: content-published`, which the workflow
listens for and rebuilds/redeploys — so new content (and new route groups) go
live automatically.

## How to switch content source to Supabase

1. Install the Supabase client: `npm install @supabase/supabase-js`
2. Implement the TODOs in `lib/content/supabase-source.ts` — see the schema comment at the top of that file.
3. Set `CONTENT_SOURCE=supabase` in your environment.
4. The active source is selected in `lib/content/index.ts`; no component or page changes needed.

## Architecture decisions

- **Content abstraction:** `ContentSource` interface in `lib/content/types.ts` decouples all UI from the storage layer. Default implementation reads MDX files. Supabase stub is ready to wire.
- **No client JS for routing/filtering:** Writing archive filter is URL-based (`?tag=foo`) and handled server-side. No state management overhead.
- **Theme:** `next-themes` with `defaultTheme: "dark"`, persisted in localStorage via the class strategy. Respects `prefers-color-scheme` via `enableSystem`.
- **Syntax highlighting:** `rehype-pretty-code` with dual themes (`github-dark-dimmed` / `github-light`). Shiki runs at build time — zero client JS.
- **OG images:** Edge-rendered at `/api/og?slug=<slug>` for posts; base `/api/og` for home/other pages.
