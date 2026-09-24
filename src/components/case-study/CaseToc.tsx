"use client";

import { motion } from "motion/react";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { cn } from "@/lib/cn";

/**
 * Sticky contents for long case studies: where am I, what's left, jump anywhere.
 * The cobalt bar fills per section read (step progress, not scroll-linked jitter).
 */
export function CaseToc({ sections }: { sections: { id: string; nav: string }[] }) {
  const ids = sections.map((s) => s.id);
  const active = useScrollSpy(ids);
  const activeIndex = Math.max(0, ids.indexOf(active ?? ids[0]));
  const progress = (activeIndex + 1) / sections.length;

  return (
    <nav aria-label="Case study contents" className="sticky top-24">
      <p className="label text-fg-muted">Contents</p>
      <div className="relative mt-5 pl-5">
        <span aria-hidden className="absolute top-0 bottom-0 left-0 w-[3px] rounded-full bg-line" />
        <motion.span
          aria-hidden
          className="absolute top-0 bottom-0 left-0 w-[3px] origin-top rounded-full bg-cobalt dark:bg-cobalt-soft"
          animate={{ scaleY: progress }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        />
        <ol className="flex flex-col gap-1">
          {sections.map((section) => {
            const isActive = section.id === active;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "block py-1 font-mono text-nav font-bold transition-colors duration-150",
                    isActive ? "text-fg" : "text-fg-muted hover:text-fg",
                  )}
                >
                  {section.nav}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
