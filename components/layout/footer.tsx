import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div
        className="mx-auto flex items-center justify-between px-6 py-6 text-xs text-[var(--fg-muted)]"
        style={{ maxWidth: "var(--measure-wide)" }}
      >
        <span>© {year} Ayo Owolabi</span>
        <div className="flex gap-4">
          <Link href="/rss.xml" className="hover:text-[var(--accent)] transition-colors">
            RSS
          </Link>
          <Link href="/sitemap.xml" className="hover:text-[var(--accent)] transition-colors">
            sitemap
          </Link>
        </div>
      </div>
    </footer>
  );
}
