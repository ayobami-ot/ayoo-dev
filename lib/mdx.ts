import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { Callout } from "@/components/mdx/callout";
import { Figure } from "@/components/mdx/figure";
import type { ReactNode } from "react";

const components = {
  Callout,
  Figure,
};

export async function renderMdx(source: string): Promise<{ content: ReactNode }> {
  const { content } = await compileMDX({
    source,
    components,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["anchor"],
                ariaHidden: true,
                tabIndex: -1,
              },
            },
          ],
          [
            rehypePrettyCode,
            {
              theme: {
                dark: "github-dark-dimmed",
                light: "github-light",
              },
              keepBackground: false,
            },
          ],
        ],
      },
    },
  });

  return { content };
}
