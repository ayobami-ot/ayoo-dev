import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Now",
  description: "What Ayo is focused on right now.",
};

// Update this page whenever your focus changes.
// See nownownow.com for the convention.
const LAST_UPDATED = "2026-06-13";

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
            Primarily focused on Scarab HQ — shipping the content pipeline that
            feeds this site and opening it up for other operators to use. The
            architecture is mostly done; I&apos;m working on the onboarding experience
            and documentation.
          </p>
          <p className="mt-3 text-[var(--fg-muted)]">
            Also doing early customer discovery for Legworker.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-widest mb-3">
            Writing
          </h2>
          <p>
            Building up a cadence on this site. Trying to publish twice a week —
            a mix of longer essays and shorter observations.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-widest mb-3">
            Reading
          </h2>
          <p>
            <em>The Innovator&apos;s Dilemma</em> by Clayton Christensen — re-reading it
            with fresh eyes now that I&apos;m on the operator side rather than the
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
