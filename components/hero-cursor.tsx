"use client";

import { useEffect, useState } from "react";

const FULL_NAME = "Ayo Owolabi";
const TYPE_SPEED = 80; // ms per character

export function HeroCursor() {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayed(FULL_NAME);
      setDone(true);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(FULL_NAME.slice(0, i));
      if (i >= FULL_NAME.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, TYPE_SPEED);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="text-4xl font-semibold tracking-tight text-[var(--fg)]">
      <span className="text-[var(--accent)] mr-2 select-none" aria-hidden>
        &gt;
      </span>
      <span>{displayed}</span>
      <span
        className={`inline-block w-[2px] h-[1.1em] bg-[var(--accent)] align-middle ml-0.5 ${done ? "cursor-blink" : ""}`}
        aria-hidden
      />
    </span>
  );
}
