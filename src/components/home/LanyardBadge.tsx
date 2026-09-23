"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { site } from "@/content/site";

/**
 * The ID badge from the Figma About board, promoted to the hero: a face and a
 * name answer "who is this?" before any copy is read.
 * Motion: drops in on a lanyard once, then sways toward the pointer (spring,
 * motion values only, no React re-renders). Static under reduced motion.
 */
export function LanyardBadge() {
  const reduce = useReducedMotion();
  const tilt = useMotionValue(0);
  const rotate = useSpring(tilt, { stiffness: 110, damping: 7, mass: 0.8 });

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    tilt.set(offset * -7);
  }

  return (
    <motion.div
      className="flex origin-top flex-col items-center"
      initial={reduce ? false : { y: -120, rotate: 7 }}
      animate={{ y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 70, damping: 8, delay: 0.25 }}
    >
      <motion.div
        className="flex origin-top flex-col items-center"
        style={{ rotate }}
        onPointerMove={onPointerMove}
        onPointerLeave={() => tilt.set(0)}
      >
        {/* Strap + clip: simple geometric CSS, no illustration */}
        <span aria-hidden className="strap h-[clamp(4rem,14vh,9rem)] w-9 shadow-[inset_0_-6px_8px_-6px_rgb(11_11_12/0.25)]" />
        <span aria-hidden className="-mt-1 size-7 rounded-full border-[5px] border-[#c9ccd3] shadow-[0_1px_0_rgb(25_47_129/0.5)]" />
        <span aria-hidden className="-mt-1 h-4 w-2.5 rounded-b-mark bg-[#b3b7c0]" />

        <figure className="w-[15rem] rounded-card bg-snow p-4 pb-5 text-ink shadow-[0_24px_40px_-18px_rgb(25_47_129/0.7)] ring-1 ring-ink/5 sm:w-[16.5rem]">
          <span aria-hidden className="mx-auto block h-2.5 w-14 rounded-full bg-cobalt/15" />
          <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-control bg-sun">
            {site.portrait ? (
              <Image src={site.portrait} alt={`Portrait of ${site.name}`} fill sizes="264px" priority className="object-cover" />
            ) : (
              <span
                role="img"
                aria-label={`Portrait placeholder for ${site.name}`}
                className="absolute inset-0 grid place-items-center font-display text-[7rem] leading-none text-cobalt"
              >
                HT
              </span>
            )}
          </div>
          <figcaption className="mt-4 flex items-end justify-between gap-3">
            <span>
              <span className="block font-mono text-[1.0625rem] font-bold">{site.name}</span>
              <span className="label mt-1 block text-putty-deep">{site.role}</span>
            </span>
            <span aria-hidden className="mb-0.5 size-[13px] shrink-0 rounded-mark bg-sun" />
          </figcaption>
        </figure>
      </motion.div>
    </motion.div>
  );
}
