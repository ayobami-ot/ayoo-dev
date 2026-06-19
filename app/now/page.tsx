import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Now",
  description: "What Ayo is focused on right now.",
};

// Update this page whenever your focus changes.
// See nownownow.com for the convention.
const LAST_UPDATED = "2026-06-19";

export default function NowPage() {
  return (
    <div
      className="mx-auto w-full px-6 py-16"
      style={{ maxWidth: "var(--measure-wide)" }}
    >
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-[var(--fg)] mb-2">Now</h1>
        <p className="text-xs text-[var(--fg-faint)]">
          Last updated {LAST_UPDATED} ·{" "}
          <Link
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent)] transition-colors"
          >
            what is a /now page?
          </Link>
        </p>
      </div>

      <div className="space-y-8 text-sm text-[var(--fg)] leading-relaxed max-w-prose">
        <section>
          <h2 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-widest mb-3">
            Building
          </h2>
          <p>
            Most of my attention is on Scarab HQ, the AI-augmented back office
            that lets one person run every channel from a single place. The architecture is
            mostly done, so the work now is the onboarding experience and getting
            it into the hands of real operators.
          </p>
          <p className="mt-3 text-[var(--fg-muted)]">
            Minipod and Legworker are both live, so a lot of the work there is
            listening to users and refining. Intentlift is still early, validating
            whether the idea holds up.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-widest mb-3">
            Writing
          </h2>
          <p>
            Finding a rhythm with writing here. A mix of longer essays and
            shorter observations as things click into place.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-widest mb-3">
            Reading
          </h2>
          <p>
            <em>The Innovator&apos;s Dilemma</em> by Clayton Christensen. Re-reading
            it with fresh eyes now that I&apos;m on the operator side rather than the
            advisory side. Hits differently.
          </p>
          <p className="mt-3 text-[var(--fg-muted)]">
            Also working through the Stripe Press back-catalogue, slowly.
          </p>
        </section>
      </div>
    </div>
  );
}
