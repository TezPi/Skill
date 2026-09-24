"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { animate, useMotionValue, useSpring, useTransform, type AnimationPlaybackControls, type MotionValue } from "motion/react";
import { ACTIONS, type ActionApi, type ActionName, type Fx, type Pose } from "./actions";
import type { HandPose, MouthPose } from "./parts";

const SLEEP_AFTER_MS = 24000;
const REST = { type: "spring", stiffness: 180, damping: 22 } as const;

export interface CharacterState {
  action: ActionName;
  hands: { far: HandPose; near: HandPose };
  mouth: MouthPose;
  fx: Fx;
  say: string | null;
  stool: boolean;
}

/**
 * ANIMATION CONTROLLER for the master character.
 * Owns every pose value (motion values: no React re-render per frame), runs
 * one cancellable action at a time, and keeps the always-on layers:
 * breathing, blinking, gaze toward the pointer and the sleepy timer.
 */
export function useCharacter({ reduce, active = true }: { reduce: boolean; active?: boolean }) {
  // Helper keeps the hook call order fixed: every value is created on every render
  const mv = (v = 0) => useMotionValue(v);
  const pose: Pose = {
    rootX: mv(), rootY: mv(), rootScaleY: mv(1), rootRotate: mv(), upperRotate: mv(),
    head: mv(), headY: mv(), eyeScale: mv(1), lids: mv(1),
    armFar: mv(), armNear: mv(), hipFar: mv(), kneeFar: mv(), hipNear: mv(), kneeNear: mv(),
    marks: mv(), ground: mv(),
  };

  // Always-on layers
  const breath = mv(1);
  const idleHead = mv();
  const idleArm = mv();
  const blink = mv(1);
  const gazeX = useSpring(0, { stiffness: 170, damping: 20 });
  const gazeY = useSpring(0, { stiffness: 170, damping: 20 });
  const gazeHead = useSpring(0, { stiffness: 90, damping: 16 });

  const rig = {
    ...pose,
    upperScaleY: breath,
    headRotate: useTransform(() => pose.head.get() + idleHead.get() + gazeHead.get()),
    eyeX: gazeX,
    eyeY: gazeY,
    eyeScaleX: pose.eyeScale,
    eyeScaleY: useTransform(() => pose.eyeScale.get() * Math.min(blink.get(), pose.lids.get())),
    armNearTotal: useTransform(() => pose.armNear.get() + idleArm.get()),
    armFarTotal: useTransform(() => pose.armFar.get() - idleArm.get() * 0.6),
  };

  const [state, setState] = useState<CharacterState>({
    action: "idle",
    hands: { far: "rest", near: "rest" },
    mouth: "none",
    fx: "none",
    say: null,
    stool: false,
  });
  const patch = useCallback((p: Partial<CharacterState>) => setState((s) => ({ ...s, ...p })), []);

  const current = useRef<AbortController | null>(null);
  const actionRef = useRef<ActionName>("idle");
  const lastActivity = useRef(Date.now());

  /* ---------- rest pose ---------- */
  const restPose = useCallback(() => {
    const zero: [MotionValue<number>, number][] = [
      [pose.rootX, 0], [pose.rootY, 0], [pose.rootScaleY, 1], [pose.rootRotate, 0], [pose.upperRotate, 0],
      [pose.head, 0], [pose.headY, 0], [pose.eyeScale, 1], [pose.lids, 1],
      [pose.armFar, 0], [pose.armNear, 0], [pose.hipFar, 0], [pose.kneeFar, 0], [pose.hipNear, 0], [pose.kneeNear, 0],
      [pose.marks, 0],
    ];
    for (const [value, target] of zero) animate(value, target, reduce ? { duration: 0 } : REST);
    patch({ hands: { far: "rest", near: "rest" }, mouth: "none", fx: "none", stool: false });
    // pose.* are stable motion values, safe to omit
  }, [reduce, patch]);

  /* ---------- action runner ---------- */
  const play = useCallback(
    (name: ActionName, args: ActionApi["args"] = {}) => {
      lastActivity.current = Date.now();
      current.current?.abort();
      if (name === "idle") {
        current.current = null;
        actionRef.current = "idle";
        restPose();
        patch({ action: "idle", say: null });
        return;
      }
      const ctl = new AbortController();
      const { signal } = ctl;
      current.current = ctl;
      actionRef.current = name;
      const running = new Set<AnimationPlaybackControls>();
      signal.addEventListener("abort", () => running.forEach((c) => c.stop()));

      const guard = <T extends unknown[]>(fn: (...a: T) => void) => (...a: T) => {
        if (!signal.aborted) fn(...a);
      };
      const api: ActionApi = {
        pose,
        args,
        to: (value, target, options = {}) => {
          if (signal.aborted) return Promise.resolve();
          const c = animate(value, target as never, (reduce ? { duration: 0 } : options) as never);
          running.add(c);
          return new Promise<void>((resolve) => {
            c.then(() => resolve());
            signal.addEventListener("abort", () => resolve(), { once: true });
          });
        },
        wait: (ms) =>
          new Promise<void>((resolve) => {
            const t = setTimeout(resolve, reduce ? Math.min(ms, 600) : ms);
            signal.addEventListener("abort", () => { clearTimeout(t); resolve(); }, { once: true });
          }),
        loop: (value, keyframes, duration) => {
          if (signal.aborted || reduce) return;
          const c = animate(value, keyframes, { duration, repeat: Infinity, ease: "linear" });
          running.add(c);
        },
        set: {
          hands: guard((far: HandPose, near: HandPose) => patch({ hands: { far, near } })),
          mouth: guard((mouth: MouthPose) => patch({ mouth })),
          fx: guard((fx: Fx) => patch({ fx })),
          say: guard((say: string | null) => patch({ say })),
          stool: guard((stool: boolean) => patch({ stool })),
        },
        talkFor: (ms) =>
          new Promise<void>((resolve) => {
            if (signal.aborted) return resolve();
            let open = false;
            const flap = setInterval(() => {
              open = !open;
              if (!signal.aborted) patch({ mouth: open ? "talk" : "flat" });
            }, reduce ? 400 : 130);
            const done = () => { clearInterval(flap); resolve(); };
            const t = setTimeout(done, ms);
            signal.addEventListener("abort", () => { clearTimeout(t); done(); }, { once: true });
          }),
        hold: () => new Promise<void>((resolve) => signal.addEventListener("abort", () => resolve(), { once: true })),
      };

      // Settle anything the new action does not animate itself
      restPose();
      patch({ action: name, say: null });
      ACTIONS[name](api).then(() => {
        if (signal.aborted) return;
        current.current = null;
        actionRef.current = "idle";
        restPose();
        patch({ action: "idle" });
        lastActivity.current = Date.now();
      });
    },
    [reduce, patch, restPose],
  );

  /* ---------- breathing + idle sway (paused while off-screen) ---------- */
  useEffect(() => {
    if (reduce || !active) return;
    const a = animate(breath, [1, 1.012, 1], { duration: 3.4, repeat: Infinity, ease: "easeInOut" });
    const b = animate(idleHead, [-1.1, 1.1], { duration: 5.2, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" });
    const c = animate(idleArm, [-1.5, 1.5], { duration: 3.4, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" });
    return () => { a.stop(); b.stop(); c.stop(); };
  }, [reduce, active, breath, idleHead, idleArm]);

  /* ---------- blink: OPEN -> HALF -> CLOSED -> HALF -> OPEN ---------- */
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

  /* ---------- sleepy timer ---------- */
  useEffect(() => {
    if (reduce || !active) return;
    const id = setInterval(() => {
      if (actionRef.current === "idle" && Date.now() - lastActivity.current > SLEEP_AFTER_MS) play("sleep");
    }, 2000);
    return () => clearInterval(id);
  }, [reduce, active, play]);

  /** Pointer position in the character's head space -> eyes and head follow (LOOK LEFT/RIGHT) */
  const look = useCallback(
    (dx: number, dy: number) => {
      const busy = actionRef.current === "sleep" || actionRef.current === "jump";
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));
      gazeX.set(busy ? 0 : clamp(dx / 420) * 7);
      gazeY.set(busy ? 0 : clamp(dy / 420) * 6);
      gazeHead.set(busy ? 0 : clamp(dx / 700) * 4);
    },
    [gazeX, gazeY, gazeHead],
  );

  /** Any sign of life resets the sleepy timer and wakes him up */
  const poke = useCallback(() => {
    lastActivity.current = Date.now();
    if (actionRef.current === "sleep") play("wake");
  }, [play]);

  return { rig, state, play, look, poke, actionRef };
}

export type CharacterController = ReturnType<typeof useCharacter>;
