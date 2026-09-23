"use client";

import { useState } from "react";
import type { Principle } from "@/content/types";
import { cn } from "@/lib/cn";
import { SegmentedControl } from "@/components/ui/SegmentedControl";

type Side = "before" | "after";

/** Both versions stay mounted in one grid cell, so flipping never shifts layout. */
export function PrincipleCard({ principle, index }: { principle: Principle; index: number }) {
  const [side, setSide] = useState<Side>("after");
  return (
    <div className="grid gap-6 border-t border-line py-10 lg:grid-cols-12 lg:gap-12 lg:py-14">
      <div className="lg:col-span-5">
        <p className="text-overline tabular-nums text-fg-lo">{String(index + 1).padStart(2, "0")}</p>
        <h3 className="text-title mt-3 text-balance">{principle.title}</h3>
        <p className="text-body mt-3 max-w-[42ch] text-fg-mid">{principle.rule}</p>
      </div>

      <div className="rounded-panel bg-bg-raised p-5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_10px_30px_-12px_rgb(0_0_0/0.18)] md:p-7 lg:col-span-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SegmentedControl
            label={`${principle.title} example`}
            value={side}
            onChange={setSide}
            options={[
              { value: "before", label: principle.before.label },
              { value: "after", label: principle.after.label },
            ]}
          />
          <span className="text-xs text-fg-lo">{principle.source}</span>
        </div>

        <div className="mt-6 grid" aria-live="polite">
          {(["before", "after"] as const).map((s) => {
            const v = principle[s];
            const on = side === s;
            return (
              <div
                key={s}
                aria-hidden={!on}
                inert={!on}
                className={cn(
                  "[grid-area:1/1] transition-[opacity,transform,filter] duration-500 ease-expo",
                  on ? "translate-y-0 opacity-100 blur-0" : "pointer-events-none translate-y-2 opacity-0 blur-[6px]",
                )}
              >
                <p lang="vi" className={cn("text-title font-medium", s === "before" && "text-fg-lo line-through decoration-1")}>
                  {s === "after" && (
                    <span aria-hidden="true" className="mr-3 inline-block size-2.5 translate-y-[-0.2em] rounded-full bg-signal align-middle" />
                  )}
                  {v.text}
                </p>
                {v.translation && <p className="mt-3 text-sm font-light italic text-fg-mid">{v.translation}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
