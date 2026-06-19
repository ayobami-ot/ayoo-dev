import { Fragment, type ReactNode } from "react";

// Renders the inline HTML carried by `paragraph` and `list` blocks.
//
// Safe by construction: the input is tokenised and only an allowlist of inline
// tags is ever turned into React elements. Everything else (unknown tags, all
// attributes except `href`, raw text) is emitted as plain text, which React
// escapes. There is no dangerouslySetInnerHTML anywhere, so a malformed or
// hostile string degrades to visible text — it can never inject markup.
//
// Allowlist (Section 2 of the build prompt): strong, em, b, i, a[href], code, br.

const ALLOWED_TAGS = new Set(["strong", "em", "b", "i", "code", "a", "br"]);
const VOID_TAGS = new Set(["br"]);
// Tags whose text content should be dropped entirely, not just unwrapped.
const STRIP_CONTENT_TAGS = new Set(["script", "style"]);

const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^<>"']|"[^"]*"|'[^']*')*?)\/?>/g;

interface Frame {
  tag: string;
  href?: string;
  children: ReactNode[];
}

function sanitizeHref(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const href = raw.trim();
  if (/^(https?:|mailto:)/i.test(href)) return href; // explicit safe schemes
  if (/^[/#]/.test(href)) return href; // root-relative or anchor
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return undefined; // any other scheme → drop
  return href; // scheme-less relative path
}

function extractHref(attrs: string): string | undefined {
  const m = attrs.match(/\bhref\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/i);
  if (!m) return undefined;
  return sanitizeHref(m[2] ?? m[3] ?? m[4]);
}

function buildElement(frame: Frame, key: number): ReactNode {
  const children = frame.children;
  switch (frame.tag) {
    case "strong":
    case "b":
      return <strong key={key}>{children}</strong>;
    case "em":
    case "i":
      return <em key={key}>{children}</em>;
    case "code":
      return <code key={key}>{children}</code>;
    case "a": {
      if (!frame.href) return <Fragment key={key}>{children}</Fragment>;
      const external = /^https?:/i.test(frame.href);
      return (
        <a
          key={key}
          href={frame.href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    }
    default:
      return <Fragment key={key}>{children}</Fragment>;
  }
}

export function renderInlineHtml(input: string): ReactNode {
  if (!input) return null;

  const root: Frame = { tag: "#root", children: [] };
  const stack: Frame[] = [root];
  let key = 0;
  let suppressDepth = 0; // inside <script>/<style>
  let lastIndex = 0;

  const pushText = (text: string) => {
    if (text && suppressDepth === 0) stack[stack.length - 1].children.push(text);
  };

  let match: RegExpExecArray | null;
  TAG_RE.lastIndex = 0;
  while ((match = TAG_RE.exec(input)) !== null) {
    pushText(input.slice(lastIndex, match.index));
    lastIndex = TAG_RE.lastIndex;

    const closing = match[1] === "/";
    const tag = match[2].toLowerCase();
    const selfClosing = match[0].endsWith("/>");

    if (STRIP_CONTENT_TAGS.has(tag)) {
      if (!closing && !selfClosing) suppressDepth += 1;
      else if (closing && suppressDepth > 0) suppressDepth -= 1;
      continue; // never render these tags
    }
    if (suppressDepth > 0) continue;
    if (!ALLOWED_TAGS.has(tag)) continue; // strip disallowed tag, keep its text

    if (VOID_TAGS.has(tag)) {
      stack[stack.length - 1].children.push(<br key={key++} />);
      continue;
    }

    if (!closing) {
      stack.push({ tag, href: extractHref(match[3]), children: [] });
    } else {
      // Pop to the nearest matching open tag; ignore stray closers.
      const idx = [...stack].reverse().findIndex((f) => f.tag === tag);
      if (idx === -1) continue;
      const depth = stack.length - 1 - idx;
      while (stack.length - 1 > depth) {
        const frame = stack.pop()!;
        stack[stack.length - 1].children.push(buildElement(frame, key++));
      }
      const frame = stack.pop()!;
      stack[stack.length - 1].children.push(buildElement(frame, key++));
    }
  }

  pushText(input.slice(lastIndex));

  // Flush any unclosed frames gracefully.
  while (stack.length > 1) {
    const frame = stack.pop()!;
    stack[stack.length - 1].children.push(buildElement(frame, key++));
  }

  return <>{root.children}</>;
}
