"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, Code, FigmaLogo } from "@phosphor-icons/react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Token = string | { chip: "figma" | "swatch" | "code" };

const LINE: Token[] = [
  "I design",
  { chip: "figma" },
  "AI products and",
  { chip: "swatch" },
  "design systems that feel obvious to use, then prototype them in code",
  { chip: "code" },
  "so the build matches the file.",
];

const chipBase = "inline-flex h-[0.78em] w-[1.5em] -translate-y-[0.06em] items-center justify-center border-[0.06em] border-fg align-middle";

function Chip({ kind }: { kind: "figma" | "swatch" | "code" }) {
  if (kind === "swatch") {
    return (
      <span className={`${chipBase} overflow-hidden`}>
        <span className="h-full flex-1 bg-paper" />
        <span className="h-full flex-1 bg-signal" />
        <span className="h-full flex-1 bg-ink" />
      </span>
    );
  }
  return (
    <span className={`${chipBase} ${kind === "figma" ? "bg-signal text-paper" : "bg-fg text-on-fg"}`}>
      {kind === "figma" ? <FigmaLogo weight="bold" className="size-[0.5em]" /> : <Code weight="bold" className="size-[0.5em]" />}
    </span>
  );
}

/** Scrubbed reveal: the sentence reads itself in as you scroll, one word at a time. */
export function Statement() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".sw",
          { opacity: 0.14 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: { trigger: ".statement", start: "top 78%", end: "bottom 52%", scrub: 0.6 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-label="What I do" className="section">
      <div className="shell">
        <p className="statement max-w-6xl text-[clamp(2rem,4.4vw,4rem)] font-extrabold leading-[1.12] tracking-[-0.03em]">
          {LINE.map((token, i) =>
            typeof token === "string" ? (
              token.split(" ").map((word, j) => (
                <span key={`${i}-${j}`} className="sw">
                  {word}{" "}
                </span>
              ))
            ) : (
              <span key={i} className="sw" aria-hidden="true">
                <Chip kind={token.chip} />{" "}
              </span>
            ),
          )}
        </p>
        <Link href="/about" className="link-line mt-14 text-lg font-bold">
          About
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
