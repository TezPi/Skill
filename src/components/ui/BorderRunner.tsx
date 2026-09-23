"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * A light segment (11% of the perimeter) patrolling the border every 5s.
 * Halo underneath, bright core on top, both riding the same dash window.
 * Reads the child's real border-radius so the light bends at the corners:
 * for a path inset N px, the arc radius is `radius − N`.
 */
export function BorderRunner({
  children,
  className,
  core = "var(--color-on-signal)",
  halo = "var(--color-signal)",
}: {
  children: React.ReactNode;
  className?: string;
  core?: string;
  halo?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ w: number; h: number; r: number } | null>(null);
  const filterId = useId().replace(/:/g, "");

  useLayoutEffect(() => {
    const host = ref.current;
    const target = host?.firstElementChild as HTMLElement | null;
    if (!host || !target) return;
    const measure = () => {
      const r = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 0;
      setBox({ w: target.offsetWidth, h: target.offsetHeight, r });
    };
    // ResizeObserver fires once on observe, so this also covers the first measure.
    const ro = new ResizeObserver(measure);
    ro.observe(target);
    return () => ro.disconnect();
  }, []);

  const inset = 0.75;

  return (
    <span ref={ref} className={cn("relative inline-flex", className)}>
      {children}
      {box && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
        >
          <defs>
            <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" />
            </filter>
          </defs>
          {[
            { stroke: halo, width: 5, opacity: 0.9, filter: `url(#${filterId})` },
            { stroke: core, width: 1.5, opacity: 1, filter: undefined },
          ].map((layer, i) => (
            <rect
              key={i}
              className="runner-lap"
              x={inset}
              y={inset}
              width={Math.max(0, box.w - inset * 2)}
              height={Math.max(0, box.h - inset * 2)}
              rx={Math.max(0, box.r - inset)}
              pathLength={100}
              fill="none"
              stroke={layer.stroke}
              strokeWidth={layer.width}
              strokeOpacity={layer.opacity}
              strokeDasharray="11 89"
              strokeLinecap="round"
              filter={layer.filter}
            />
          ))}
        </svg>
      )}
    </span>
  );
}
