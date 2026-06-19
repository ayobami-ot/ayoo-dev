import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import type { Block } from "@/lib/seo-content/types";
import { renderInlineHtml } from "./rich-text";

// Renders the ordered block array of a content asset. Every branch is
// defensive: an unknown block `type` or callout `variant` falls back gracefully
// and never throws, so a future block type can ship without breaking the build.

const calloutStyles: Record<string, string> = {
  note: "border-[var(--border)] text-[var(--fg-muted)]",
  info: "border-[var(--border)] text-[var(--fg-muted)]",
  warning: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  tip: "border-[var(--accent)]/40 text-[var(--accent)]",
};

function calloutIcon(variant: string) {
  switch (variant) {
    case "warning":
      return <AlertTriangle size={14} strokeWidth={1.5} />;
    case "tip":
      return <Lightbulb size={14} strokeWidth={1.5} />;
    default:
      return <Info size={14} strokeWidth={1.5} />;
  }
}

function Callout({ variant, text }: { variant: string; text: string }) {
  const key = variant in calloutStyles ? variant : "note";
  return (
    <div
      className={`not-prose my-6 flex gap-3 border-l-2 pl-4 py-1 text-sm ${calloutStyles[key]}`}
      role="note"
    >
      <span className="mt-0.5 shrink-0">{calloutIcon(key)}</span>
      <p className="m-0 leading-relaxed">{text}</p>
    </div>
  );
}

function FaqSection({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="not-prose my-8 space-y-5 border-t border-[var(--border)] pt-6">
      {items.map((item, i) => (
        <div key={i} className="space-y-1.5">
          <p className="text-sm font-semibold text-[var(--fg)]">
            {item.question}
          </p>
          <p className="text-sm leading-relaxed text-[var(--fg-muted)]">
            {item.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

function renderBlock(block: Block, key: number) {
  switch (block.type) {
    case "paragraph":
      return <p key={key}>{renderInlineHtml(block.html)}</p>;

    case "heading": {
      const level = Math.min(Math.max(Math.floor(block.level) || 2, 2), 4);
      const Tag = `h${level}` as "h2" | "h3" | "h4";
      return <Tag key={key}>{block.text}</Tag>;
    }

    case "list": {
      const items = Array.isArray(block.items) ? block.items : [];
      const children = items.map((item, i) => (
        <li key={i}>{renderInlineHtml(item)}</li>
      ));
      return block.ordered ? (
        <ol key={key}>{children}</ol>
      ) : (
        <ul key={key}>{children}</ul>
      );
    }

    case "table": {
      const headers = Array.isArray(block.headers) ? block.headers : [];
      const rows = Array.isArray(block.rows) ? block.rows : [];
      return (
        <div key={key} className="my-6 overflow-x-auto">
          <table>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "callout":
      return <Callout key={key} variant={block.variant} text={block.text} />;

    default:
      // Unknown block type — skip rather than crash.
      return null;
  }
}

export function ContentBody({ blocks }: { blocks: Block[] }) {
  if (!Array.isArray(blocks)) return null;

  // Render in order, but coalesce consecutive `faq` blocks into one section.
  const out: React.ReactNode[] = [];
  let faqRun: { question: string; answer: string }[] = [];

  const flushFaq = () => {
    if (faqRun.length > 0) {
      out.push(<FaqSection key={`faq-${out.length}`} items={faqRun} />);
      faqRun = [];
    }
  };

  blocks.forEach((block, i) => {
    if (block && block.type === "faq") {
      faqRun.push({ question: block.question, answer: block.answer });
      return;
    }
    flushFaq();
    const node = renderBlock(block, i);
    if (node) out.push(node);
  });
  flushFaq();

  return <>{out}</>;
}
