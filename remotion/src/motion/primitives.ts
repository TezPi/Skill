import { interpolate } from "remotion";
import { ease } from "./eases";
import { tokens } from "./tokens.generated";

const M = tokens.motion;
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Seconds → frames (motion-forge §6). */
export const sec = (s: number, fps: number) => s * fps;

/** Tween one value between two times (seconds) with a GSAP-named ease. */
export function tween(
  frame: number,
  fps: number,
  at: number,
  duration: number,
  from: number,
  to: number,
  easeName: string,
): number {
  return interpolate(frame, [sec(at, fps), sec(at + duration, fps)], [from, to], {
    ...CLAMP,
    easing: ease(easeName),
  });
}

// ── §6 Waterfall ENTRY ────────────────────────────────────────────────────────────────────────

type Weight = keyof typeof M.distance.arrival;
export type ArrivalItem = { weight?: Weight; offset?: number; duration?: number };
export type ArrivalSlot = { start: number; duration: number; offset: number };

const F = 1 / 60; // cascade overlap unit (cut-the-curve §6 reference timing)
const OVERLAP: Record<Weight, number> = { heavy: -2, normal: 1, light: 1 };

/** Overlapping cascade schedule (seconds) — identical math to TZM.waterfallEntry in HyperFrames. */
export function waterfallSchedule(items: ArrivalItem[], t0: number): ArrivalSlot[] {
  let t = t0;
  return items.map((it, i) => {
    const w = it.weight ?? "normal";
    const slot = {
      start: t,
      duration: it.duration ?? M.duration.arrival[w],
      offset: it.offset ?? M.distance.arrival[w],
    };
    const next = items[i + 1];
    if (next) t = t + slot.duration - OVERLAP[next.weight ?? "normal"] * F;
    return slot;
  });
}

/** Style for one arrival: BINARY opacity (never fade an arrival) + power4.out whip from below. */
export function arrival(frame: number, fps: number, slot: ArrivalSlot) {
  const visible = frame >= sec(slot.start, fps);
  const y = tween(frame, fps, slot.start, slot.duration, slot.offset, 0, M.ease.arrival);
  return { opacity: visible ? 1 : 0, translate: `0px ${y}px` };
}

/** End time (s) of a schedule — chain the next beat from here. */
export const scheduleEnd = (slots: ArrivalSlot[]) =>
  Math.max(...slots.map((s) => s.start + s.duration));

// ── §7 Nudge curve ────────────────────────────────────────────────────────────────────────────

/** Slow-fast-slow group slide: three eased segments on one value (ramp / linear burst / tail). */
export function nudge(
  frame: number,
  fps: number,
  o: { at: number; distance: number; from?: number; duration?: number },
): number {
  const base = o.from ?? 0;
  const total = o.duration ?? 0.57;
  const [d1, d2] = M.nudge.distance;
  const [t1, t2] = M.nudge.time;
  return interpolate(
    frame,
    [o.at, o.at + total * t1, o.at + total * t2, o.at + total].map((s) => sec(s, fps)),
    [base, base + o.distance * d1, base + o.distance * d2, base + o.distance],
    { ...CLAMP, easing: [ease(M.ease.nudgeRamp), ease(M.ease.nudgeBurst), ease(M.ease.nudgeTail)] },
  );
}

/** Start of the nudge's linear burst — reveal new content here (§7 rule). */
export const nudgeBurstAt = (at: number, duration = 0.57) => at + duration * M.nudge.time[0];

// ── Oversized cursor ──────────────────────────────────────────────────────────────────────────

/** Cursor size in px for a canvas width (`7cqw` → 134.4 at 1920). */
export const cursorPx = (width: number, size: string = M.cursor.size) =>
  (parseFloat(size) / 100) * width;

/** Top-left position that lands the arrow TIP on (cx, cy). */
export function tipTo(cursor: number, cx: number, cy: number) {
  const [ox, oy] = M.cursor.tipOrigin.split(" ").map(parseFloat);
  return { x: cx - (cursor * ox) / 100, y: cy - (cursor * oy) / 100 };
}

/** Click tap scale (1:2 compress/expand) starting at `at`; pivot on M.cursor.tipOrigin. */
export function pressScale(frame: number, fps: number, at: number, depth: number = M.scale.press) {
  const d = M.duration.press;
  if (frame < sec(at + d.in, fps)) return tween(frame, fps, at, d.in, 1, depth, M.ease.pressIn);
  return tween(frame, fps, at + d.in, d.out, depth, 1, M.ease.pressOut);
}
