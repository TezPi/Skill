"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { auditStats } from "@/content/profile";
import type { AuditStat } from "@/content/types";
import { Odometer } from "@/components/ui/Odometer";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Before → after, one hue: before in the de-emphasis tone, after in signal. */
function Bars({ stat, decimals }: { stat: AuditStat; decimals: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const max = Math.max(stat.before, stat.after) || 1;
  const fmt = (n: number) => `${n.toFixed(decimals)}${stat.unit ?? ""}`;
  const rows = [
    { label: "Before", value: stat.before, cls: "bg-fg/25" },
    { label: "After", value: stat.after, cls: "bg-signal" },
  ];
  return (
    <div ref={ref} className="mt-6 space-y-2" aria-hidden="true">
      {rows.map((r) => (
        <div key={r.label} className="grid grid-cols-[3.25rem_1fr_3rem] items-center gap-3 text-xs">
          <span className="text-fg-lo">{r.label}</span>
          <span className="h-1 overflow-hidden rounded-full bg-fg/8">
            <span
              className={`block h-full origin-left rounded-full transition-transform duration-[1600ms] ease-expo ${r.cls}`}
              style={{ transform: `scaleX(${inView ? Math.max(r.value / max, 0.015) : r.label === "Before" ? r.value / max : stat.before / max})` }}
            />
          </span>
          <span className="text-right tabular-nums text-fg-mid">{fmt(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

export function AuditNumbers() {
  return (
    <section aria-labelledby="receipts-title" className="container-page py-24 md:py-36">
      <SectionHeader
        titleId="receipts-title"
        eyebrow="Receipts"
        title="Measured, not claimed."
        intro="Numbers from design audits of the Agent-X Figma files. They describe the design itself, not business KPIs."
      />
      <ul className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {auditStats.map((stat, i) => {
          const decimals = Number.isInteger(stat.before) && Number.isInteger(stat.after) ? 0 : 1;
          return (
            <Reveal as="li" key={stat.label} delay={i * 0.08} className="flex flex-col bg-bg p-6 md:p-8">
              <p className="min-h-10 text-sm text-fg-mid">{stat.label}</p>
              <p className="mt-6 text-[clamp(3rem,5vw,4.5rem)] leading-none font-semibold tracking-[-0.045em]">
                <Odometer from={stat.before} to={stat.after} decimals={decimals} suffix={stat.unit} />
              </p>
              <p className="sr-only">
                Before: {stat.before}
                {stat.unit}. After: {stat.after}
                {stat.unit}.
              </p>
              <Bars stat={stat} decimals={decimals} />
              <p className="mt-6 border-t border-line pt-4 text-sm text-fg-lo">{stat.context}</p>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
