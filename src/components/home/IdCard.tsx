"use client";

import Image from "next/image";
import { motion, type MotionValue } from "motion/react";
import { site } from "@/content/site";

const fact = (label: string) => site.glance.find((g) => g.label === label)?.value ?? "";

/**
 * The ID card itself, laid out like a real studio pass: slot-punched holder,
 * cobalt header band, portrait with selection-frame corners, name + role,
 * two facts, barcode and a holographic seal. `glare` and `holo` are motion
 * values driven by the swing, so light moves across the plastic as it turns.
 */
export function IdCard({ glare, holo }: { glare: MotionValue<string>; holo: MotionValue<string> }) {
  return (
    <figure className="relative w-[14.5rem] overflow-hidden rounded-card bg-snow text-ink shadow-[0_30px_50px_-22px_rgb(11_11_12/0.65),0_2px_6px_rgb(11_11_12/0.18)] sm:w-[15.5rem]">
      {/* Holder slot the clasp threads through */}
      <div className="relative h-8">
        <span className="absolute top-3 left-1/2 h-2.5 w-14 -translate-x-1/2 rounded-full bg-cobalt shadow-[inset_0_1px_3px_rgb(11_11_12/0.55)]" />
      </div>

      <div className="flex items-center justify-between bg-cobalt px-4 pt-2 pb-1.5 text-snow">
        <span className="font-display text-[1.5rem] leading-none tracking-[0.04em]">PORTFOLIO</span>
        <span className="font-mono text-[0.6875rem] font-bold tracking-[0.16em] text-sun">{new Date().getFullYear()}</span>
      </div>

      <div className="px-4 pt-4 pb-4">
        <div className="relative aspect-square overflow-hidden rounded-control bg-sun">
          {site.portrait ? (
            <Image src={site.portrait} alt={`Portrait of ${site.name}`} fill sizes="248px" priority className="object-cover" />
          ) : (
            <span role="img" aria-label={`Portrait placeholder for ${site.name}`} className="halftone absolute inset-0">
              <span className="absolute -bottom-[0.14em] -left-[0.04em] font-display text-[8rem] leading-none text-cobalt">HT</span>
            </span>
          )}
          {/* Selection-frame corners: the brand's registration marks on the photo */}
          {["top-1.5 left-1.5", "top-1.5 right-1.5", "bottom-1.5 left-1.5", "bottom-1.5 right-1.5"].map((pos) => (
            <span key={pos} aria-hidden className={`absolute size-2 rounded-[1px] bg-snow ring-1 ring-cobalt-deep/40 ${pos}`} />
          ))}
        </div>

        <figcaption className="mt-4">
          <span className="block font-mono text-[1.125rem] leading-tight font-bold">{site.name}</span>
          <span className="label mt-1 block text-cobalt">{site.role}</span>
        </figcaption>

        <dl className="mt-3.5 grid grid-cols-2 gap-3 border-t border-dashed border-ink/20 pt-3">
          {["Based in", "Focus"].map((label) => (
            <div key={label}>
              <dt className="font-mono text-[0.625rem] font-bold tracking-[0.14em] text-putty-deep uppercase">{label}</dt>
              <dd className="mt-0.5 font-mono text-[0.75rem] leading-snug font-bold">{fact(label)}</dd>
            </div>
          ))}
        </dl>

        <div aria-hidden className="mt-3.5 flex items-end gap-3">
          <span className="barcode h-7 flex-1" />
          <motion.span className="holo size-8 shrink-0 rounded-[3px] ring-1 ring-ink/10" style={{ backgroundPosition: holo }} />
        </div>
      </div>

      {/* Plastic sleeve: moving glare + edge highlight */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-[200%] bg-[linear-gradient(105deg,transparent_38%,rgb(255_255_255/0.55)_47%,rgb(255_255_255/0.12)_53%,transparent_60%)] mix-blend-soft-light"
        style={{ x: glare }}
      />
      <span aria-hidden className="pointer-events-none absolute inset-0 rounded-card ring-1 ring-ink/10 ring-inset" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/80" />
    </figure>
  );
}
