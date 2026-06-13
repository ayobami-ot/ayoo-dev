import Link from "next/link";

interface TagProps {
  tag: string;
  href?: string;
  active?: boolean;
}

export function Tag({ tag, href, active }: TagProps) {
  const className = [
    "inline-block text-xs px-1.5 py-0.5 border rounded-sm font-mono transition-colors",
    active
      ? "border-[var(--accent)] text-[var(--accent)]"
      : "border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={className}>
        [{tag}]
      </Link>
    );
  }

  return <span className={className}>[{tag}]</span>;
}
