"use client";

import { useCallback, useEffect, useMemo, useRef, type RefObject } from "react";
import { PIVOT } from "./avatar.config";

type ViewBox = { x: number; y: number; w: number; h: number };

/**
 * LOOK: turns pointer positions anywhere on the page into a gaze direction for
 * the avatar. `hold(el)` locks the gaze on an element (a cue he reacts to).
 * With no pointer activity (touch, keyboard, idle mouse) he glances around
 * on his own so he never looks frozen.
 */
export function useGaze(
  figure: RefObject<HTMLElement | null>,
  viewBox: ViewBox,
  look: (nx: number, ny: number) => void,
  { enabled, reduce }: { enabled: boolean; reduce: boolean },
) {
  const held = useRef<Element | null>(null);
  const lastMove = useRef(0);

  const toward = useCallback(
    (px: number, py: number) => {
      const box = figure.current?.getBoundingClientRect();
      if (!box || box.width === 0) return;
      const ex = box.left + ((PIVOT.eyes[0] - viewBox.x) / viewBox.w) * box.width;
      const ey = box.top + ((PIVOT.eyes[1] - viewBox.y) / viewBox.h) * box.height;
      // Reach scales with the figure so small and large avatars feel the same
      const reach = Math.max(240, box.width * 1.5);
      look((px - ex) / reach, (py - ey) / reach);
    },
    [figure, viewBox, look],
  );

  const hold = useCallback(
    (el: Element | null) => {
      held.current = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      toward(r.left + r.width / 2, r.top + r.height / 2);
    },
    [toward],
  );

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      lastMove.current = Date.now();
      if (!held.current) toward(e.clientX, e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Idle glances: only when nothing is steering the gaze
    let t: ReturnType<typeof setTimeout>;
    const glance = () => {
      t = setTimeout(() => {
        if (!held.current && Date.now() - lastMove.current > 3500) {
          const center = Math.random() < 0.3;
          look(center ? 0 : Math.random() * 1.6 - 0.8, center ? 0 : Math.random() * 0.9 - 0.4);
        }
        glance();
      }, 2400 + Math.random() * 2800);
    };
    if (!reduce) glance();

    return () => {
      window.removeEventListener("pointermove", onMove);
      clearTimeout(t);
    };
  }, [enabled, reduce, toward, look]);

  return useMemo(() => ({ hold }), [hold]);
}

export type GazeController = ReturnType<typeof useGaze>;
