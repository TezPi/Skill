"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useMotionPreference } from "@/components/providers/MotionPreference";
import { EASE_EXPO } from "@/lib/motion";

/**
 * 3s per phrase with a 0.2s cross-blend: the outgoing phrase is still dissolving
 * when the next one rises, so the eye reads one flow instead of a cut.
 * Pauses on hover/focus and whenever the visitor pauses motion.
 */
export function TextRotator({ items, className }: { items: string[]; className?: string }) {
  const { paused } = useMotionPreference();
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (paused || hold || items.length < 2) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), 3000);
    return () => window.clearTimeout(id);
  }, [index, paused, hold, items.length]);

  return (
    <span
      className={className}
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <span className="sr-only">{items.join("; ")}</span>
      <span aria-hidden="true" className="inline-grid">
        <AnimatePresence initial={false}>
          <motion.span
            key={index}
            className="[grid-area:1/1] whitespace-nowrap"
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: EASE_EXPO, delay: 0.25 } }}
            exit={{ opacity: 0, y: -10, filter: "blur(8px)", transition: { duration: 0.45, ease: EASE_EXPO } }}
          >
            {items[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
