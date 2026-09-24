"use client";

import { motion } from "motion/react";
import { site } from "@/content/site";
import { SelectionFrame } from "@/components/ui/SelectionFrame";
import { MultiplayerCursor } from "@/components/ui/MultiplayerCursor";
import { useIntro } from "@/components/intro/IntroProvider";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Keeps the original PORT|FOLIO treatment (white word + boxed cobalt word inside a
 * sun selection frame) but spends it on the role, so the 5-second test is passed.
 * Load order: title fades up -> frame traces around it -> the designer's cursor
 * arrives at the corner handle. Waits for the intro curtain when it plays.
 */
export function HeroHeadline() {
  const { ready, cue } = useIntro();
  const base = cue("hero");

  return (
    <div className="relative inline-block pb-12 sm:pb-10">
      <SelectionFrame draw play={ready} delay={base + 0.2} className="px-3 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.55, ease: EASE, delay: base }}
          className="font-mono text-hero font-bold tracking-[0.06em] text-snow uppercase"
        >
          <span className="sr-only">{site.name}, </span>
          <span className="block pl-[0.04em]">UI/UX</span>
          <span className="mt-[0.08em] inline-block rounded-card bg-snow px-[0.1em] pt-[0.06em] pb-[0.02em] text-cobalt [text-shadow:-0.07em_0.03em_0.03em_rgb(11_11_12/0.22)]">
            Designer
          </span>
        </motion.h1>
      </SelectionFrame>

      {/* Multiplayer cursor: the designer "holding" their own title */}
      <MultiplayerCursor
        label={site.handle}
        show={ready}
        delay={base + 0.75}
        className="absolute right-0 bottom-0 translate-x-2 sm:translate-x-6"
      />
    </div>
  );
}
