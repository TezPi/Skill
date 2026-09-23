"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { EASE_EXPO, SPRING_POP } from "@/lib/motion";
import { ReplayIcon } from "@/components/ui/icons";

const demos = [
  { verb: "Rise", spec: "24px · 0.6s · expo-out" },
  { verb: "Fade", spec: "blur 12 → 0 · 0.75s" },
  { verb: "Draw", spec: "trim path · 1.2s" },
  { verb: "Pop", spec: "0.8 → 1.03 → 1.0 · spring" },
] as const;

function Stage({ verb }: { verb: (typeof demos)[number]["verb"] }) {
  switch (verb) {
    case "Rise":
      return (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE_EXPO }}
          className="h-10 w-24 rounded-control bg-fg"
        />
      );
    case "Fade":
      return (
        <motion.p
          initial={{ opacity: 0, filter: "blur(12px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease: EASE_EXPO }}
          className="text-3xl font-semibold tracking-tight"
        >
          Aa
        </motion.p>
      );
    case "Draw":
      return (
        <svg viewBox="0 0 120 60" className="h-16 w-32" fill="none">
          <motion.rect
            x="2"
            y="2"
            width="116"
            height="56"
            rx="10"
            stroke="var(--fg)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: EASE_EXPO }}
          />
        </svg>
      );
    case "Pop":
      return (
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING_POP}
          className="block size-12 rounded-full bg-signal"
        />
      );
  }
}

export function MotionPlayground() {
  const [runs, setRuns] = useState<Record<string, number>>({});
  const replay = (verb: string) => setRuns((r) => ({ ...r, [verb]: (r[verb] ?? 0) + 1 }));
  const replayAll = () => setRuns((r) => Object.fromEntries(demos.map((d) => [d.verb, (r[d.verb] ?? 0) + 1])));

  return (
    <div>
      <ul className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2">
        {demos.map((d) => (
          <li key={d.verb} className="flex flex-col bg-bg">
            <div className="grid h-40 place-items-center">
              <Stage key={runs[d.verb] ?? 0} verb={d.verb} />
            </div>
            <div className="flex items-center justify-between border-t border-line px-4 py-2">
              <p className="text-sm">
                <span className="font-medium">{d.verb}</span> <span className="text-fg-lo">· {d.spec}</span>
              </p>
              <button
                type="button"
                onClick={() => replay(d.verb)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-control px-2 text-sm text-fg-mid transition-colors hover:text-fg"
              >
                <ReplayIcon size={14} /> Replay<span className="sr-only"> {d.verb}</span>
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={replayAll}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-control border border-line-strong px-4 text-sm font-medium transition-colors hover:border-fg"
      >
        <ReplayIcon size={14} /> Replay all four
      </button>
    </div>
  );
}
