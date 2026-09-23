"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

const STACK = [" ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Rolling odometer: one clipped column per digit, each holding a blank + 0–9 stack.
 * Every column starts and lands together but travels a different distance,
 * so they move at different speeds, like a mechanical counter, yet stay in sync.
 * Rolls from `from` to `to`, so the number itself shows the change.
 */
export function Odometer({
  from,
  to,
  decimals = 0,
  suffix = "",
  className,
}: {
  from: number;
  to: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  const a = from.toFixed(decimals);
  const b = to.toFixed(decimals);
  const len = Math.max(a.length, b.length);
  const start = a.padStart(len, " ");
  const end = b.padStart(len, " ");
  const shown = inView ? end : start;

  return (
    <span ref={ref} className={cn("inline-flex items-baseline tabular-nums", className)}>
      <span className="sr-only">{b + suffix}</span>
      <span aria-hidden="true" className="inline-flex">
        {Array.from(shown).map((ch, i) => {
          const isDigit = ch === " " || /\d/.test(ch);
          if (!isDigit) return <span key={i}>{ch}</span>;
          const idx = STACK.indexOf(ch);
          // Blank columns collapse so "9" doesn't sit behind a phantom leading space.
          const collapsed = ch === " ";
          return (
            <span
              key={i}
              className="relative inline-block h-[1em] overflow-hidden leading-none transition-[width] duration-[1600ms] ease-expo"
              style={{ width: collapsed ? 0 : "0.62em" }}
            >
              <span
                className="absolute left-0 top-0 flex flex-col transition-transform duration-[1600ms] ease-expo will-change-transform"
                style={{ transform: `translateY(${-idx}em)`, transitionDelay: `${i * 40}ms` }}
              >
                {STACK.map((d, k) => (
                  <span key={k} className="block h-[1em] leading-none">
                    {d === " " ? " " : d}
                  </span>
                ))}
              </span>
            </span>
          );
        })}
        {suffix && <span className="ml-[0.04em]">{suffix}</span>}
      </span>
    </span>
  );
}
