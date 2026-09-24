"use client";

import { motion } from "motion/react";
import { NavigationArrowIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

/** Figma multiplayer cursor with a name tag. Decorative: always aria-hidden. */
export function MultiplayerCursor({
  label,
  show = true,
  delay = 0,
  className,
}: {
  label: string;
  show?: boolean;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none flex items-start gap-1", className)}
      initial={{ opacity: 0, x: 70, y: 40 }}
      animate={show ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 70, y: 40 }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay }}
    >
      <NavigationArrowIcon size={30} weight="fill" className="-mt-1 text-sun drop-shadow-[1px_2px_0_rgb(25_47_129/0.6)]" />
      <span className="mt-5 rounded-control bg-sun px-2.5 py-1 font-mono text-[0.8125rem] font-bold tracking-[0.06em] text-cobalt-deep">
        {label}
      </span>
    </motion.div>
  );
}
