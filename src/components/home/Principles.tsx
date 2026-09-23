"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { principles } from "@/content/profile";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PrincipleCard } from "./PrincipleCard";

/**
 * "Dương bản": the page inverts to paper for the section about how I decide.
 * The sheet settles from 0.94 → 1 as it enters (transform only).
 */
export function Principles() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.35"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <section aria-labelledby="principles-title" className="px-2 md:px-4">
      <motion.div
        ref={ref}
        style={{ scale, y }}
        className="surface-paper origin-top rounded-sheet bg-bg text-fg will-change-transform"
      >
        <div className="container-page py-20 md:py-32">
          <SectionHeader
            titleId="principles-title"
            eyebrow="How I decide"
            title="Five rules I hold every screen to."
            intro="Flip each one between before and after. The “after” copy is from Agent-X, in Vietnamese first with English below."
          />
          <div className="mt-14 md:mt-20">
            {principles.map((p, i) => (
              <PrincipleCard key={p.id} principle={p} index={i} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
