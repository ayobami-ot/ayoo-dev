import Link from "next/link";
import { listRouteGroups } from "@/lib/seo-content/client";
import { humanizeGroup } from "@/lib/seo-content/format";

export async function Footer() {
  const year = new Date().getFullYear();
  // Hub links for whatever content groups the OS has published (empty until wired).
  const groups = await listRouteGroups();

  return (
    <footer className="mt-auto border-t border-[var(--border)]">
      <div
        className="mx-auto flex flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs text-[var(--fg-muted)]"
        style={{ maxWidth: "var(--measure-wide)" }}
      >
        <span>© {year} Ayo Owolabi</span>
        <div className="flex flex-wrap gap-4">
          {groups.map((group) => (
            <Link
              key={group}
              href={`/${group}`}
              className="hover:text-[var(--accent)] transition-colors"
            >
              {humanizeGroup(group)}
            </Link>
          ))}
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
