# Build prompt: Storefront marketing site — SEO content layer (Scarab)

You are extending an **existing** marketing/storefront site to receive and render SEO/GEO content
published by the Scarab content OS. This is **not** a new build. Read the existing repository first
and preserve the current landing page, design system, branding, fonts, components, and deployment
**exactly** as they are. You are adding a statically-generated SEO content layer on top, fed at build
time by an external content API.

If anything is ambiguous, ask before assuming. Build in the order at the end and stop to verify
rendering before wiring deployment.

## 0. Fill these in before you start

Replace every placeholder below throughout this prompt with the values for this storefront:

| Placeholder           | Meaning                                              | Example                       |
| --------------------- | ---------------------------------------------------- | ----------------------------- |
| `{{PRODUCT_KEY}}`     | The product's key in the Scarab OS (URL-safe slug)   | `acme`                        |
| `{{PRODUCT_NAME}}`    | The product's display name (branding)                | `Acme`                        |
| `{{MARKETING_DOMAIN}}`| The marketing site's canonical domain                | `https://acme.com`            |
| `{{APP_DOMAIN}}`      | The product app's domain (if separate from marketing)| `https://app.acme.com`        |

The content pages you build must look unmistakably like **{{PRODUCT_NAME}}**: same header/footer
shell, same fonts, same design tokens, same visual language as the existing site.

## 1. The existing site (do not disturb it)

**Inspect the repository first and confirm its actual stack, fonts, design tokens, and deploy
pipeline before changing anything.** These sites are typically a statically-generated Next.js
(App Router, TypeScript) site with Tailwind and CSS-variable design tokens, no backend, and content
currently hardcoded in React components — but verify rather than assume. Match whatever framework,
styling system, fonts, and deployment the existing repo uses; do **not** introduce a second stack or
a second visual language.

The new content pages arrive as **structured data, not styled HTML** — you own all presentation, and
it must reuse the existing shell, fonts, and tokens so the pages belong to this site.

## 2. The content API contract (the source of truth — build against this exactly)

Base URL is provided via env (Section 6). Auth on every request:

```
Authorization: Bearer <CONTENT_API_READ_TOKEN>
```

### `GET /api/content/{{PRODUCT_KEY}}?channel=seo&status=published&page=1&page_size=50`

Paginated list of published assets. Page through all pages (use `pagination.totalPages`) to assemble
the complete set. Each item carries: `id, product, channel, archetype, routeGroup, slug, title,
metaTitle, metaDescription, index, publishedAt, updatedAt` (no `body`).

### `GET /api/content/{{PRODUCT_KEY}}/:slug`

The full asset, adding `body` (the block array) and `jsonLd`.

### The asset fields you render

- `title` — the page **H1** (the `body` does NOT contain the H1; it starts with the lead paragraph).
- `metaTitle` — the HTML `<title>`.
- `metaDescription` — meta description and OG/Twitter description.
- `routeGroup` + `slug` — the URL: `{{MARKETING_DOMAIN}}/{routeGroup}/{slug}`.
- `index` (boolean) — when `false`, add `<meta name="robots" content="noindex">` and exclude from the sitemap.
- `jsonLd` — inject verbatim into a `<script type="application/ld+json">` in the page head.
- `body` — the ordered block array (Section 3).

### The block vocabulary (exact shapes)

Render each block by `type`. **Note carefully which field each block uses — some carry inline HTML, some carry plain text:**

| type        | fields                    | field semantics                                                                                                  |
| ----------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `paragraph` | `{ html }`                | `html` contains inline markup (e.g. `<strong>`) — sanitize then render as rich text                              |
| `heading`   | `{ text, level }`         | `text` is **plain**; render as `<h{level}>` (levels are 2+, since H1 is the title)                               |
| `list`      | `{ ordered, items[] }`    | each item is an **HTML** string with inline markup — sanitize each                                               |
| `table`     | `{ headers[], rows[][] }` | plain-text cells; `rows` is an array of row arrays aligned to `headers`                                          |
| `callout`   | `{ variant, text }`       | `text` is **plain**; `variant` seen: `tip`, `warning` (design `info`/`note` and an unknown-variant fallback too) |
| `faq`       | `{ question, answer }`    | both **plain** text                                                                                              |

Build a defensive renderer: an unknown block `type` or `variant` must be skipped or fall back
gracefully, never crash the build. Sanitize all HTML fields with an allowlist limited to inline tags
(`strong, em, b, i, a[href], code, br`); render sanitized HTML safely. Plain-text fields are rendered
as text, never as HTML.

## 3. What to build

**Build-time data layer.** A small server-only module that fetches the full published list
(paginating through all pages) and each asset by slug, using the build-time env. This runs only at
build; the read token must never reach the client.

