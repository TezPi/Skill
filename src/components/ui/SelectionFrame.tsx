"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

const lines = [
  { key: "t", className: "inset-x-0 top-0 h-[3px] origin-left", axis: "scaleX" },
  { key: "r", className: "inset-y-0 right-0 w-[3px] origin-top", axis: "scaleY" },
  { key: "b", className: "inset-x-0 bottom-0 h-[3px] origin-right", axis: "scaleX" },
  { key: "l", className: "inset-y-0 left-0 w-[3px] origin-bottom", axis: "scaleY" },
] as const;

const handles = ["-top-[5px] -left-[5px]", "-top-[5px] -right-[5px]", "-bottom-[5px] -right-[5px]", "-bottom-[5px] -left-[5px]"];

/**
 * The brand's signature: a Figma selection box with sun registration handles.
 * With `draw`, the box is traced once (storytelling: the designer selecting
 * their own title). `play` holds the trace until the caller is ready, e.g.
 * until the intro curtain has lifted. Reduced motion renders it static via
 * MotionConfig.
 */
export function SelectionFrame({
  children,
  draw = false,
  play = true,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  draw?: boolean;
  play?: boolean;
  delay?: number;
  className?: string;
}) {
  const shown = !draw || play;
  return (
    <div className={cn("relative", className)}>
      {lines.map((line, i) => (
        <motion.span
          key={line.key}
          aria-hidden
          className={cn("absolute bg-sun", line.className)}
          initial={draw ? { [line.axis]: 0 } : false}
          animate={{ [line.axis]: shown ? 1 : 0 }}
          transition={{ duration: 0.5, delay: delay + i * 0.09, ease: EASE }}
        />
      ))}
      {handles.map((pos, i) => (
        <motion.span
          key={pos}
          aria-hidden
          className={cn("absolute z-[1] size-[13px] rounded-mark bg-sun", pos)}
          initial={draw ? { scale: 0 } : false}
          animate={{ scale: shown ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 520, damping: 22, delay: delay + 0.1 + i * 0.09 }}
        />
      ))}
      {children}
    </div>
  );
}
