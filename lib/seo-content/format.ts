// Turn a route-group slug ("explainers", "compare") into a display label
// ("Explainers", "Compare") for hub titles, breadcrumbs and footer links.
export function humanizeGroup(group: string): string {
  return group
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
