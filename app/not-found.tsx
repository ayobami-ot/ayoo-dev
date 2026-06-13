import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="mx-auto w-full px-6 py-24"
      style={{ maxWidth: "var(--measure-wide)" }}
    >
      <p className="text-[var(--accent)] text-sm mb-4">404</p>
      <h1 className="text-2xl font-semibold text-[var(--fg)] mb-4">
        Page not found
      </h1>
      <p className="text-sm text-[var(--fg-muted)] mb-8">
        This page doesn&apos;t exist, or was moved.
      </p>
      <Link
        href="/"
        className="text-sm text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
      >
        → back home
      </Link>
    </div>
  );
}
