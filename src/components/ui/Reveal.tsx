"use client";

import { motion } from "motion/react";
import { DURATION, EASE_EXPO, RISE } from "@/lib/motion";

type Tag = "div" | "section" | "li" | "p" | "span" | "article" | "header" | "figure" | "dl" | "ul";

/**
 * Rise + fade on first entry into view. Optional blur-to-focus for headlines.
 * Reduced-motion users get the fade only (MotionConfig drops transforms).
 */
export function Reveal({
  as = "div",
  children,
  className,
  delay = 0,
  y = RISE.lg,
  blur = false,
  amount = 0.2,
  id,
}: {
  as?: Tag;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  amount?: number;
  id?: string;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      id={id}
      className={className}
      initial={{ opacity: 0, y, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: DURATION.slow, ease: EASE_EXPO, delay }}
    >
      {children}
    </Comp>
  );
}
