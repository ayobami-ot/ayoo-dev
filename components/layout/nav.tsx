import Link from "next/link";
import { Rss } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/writing", label: "writing" },
  { href: "/building", label: "building" },
  { href: "/about", label: "about" },
  { href: "/now", label: "now" },
];

export function Nav() {
  return (
    <header className="w-full border-b border-[var(--border)]">
      <nav
        className="mx-auto flex items-center justify-between gap-6 px-6 py-4"
        style={{ maxWidth: "var(--measure-wide)" }}
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className="text-sm text-[var(--fg)] hover:text-[var(--accent)] transition-colors"
        >
          ayo
        </Link>

        <div className="flex items-center gap-5 text-sm text-[var(--fg-muted)]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {l.label}
            </Link>
          ))}

          <span className="text-[var(--fg-faint)]">·</span>

          <Link
            href="/rss.xml"
            aria-label="RSS feed"
            className="hover:text-[var(--accent)] transition-colors"
          >
            <Rss size={13} strokeWidth={1.5} />
          </Link>

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
