"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { animate, useMotionValue, useSpring, useTransform } from "motion/react";
import { GAZE_RANGE } from "./avatar.config";

export type MouthPose = "none" | "smile" | "open" | "talk" | "flat";
export type Mood = "neutral" | "happy" | "surprised";
export type Beat = "pop" | "nod" | "tilt" | "rise";

const MOUTH_FOR: Record<Mood, MouthPose> = { neutral: "none", happy: "smile", surprised: "open" };
const SOFT = { type: "spring", stiffness: 220, damping: 18 } as const;

/**
 * ANIMATION CONTROLLER for the avatar bust. Every pose value is a motion value
 * (no React render per frame). Always-on layers: breathing, idle sway, blink
 * (OPEN > HALF > CLOSED > HALF > OPEN). Gaze drives eyes, head and a slight
 * lean so the whole character follows the pointer, not just the pupils.
 */
/** Bob offset (source px) that hides the bust below its crop, for a rise-in entrance */
const PARKED = 460;

export function useAvatar({ reduce, active, parked = false }: { reduce: boolean; active: boolean; parked?: boolean }) {
  const gazeX = useSpring(0, { stiffness: 170, damping: 20 });
  const gazeY = useSpring(0, { stiffness: 170, damping: 20 });
  // parked avatars are already out of frame in the server HTML: no flash before the rise
  const bob = useMotionValue(parked ? PARKED : 0);
  const breath = useMotionValue(1);
  const sway = useMotionValue(0);
  const nod = useMotionValue(0);
  const blink = useMotionValue(1);
  const surprise = useMotionValue(1);
  const marks = useMotionValue(0);
  const mouth = useMotionValue<MouthPose>("none");
  // Reduced motion: the eyes still follow the pointer, the body stays put
  const body = useRef(1);
  body.current = reduce ? 0 : 1;

  const leanX = useTransform(gazeX, (v) => v * 10 * body.current);
  const leanRotate = useTransform(gazeX, (v) => v * 1.2 * body.current);
  // Looking up lifts the face (counter-clockwise for a right-facing head)
  const headRotate = useTransform(() => (gazeY.get() * 4 + gazeX.get() * 1.5) * body.current + sway.get() + nod.get());
  const eyeX = useTransform(gazeX, (v) => v * GAZE_RANGE.x);
  const eyeY = useTransform(gazeY, (v) => v * GAZE_RANGE.y);
  const eyeScaleY = useTransform(() => surprise.get() * blink.get());
  const marksScale = useTransform(marks, [0, 1], [0.6, 1]);
  // Every member is a stable motion value, so the rig never changes identity
  const rig = useMemo(
    () => ({ gazeX, gazeY, bob, breath, mouth, marks, leanX, leanRotate, headRotate, eyeX, eyeY, eyeScaleX: surprise, eyeScaleY, marksScale }),
    [gazeX, gazeY, bob, breath, mouth, marks, leanX, leanRotate, headRotate, eyeX, eyeY, surprise, eyeScaleY, marksScale],
  );

  const moodRef = useRef<Mood>("neutral");
  const flap = useRef<ReturnType<typeof setInterval> | null>(null);

  const run = useCallback(
    (value: Parameters<typeof animate>[0], to: number | number[], options: Record<string, unknown>) =>
      animate(value as never, to as never, (reduce ? { duration: 0 } : options) as never),
    [reduce],
  );

  /** Pointer direction, normalised to -1..1 on both axes */
  const look = useCallback(
    (nx: number, ny: number) => {
      const c = (v: number) => Math.max(-1, Math.min(1, v));
      gazeX.set(c(nx));
      gazeY.set(c(ny));
    },
    [gazeX, gazeY],
  );

  const mood = useCallback(
    (m: Mood) => {
      moodRef.current = m;
      if (!flap.current) mouth.set(MOUTH_FOR[m]);
      run(marks, m === "neutral" ? 0 : 1, { duration: m === "neutral" ? 0.3 : 0.18 });
      run(surprise, m === "surprised" ? 1.16 : 1, m === "surprised" ? { duration: 0.12 } : SOFT);
    },
    [marks, mouth, surprise, run],
  );

  /** TALK: small mouth flaps while a line is typing, then back to the mood's mouth */
  const talking = useCallback(
    (on: boolean) => {
      if (flap.current) clearInterval(flap.current);
      flap.current = null;
      if (on && !reduce) {
        let open = false;
        flap.current = setInterval(() => {
          open = !open;
          mouth.set(open ? "talk" : "flat");
        }, 120);
        return;
      }
      mouth.set(MOUTH_FOR[moodRef.current]);
    },
    [mouth, reduce],
  );

  const beat = useCallback(
    (b: Beat) => {
      if (b === "pop") run(bob, [0, -26, 0], { duration: 0.42, ease: [0.3, 0.7, 0.4, 1] });
      if (b === "nod") run(nod, [0, 5, -2, 0], { duration: 0.6, ease: "easeInOut" });
      if (b === "tilt") run(nod, [0, -5, -3], { duration: 0.5, ease: "easeOut" });
      if (b === "rise") {
        bob.jump(reduce ? 0 : PARKED);
        run(bob, 0, { type: "spring", stiffness: 120, damping: 15 });
      }
    },
    [bob, nod, reduce, run],
  );

  /** Settle any reaction pose (used when a conversation closes) */
  const settle = useCallback(() => {
    run(nod, 0, SOFT);
  }, [nod, run]);

  /* ---------- breathing + idle sway (paused off-screen) ---------- */
  useEffect(() => {
    if (reduce || !active) return;
    const a = animate(breath, [1, 1.012, 1], { duration: 3.6, repeat: Infinity, ease: "easeInOut" });
    const b = animate(sway, [-0.8, 0.8], { duration: 5.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" });
    return () => {
      a.stop();
      b.stop();
    };
  }, [reduce, active, breath, sway]);

  /* ---------- blink ---------- */
  useEffect(() => {
    if (reduce || !active) return;
    let t: ReturnType<typeof setTimeout>;
    const schedule = () => {
      t = setTimeout(() => {
        animate(blink, [1, 0.5, 0.08, 0.5, 1], { duration: 0.2, ease: "linear" });
        schedule();
      }, 2200 + Math.random() * 3600);
    };
    schedule();
    return () => clearTimeout(t);
  }, [reduce, active, blink]);

  useEffect(() => () => {
    if (flap.current) clearInterval(flap.current);
  }, []);

  return useMemo(() => ({ rig, look, mood, talking, beat, settle }), [rig, look, mood, talking, beat, settle]);
}

export type AvatarController = ReturnType<typeof useAvatar>;
export type AvatarRig = AvatarController["rig"];
