"use client";

import { memo, useState } from "react";
import { motion, motionValue, useMotionValueEvent, type MotionValue } from "motion/react";
import { BODY, EYES, HEAD, MARKS } from "./avatar-paths";
import { BLUE, INK, PIVOT, VIEWBOX, WHITE, origin } from "./avatar.config";
import type { AvatarRig, MouthPose } from "./use-avatar";

/*
 * Joint origins must be motion values: for SVG, Motion rebuilds transform-origin
 * from animated values and would replace a static style origin with "50% 50%".
 * view-box + px puts every joint on its exact source-image coordinate.
 */
const ORIGINS = new Map<string, MotionValue<string>>();
const pivot = (p: readonly [number, number]) => {
  const key = origin(p);
  if (!ORIGINS.has(key)) ORIGINS.set(key, motionValue(key));
  return { transformBox: "view-box" as const, transformOrigin: ORIGINS.get(key)! };
};

type ViewBox = { x: number; y: number; w: number; h: number };

/**
 * The avatar bust. Layers: neck base > head (hair, face, glasses, eyes, mouth,
 * reaction dashes) > body (shirt, straps, backpack). Only transforms and the
 * mouth pose change; every path is the artist's own drawing.
 */
export const AvatarFigure = memo(function AvatarFigure({ rig, title, viewBox = VIEWBOX }: { rig: AvatarRig; title: string; viewBox?: ViewBox }) {
  const { x, y, w, h } = viewBox;
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-label={title} className="block h-full w-full">
      <motion.g style={{ x: rig.leanX, y: rig.bob, rotate: rig.leanRotate, scaleY: rig.breath, ...pivot(PIVOT.base) }}>
        {/* Neck base: keeps the neck solid while the head tilts on the split line */}
        <rect x={604} y={626} width={73} height={44} fill={WHITE} />

        <motion.g style={{ rotate: rig.headRotate, ...pivot(PIVOT.neck) }}>
          <path d={HEAD.fill} fill={WHITE} fillRule="evenodd" />
          <path d={HEAD.line} fill={INK} fillRule="evenodd" />
          <motion.g style={{ x: rig.eyeX, y: rig.eyeY }}>
            {[EYES.far, EYES.near].map((e) => (
              <motion.ellipse
                key={e.cx}
                cx={e.cx}
                cy={e.cy}
                rx={e.rx}
                ry={e.ry}
                fill={INK}
                style={{ scaleX: rig.eyeScaleX, scaleY: rig.eyeScaleY, ...pivot([e.cx, e.cy]) }}
              />
            ))}
          </motion.g>
          <Mouth pose={rig.mouth} />
          <motion.path d={MARKS} fill={BLUE} style={{ opacity: rig.marks, scale: rig.marksScale, ...pivot(PIVOT.eyes) }} />
        </motion.g>

        <path d={BODY.fill} fill={WHITE} fillRule="evenodd" />
        <path d={BODY.blue} fill={BLUE} fillRule="evenodd" />
        <path d={BODY.line} fill={INK} fillRule="evenodd" />
      </motion.g>
    </svg>
  );
});

/* The source face has no mouth: these are expression states in the same line weight. */
const line = { stroke: INK, strokeWidth: 9, strokeLinecap: "round", fill: "none" } as const;

function Mouth({ pose }: { pose: MotionValue<MouthPose> }) {
  // Only this node re-renders while talking
  const [p, setP] = useState(pose.get());
  useMotionValueEvent(pose, "change", setP);
  switch (p) {
    case "smile":
      return <path d="M768 506 Q782 522 798 504" {...line} />;
    case "open":
      return <ellipse cx={782} cy={514} rx={8} ry={11} fill={INK} />;
    case "talk":
      return <ellipse cx={782} cy={512} rx={9} ry={6.5} fill={INK} />;
    case "flat":
      return <path d="M772 512 L793 511" {...line} />;
    default:
      return null;
  }
}
