import type { Metadata } from "next";
import Link from "next/link";
import { AtSign, Code2, Globe, Mail } from "lucide-react";
import { content } from "@/lib/content";
import { CopyButton } from "@/components/copy-button";

export const metadata: Metadata = {
  title: "About",
  description: "Ayo Owolabi builds software that solves real problems for the people who run things. Bio and contact.",
};

const socials = [
  { label: "twitter / x", href: "https://x.com/ayobami_ot", Icon: AtSign },
  { label: "github", href: "https://github.com/ayobami-ot", Icon: Code2 },
  { label: "linkedin", href: "https://www.linkedin.com/in/ayo-owolabi-516906b2/", Icon: Globe },
  { label: "email", href: "mailto:ayo@bedrockteam.com", Icon: Mail },
];

interface BioBlockProps {
  label: string;
  text: string;
}

function BioBlock({ label, text }: BioBlockProps) {
  return (
    <div className="py-5 border-b border-[var(--border)]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--fg-muted)] uppercase tracking-widest">
          {label}
        </span>
        <CopyButton text={text} />
      </div>
      <p className="text-sm text-[var(--fg-muted)] leading-relaxed whitespace-pre-line">
        {text}
      </p>
    </div>
  );
}

export default async function AboutPage() {
  const bios = await content.getBios();

  return (
    <div
      className="mx-auto w-full px-6 py-16"
      style={{ maxWidth: "var(--measure-wide)" }}
    >
      <h1 className="text-2xl font-semibold text-[var(--fg)] mb-6">About</h1>

      <div className="mb-12 max-w-prose">
        <p className="text-sm text-[var(--fg)] leading-relaxed mb-4">
          I&apos;m Ayo, a builder based in Newcastle upon Tyne. I make software that
          solves real, unglamorous problems: the back-office work that quietly runs
          a business, handled so the people doing it can focus on what matters.
        </p>
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed mb-4">
          My thesis is simple. The leverage one person can get from good software
          is enormous, and growing. Work that used to need a whole team can
          increasingly be done well by a single focused person with the right
          tools. I build for that person, and most days I am that person.
        </p>
        <p className="text-sm text-[var(--fg-muted)] leading-relaxed">
          I write here about what I&apos;m building and what I&apos;m learning along
          the way. If something resonates, I&apos;d like to hear from you.
        </p>
      </div>

      <hr className="mb-10" />

      {/* Contact / socials */}
      <section className="mb-12">
        <h2 className="text-sm font-semibold text-[var(--fg-muted)] uppercase tracking-widest mb-4">
          Contact
        </h2>
        <div className="flex flex-wrap gap-5">
          {socials.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="flex items-center gap-1.5 text-sm text-[var(--fg-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <Icon size={13} strokeWidth={1.5} />
              {label}
            </Link>
          ))}
        </div>
      </section>

      <hr className="mb-10" />

      {/* Speaker / event bios */}
      <section>
        <h2 className="text-sm font-semibold text-[var(--fg-muted)] uppercase tracking-widest mb-1">
          Speaker bios
        </h2>
        <p className="text-xs text-[var(--fg-faint)] mb-6">
          Copy-paste ready. Update me if you need something different.
        </p>
        <BioBlock label="Short (1 sentence)" text={bios.short} />
        <BioBlock label="Medium (2–3 sentences)" text={bios.medium} />
        <BioBlock label="Long (full paragraph)" text={bios.long} />
      </section>
    </div>
  );
}
