"use client";

import { motion, motionValue, type MotionValue } from "motion/react";
import { EYES, HEAD, TORSO } from "./master-paths";
import { BLUE, INK, LINE, PIVOT, WHITE, origin } from "./character.config";
import { ForearmFar, ForearmNear, LowerShirt, MARKS, Mouth, Shin, Stool, Thigh } from "./parts";
import type { CharacterController } from "./use-character";

/** Master-image window that contains every pose (arms raised, pointing, jumping) */
export const VIEWBOX = { x: 120, y: 40, w: 1110, h: 1880 };

/*
 * Joint origins must be motion values: for SVG, Motion rebuilds transform-origin
 * from animated values and would replace a static style origin with "50% 50%".
 * view-box + px places every joint at its exact master-image coordinate.
 */
const ORIGINS = new Map<string, MotionValue<string>>();
const pivot = (p: readonly [number, number]) => {
  const key = origin(p);
  if (!ORIGINS.has(key)) ORIGINS.set(key, motionValue(key));
  return { transformBox: "view-box" as const, transformOrigin: ORIGINS.get(key)! };
};

/**
 * MASTER CHARACTER rig.
 *   root -> legs (hip -> knee -> shoe) + upper (waist)
 *   upper -> lower shirt, far forearm, head (hair, face, glasses, eyes, mouth), torso, near forearm
 * Only transforms and pose states change; the artwork paths are the master's.
 */
export function CharacterRig({ ctrl, title, groundX }: { ctrl: CharacterController; title: string; groundX: MotionValue<number> }) {
  const { rig, state } = ctrl;
  const { x, y, w, h } = VIEWBOX;

  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} role="img" aria-label={title} className="h-full w-full overflow-visible">
      {/* Ground: dashes slide under the feet while walking/running (in place) */}
      <motion.path d={`M${x - 200} 1884 L${x + w + 200} 1884`} stroke={BLUE} strokeOpacity={0.35} strokeWidth={LINE} strokeLinecap="round" strokeDasharray="60 40" style={{ x: groundX }} />
      {state.stool ? <Stool /> : null}

      <motion.g style={{ x: rig.rootX, y: rig.rootY, scaleY: rig.rootScaleY, rotate: rig.rootRotate, ...pivot(PIVOT.ground) }}>
        {/* legs sit behind the shirt */}
        <motion.g style={{ rotate: rig.hipFar, ...pivot(PIVOT.hipFar) }}>
          <Thigh side="far" />
          <motion.g style={{ rotate: rig.kneeFar, ...pivot(PIVOT.kneeFar) }}>
            <Shin side="far" />
          </motion.g>
        </motion.g>
        <motion.g style={{ rotate: rig.hipNear, ...pivot(PIVOT.hipNear) }}>
          <Thigh side="near" />
          <motion.g style={{ rotate: rig.kneeNear, ...pivot(PIVOT.kneeNear) }}>
            <Shin side="near" />
          </motion.g>
        </motion.g>

        <motion.g style={{ rotate: rig.upperRotate, scaleY: rig.upperScaleY, ...pivot(PIVOT.waist) }}>
          <LowerShirt />

          <motion.g style={{ rotate: rig.armFarTotal, ...pivot(PIVOT.elbowFar) }}>
            <ForearmFar hand={state.hands.far} />
          </motion.g>

          {/* HEAD: hair, face, ear, glasses, neck (master) + eyes, mouth, reaction marks */}
          <motion.g style={{ rotate: rig.headRotate, y: rig.headY, ...pivot(PIVOT.neck) }}>
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
            <Mouth pose={state.mouth} />
            <motion.path
              d={MARKS}
              stroke={BLUE}
              strokeWidth={LINE * 1.15}
              strokeLinecap="round"
              fill="none"
              style={{ opacity: rig.marks, scale: rig.marks, ...pivot(PIVOT.neck) }}
            />
            {state.fx === "zz" ? <Snore /> : null}
          </motion.g>

          <path d={TORSO.fill} fill={WHITE} fillRule="evenodd" />
          <path d={TORSO.blue} fill={BLUE} fillRule="evenodd" />
          <path d={TORSO.line} fill={INK} fillRule="evenodd" />

          <motion.g style={{ rotate: rig.armNearTotal, ...pivot(PIVOT.elbowNear) }}>
            <ForearmNear hand={state.hands.near} />
          </motion.g>
        </motion.g>
      </motion.g>
    </svg>
  );
}

/** Sleepy "z z" drifting up from the head, in the palette's blue */
function Snore() {
  return (
    <g fill={BLUE} fontFamily="var(--font-display)" aria-hidden>
      {[
        { x: 900, y: 250, s: 70, d: 0 },
        { x: 960, y: 170, s: 96, d: 0.8 },
      ].map((z) => (
        // position on a plain group: on motion elements `y` means translate, not the SVG attribute
        <g key={z.x} transform={`translate(${z.x} ${z.y})`}>
          <motion.text
            fontSize={z.s}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: [0, 1, 1, 0], y: [30, 0, -30, -60] }}
            transition={{ duration: 2.4, delay: z.d, repeat: Infinity, ease: "easeOut" }}
          >
            z
          </motion.text>
        </g>
      ))}
    </g>
  );
}
