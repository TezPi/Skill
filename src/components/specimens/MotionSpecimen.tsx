"use client";

import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import { useMotionPreference } from "@/components/providers/MotionPreference";

// expo-out cubic-bezier(0.16, 1, 0.3, 1) plotted in a 400×260 box: x = time, y = progress.
const X0 = 48;
const Y0 = 212;
const W = 304;
const H = 164;
const CURVE = `M ${X0} ${Y0} C ${X0 + 0.16 * W} ${Y0 - H}, ${X0 + 0.3 * W} ${Y0 - H}, ${X0 + W} ${Y0 - H}`;
// Same curve relative to its start: animateMotion offsets from the circle's own cx/cy.
const RIDE = `M 0 0 C ${0.16 * W} ${-H}, ${0.3 * W} ${-H}, ${W} ${-H}`;

export function MotionSpecimen() {
  const svg = useRef<SVGSVGElement>(null);
  const draw = useRef<SVGAnimateElement>(null);
  const ride = useRef<SVGAnimateMotionElement>(null);
  const inView = useInView(svg, { once: true, amount: 0.5 });
  const { paused } = useMotionPreference();

  // SMIL runs on the document clock; start it only once the figure is actually seen.
  useEffect(() => {
    if (!inView) return;
    draw.current?.beginElement();
    ride.current?.beginElement();
  }, [inView]);

  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    if (paused) el.pauseAnimations();
    else el.unpauseAnimations();
  }, [paused]);

  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col bg-bg-raised">
      <svg ref={svg} viewBox="0 0 400 260" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* grid */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1={X0} x2={X0 + W} y1={Y0 - (H / 4) * i} y2={Y0 - (H / 4) * i} stroke="var(--line)" strokeWidth="1" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`v${i}`} y1={Y0 - H} y2={Y0} x1={X0 + (W / 4) * i} x2={X0 + (W / 4) * i} stroke="var(--line)" strokeWidth="1" />
        ))}
        {/* linear reference */}
        <path d={`M ${X0} ${Y0} L ${X0 + W} ${Y0 - H}`} stroke="var(--line-strong)" strokeDasharray="3 5" fill="none" />
        {/* control handles */}
        <g stroke="var(--fg-lo)" strokeWidth="1" fill="var(--bg-raised)">
          <line x1={X0} y1={Y0} x2={X0 + 0.16 * W} y2={Y0 - H} />
          <line x1={X0 + W} y1={Y0 - H} x2={X0 + 0.3 * W} y2={Y0 - H} />
          <circle cx={X0 + 0.16 * W} cy={Y0 - H} r="3.5" />
          <circle cx={X0 + 0.3 * W} cy={Y0 - H} r="3.5" />
        </g>
        {/* the curve draws itself */}
        <path d={CURVE} stroke="var(--fg)" strokeWidth="2.25" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset="1">
          <animate ref={draw} attributeName="stroke-dashoffset" from="1" to="0" dur="1.4s" begin="indefinite" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.16 1 0.3 1" />
        </path>
        {/* the one signal rides it */}
        <circle r="6" fill="var(--color-signal)" cx={X0} cy={Y0}>
          <animateMotion ref={ride} dur="3.2s" begin="indefinite" repeatCount="indefinite" path={RIDE} keyPoints="0;1;1" keyTimes="0;0.55;1" calcMode="spline" keySplines="0.16 1 0.3 1;0 0 1 1" />
        </circle>
        <text x={X0} y={Y0 + 28} fill="var(--fg-lo)" fontSize="10" letterSpacing="0.06em">
          cubic-bezier(0.16, 1, 0.3, 1)
        </text>
        <text x={X0 + W} y={Y0 - H - 16} fill="var(--fg-lo)" fontSize="10" textAnchor="end" letterSpacing="0.12em">
          RISE · FADE · DRAW · POP
        </text>
      </svg>
    </div>
  );
}
