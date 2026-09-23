"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger direct children instead of moving the wrapper as one block. */
  stagger?: number;
  as?: "div" | "ul" | "ol";
};

/** Headings and blocks rise into place once, as they enter. A hierarchy cue, not decoration. */
export function Reveal({ children, className, stagger = 0, as = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const targets = stagger ? gsap.utils.toArray<HTMLElement>(el.children) : [el];
        gsap.from(targets, {
          y: 36,
          autoAlpha: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const Tag = as as "div";
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Tag>
  );
}
