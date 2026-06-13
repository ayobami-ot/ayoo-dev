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
