"use client";

import { MotionConfig, useReducedMotion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

/**
 * Continuous motion (rotator, signal field, border runner) must be pausable (WCAG 2.2.2).
 * Default follows prefers-reduced-motion; a manual choice overrides and persists.
 * Entrance animations are handled separately by MotionConfig reducedMotion="user".
 */

type Pref = "paused" | "running";
const KEY = "tezpi:motion";
const listeners = new Set<() => void>();
let memory: Pref | null = null; // fallback when storage is blocked

function read(): Pref | null {
  try {
    const v = window.localStorage.getItem(KEY);
    if (v === "paused" || v === "running") return v;
  } catch {
    /* storage unavailable */
  }
  return memory;
}

function write(v: Pref) {
  memory = v;
  try {
    window.localStorage.setItem(KEY, v);
  } catch {
    /* storage unavailable — in-memory only */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

type MotionState = { paused: boolean; reduced: boolean; toggle: () => void };
const MotionContext = createContext<MotionState>({ paused: false, reduced: false, toggle: () => {} });

export function MotionProviders({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion() ?? false;
  const stored = useSyncExternalStore(subscribe, read, () => null);
  const paused = stored ? stored === "paused" : reduced;

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "running";
  }, [paused]);

  const toggle = useCallback(() => write(paused ? "running" : "paused"), [paused]);
  const value = useMemo(() => ({ paused, reduced, toggle }), [paused, reduced, toggle]);

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </MotionContext.Provider>
  );
}

export const useMotionPreference = () => useContext(MotionContext);
