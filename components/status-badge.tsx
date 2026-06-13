import type { Project } from "@/lib/content";

const labels: Record<Project["status"], string> = {
  live: "live",
  building: "building",
  paused: "paused",
  sunset: "sunset",
};

const colors: Record<Project["status"], string> = {
  live: "text-[var(--accent)] border-[var(--accent)]",
  building: "text-[var(--fg-muted)] border-[var(--fg-muted)]",
  paused: "text-[var(--fg-faint)] border-[var(--fg-faint)]",
  sunset: "text-[var(--fg-faint)] border-[var(--fg-faint)]",
};

export function StatusBadge({ status }: { status: Project["status"] }) {
  return (
    <span
      className={`inline-block text-xs border rounded-sm px-1.5 py-0.5 font-mono ${colors[status]}`}
    >
      [{labels[status]}]
    </span>
  );
}
