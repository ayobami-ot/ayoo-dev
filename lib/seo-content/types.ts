// Types for the Scarab SEO/GEO content layer. These mirror the content API
// contract exactly — see storefront-seo-prompt.md, Section 2.

export interface ContentListItem {
  id: string;
  product: string;
  channel: string;
  archetype: string;
  routeGroup: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  index: boolean;
  publishedAt: string;
  updatedAt: string;
}

// The ordered block array. Each block is rendered by `type`; unknown types are
// skipped by the renderer rather than crashing the build.
export type Block =
  | { type: "paragraph"; html: string }
  | { type: "heading"; text: string; level: number }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; variant: string; text: string }
  | { type: "faq"; question: string; answer: string };

export interface ContentAsset extends ContentListItem {
  body: Block[];
  // Injected verbatim into a <script type="application/ld+json"> tag.
  jsonLd: unknown;
}

export interface ContentListResponse {
  data: ContentListItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
