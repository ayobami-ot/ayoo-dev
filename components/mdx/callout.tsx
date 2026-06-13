import { AlertTriangle, Info, Lightbulb } from "lucide-react";

type CalloutType = "note" | "warning" | "tip";

const icons = {
  note: <Info size={14} strokeWidth={1.5} />,
  warning: <AlertTriangle size={14} strokeWidth={1.5} />,
  tip: <Lightbulb size={14} strokeWidth={1.5} />,
};

const styles: Record<CalloutType, string> = {
  note: "border-[var(--border)] text-[var(--fg-muted)]",
  warning: "border-amber-500/40 text-amber-600 dark:text-amber-400",
  tip: "border-[var(--accent)]/40 text-[var(--accent)]",
};

interface CalloutProps {
  type?: CalloutType;
  children: React.ReactNode;
}

export function Callout({ type = "note", children }: CalloutProps) {
  return (
    <div
      className={`my-6 flex gap-3 border-l-2 pl-4 py-1 text-sm ${styles[type]}`}
      role="note"
    >
      <span className="mt-0.5 shrink-0">{icons[type]}</span>
      <div className="[&>p]:m-0">{children}</div>
    </div>
  );
}
