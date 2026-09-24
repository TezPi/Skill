"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import { INTRO_CUES } from "./constants";

/**
 * Intro state machine for the first-visit "open the file" sequence.
 *
 *   unknown   SSR + first client render (identical markup, no hydration mismatch)
 *   loading   loader on screen, chrome parked off-screen, page inert
 *   revealing curtain lifts; toolbar, tab bar and hero enter in sequence
 *   done      normal site
 *
 * Whether the intro plays is decided before first paint by the inline script in
 * layout.tsx (html[data-intro="play" | "skip"]), so returning visitors, deep
 * links and reduced-motion users never see a flash of the loader.
 */
export type IntroPhase = "unknown" | "loading" | "revealing" | "done";

interface IntroContextValue {
  phase: IntroPhase;
  /** true once the page is visible: animations may start */
  ready: boolean;
  /** Extra delay (s) to add to entrance animations so they follow the curtain */
  cue: (key: keyof typeof INTRO_CUES) => number;
  setPhase: (phase: IntroPhase) => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhaseState] = useState<IntroPhase>("unknown");

  // Read the pre-paint decision before the browser paints the hydrated tree
  useLayoutEffect(() => {
    const decision = document.documentElement.dataset.intro;
    if (decision === "play") {
      setPhaseState("loading");
    } else {
      setPhaseState("done");
    }
  }, []);

  const setPhase = useCallback((next: IntroPhase) => {
    const root = document.documentElement;
    if (next === "revealing") root.dataset.intro = "reveal";
    if (next === "done") root.dataset.intro = "done";
    setPhaseState(next);
  }, []);

  const value = useMemo<IntroContextValue>(
    () => ({
      phase,
      ready: phase === "revealing" || phase === "done",
      // Offsets apply only while the curtain is lifting; skipped intros start at 0
      cue: (key) => (phase === "revealing" ? INTRO_CUES[key] : 0),
      setPhase,
    }),
    [phase, setPhase],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used inside <IntroProvider>");
  return ctx;
}