**Routing, mounted by `routeGroup` (archetype-agnostic — this is the key requirement).** A dynamic
route `app/[routeGroup]/[slug]/page.tsx`. `generateStaticParams` returns only the real
`{ routeGroup, slug }` pairs **derived from the published list**, so every content page is statically
generated at build and any unknown path returns `notFound()`. **The OS is the source of truth for
site structure: whatever route groups it emits become URL subdirectories automatically — do NOT
hardcode an allowlist of route groups.** New content page types (archetypes) will introduce new route
groups over time (e.g. `compare`, `guides`, `explainers`, `takes`, `teardowns`); because the segment
is dynamic and params come from the published list, each new group appears with zero code changes on
the next rebuild. Ensure these dynamic segments never shadow existing static routes (the landing page
and any existing pages take precedence).

**Page template.** Per page: `<title>` = `metaTitle`; H1 = `title`; then the rendered `body` blocks
in order; canonical `{{MARKETING_DOMAIN}}/{routeGroup}/{slug}`; OG/Twitter tags from
`metaTitle`/`metaDescription` and the site's existing default OG image; robots `noindex` when `index`
is false; `jsonLd` injected in head. Wrap it all in the existing site shell with long-form prose
styling (comfortable measure, readable line length, the site's type scale). Style consecutive `faq`
blocks as a coherent FAQ section. Tables need a responsive wrapper (horizontal scroll on narrow
screens). Callouts get distinct styling per variant in the site's palette.

**Per-routeGroup hub pages.** A `app/[routeGroup]/page.tsx` listing the published assets in that group
(title + description, linking to each), statically generated, for internal linking and crawlability.
This is also archetype-agnostic — it covers any new route group automatically. Link to these hubs from
the footer. This builds the topical-authority internal-linking structure the SEO strategy depends on.

**Sitemap and robots.** Generate `sitemap.xml` (via `app/sitemap.ts`) from all published assets with
`index: true`, plus the hub pages; reference it from `robots.txt`. Exclude `noindex` assets.

**Design.** Desktop-first but fully responsive. Reuse the existing tokens, fonts, and components; do
not introduce a second visual language. Keep motion restrained on long-form content.

> If the existing site is **not** Next.js App Router, implement the equivalents in its framework: a
> single dynamic catch-all route keyed on `routeGroup`/`slug` with params sourced from the published
> list, dynamic per-group hub pages, and build-time (SSG) generation. The archetype-agnostic routing
> requirement is non-negotiable regardless of framework.

## 4. Deployment wiring

- Add a content rebuild trigger to the **existing** deploy workflow so a publish/update in the OS
  rebuilds and redeploys the site. For GitHub Actions, add `repository_dispatch` with
  `types: [content-published]` alongside the current triggers. The OS already fires:
  ```
  POST /repos/{MARKETING_REPO}/dispatches
  { "event_type": "content-published", "client_payload": { "product": "{{PRODUCT_KEY}}", "slug": "..." } }
  ```
  (`MARKETING_REPO` is configured OS-side per product.) Because pages are generated at build time, a
  newly-introduced route group (new archetype) goes live automatically on the rebuild this dispatch
  triggers.
- New build-time env vars: `CONTENT_API_BASE_URL` (the OS host) and `CONTENT_API_READ_TOKEN`. Wire
  them as deploy secrets / build args. **Keep them server/build-side only — never `NEXT_PUBLIC_` or
  otherwise client-exposed**, since the token is secret and these are used only at build.
- Canonical/sitemap base is `{{MARKETING_DOMAIN}}` (the marketing domain). If the site already has an
  app-URL env var (e.g. `NEXT_PUBLIC_APP_URL` pointing at `{{APP_DOMAIN}}`), keep it distinct; use a
  dedicated site-URL var (e.g. `NEXT_PUBLIC_SITE_URL`, default `{{MARKETING_DOMAIN}}`) for canonicals.

## 5. Guardrails

- Do not modify the existing landing page or its components beyond adding footer links to the hubs.
- If the content API is unreachable or errors at build time, **fail the build loudly** — never deploy
  a site with missing or empty content pages.
- Sanitize all HTML fields; render plain-text fields as text.
- Typed throughout; `.env.example` updated; README updated with the new env vars and the dispatch trigger.
- Content quality is governed upstream at the OS review gate; this site renders faithfully whatever is
  published. Do not add content-editing logic here.

## 6. Build order — build, verify rendering, then wire deployment

1. **Render layer first.** Build the data layer, the `[routeGroup]/[slug]` route, the page template,
   and the six block renderers in the site's branding. Point `CONTENT_API_BASE_URL` at your running OS
   and statically build the real published asset(s). **Stop and verify**: the pages render correctly,
   every block type displays, multiple route groups resolve, and they look unmistakably like
   {{PRODUCT_NAME}}. Eyeball a real content page end to end.
2. **Then structure + deploy.** Add the hub pages and footer links, the sitemap and robots, the
   content rebuild trigger, and the build-time env wiring. Report what changed, the new env vars, and
   how the rebuild trigger is wired.

Confirm your understanding of Section 2 (render against the real contract, HTML vs plain-text fields),
that routing is archetype-agnostic (Section 3), and that this is an extension preserving the existing
site, then begin.
