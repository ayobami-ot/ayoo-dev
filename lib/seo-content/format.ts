// Turn a route-group slug ("explainers", "compare") into a display label
// ("Explainers", "Compare") for hub titles, breadcrumbs and footer links.
export function humanizeGroup(group: string): string {
  return group
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// Scarab timestamps are full ISO ("2026-06-19T16:18:35.714+00:00"); the Writing
// aesthetic shows a plain YYYY-MM-DD date.
export function formatDate(iso: string): string {
  return (iso ?? "").slice(0, 10);
}
