"use client";

import { motion } from "motion/react";
import { NavigationArrowIcon } from "@phosphor-icons/react";
import { site } from "@/content/site";
import { SelectionFrame } from "@/components/ui/SelectionFrame";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Keeps the original PORT|FOLIO treatment (white word + boxed cobalt word inside a
 * sun selection frame) but spends it on the role, so the 5-second test is passed.
 * Load order: title fades up -> frame traces around it -> the designer's cursor
 * arrives at the corner handle. Total < 1.2s and never blocks reading.
 */
export function HeroHeadline() {
  return (
    <div className="relative inline-block pb-12 sm:pb-10">
      <SelectionFrame draw delay={0.2} className="px-3 pt-4 pb-3 sm:px-5 sm:pt-5 sm:pb-4">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
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
      <motion.div
        aria-hidden
        className="absolute right-0 bottom-0 flex translate-x-2 items-start gap-1 sm:translate-x-6"
        initial={{ opacity: 0, x: 70, y: 40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.75 }}
      >
        <NavigationArrowIcon size={30} weight="fill" className="-mt-1 text-sun drop-shadow-[1px_2px_0_rgb(25_47_129/0.6)]" />
        <span className="mt-5 rounded-control bg-sun px-2.5 py-1 font-mono text-[0.8125rem] font-bold tracking-[0.06em] text-cobalt-deep">
          {site.handle}
        </span>
      </motion.div>
    </div>
  );
}
