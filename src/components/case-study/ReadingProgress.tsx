"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** 2px signal bar; scaleX only, springs so it glides instead of stepping. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      data-print="hide"
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[55] h-0.5 origin-left bg-signal"
    />
  );
}
