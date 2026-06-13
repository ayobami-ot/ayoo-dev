interface PersonLdProps {
  url?: string;
}

export function PersonJsonLd({ url = "https://ayoo.dev" }: PersonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ayo Owolabi",
    url,
    sameAs: [
      "https://x.com/ayobami_ot",
      "https://github.com/ayobami-ot",
      "https://www.linkedin.com/in/ayo-owolabi-516906b2/",
    ],
    jobTitle: "Technical Founder",
    description:
      "Technical founder building a portfolio of products and writing about where technology is going.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface BlogPostingLdProps {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
}

export function BlogPostingJsonLd({
  title,
  description,
  slug,
  publishedAt,
  updatedAt,
  tags,
}: BlogPostingLdProps) {
  const url = `https://ayoo.dev/writing/${slug}`;
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    keywords: tags.join(", "),
    author: {
      "@type": "Person",
      name: "Ayo Owolabi",
      url: "https://ayoo.dev",
    },
    publisher: {
      "@type": "Person",
      name: "Ayo Owolabi",
      url: "https://ayoo.dev",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
