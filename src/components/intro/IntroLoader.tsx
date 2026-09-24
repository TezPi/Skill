"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { site } from "@/content/site";
import { SelectionFrame } from "@/components/ui/SelectionFrame";
import { MultiplayerCursor } from "@/components/ui/MultiplayerCursor";
import { BrandMark } from "@/components/ui/BrandMark";
import { useIntro } from "./IntroProvider";
import { INTRO_STORAGE_KEY } from "./constants";

/** Progress reaches 90% in this time, then waits for fonts + page load */
const MIN_FILL_S = 1.1;
/** Never hold the page longer than this waiting on assets */
const MAX_WAIT_MS = 2400;
/** Curtain: heavy in-out so the lift reads as physical, not a fade */
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

/**
 * First-visit loader: "opening the file".
 * Why it exists: Jersey 10 carries the whole brand, and a swap from the
 * fallback font on first paint looks broken. The loader masks font loading
 * with a real progress signal (document.fonts + window load), capped so it
 * never blocks longer than ~2.4s. Any key, click, scroll or "Skip intro" ends it:
 * a visitor who scrolls wants content, so scroll intent skips instead of being blocked.
 */
export function IntroLoader() {
  const { phase, setPhase } = useIntro();
  const progress = useMotionValue(0);
  const percent = useTransform(progress, (v) => String(Math.round(v * 100)).padStart(3, "0"));
  const skip = useRef<() => void>(() => {});

  useEffect(() => {
    if (phase !== "loading") return;
    let settled = false;

    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* storage blocked: the intro may replay next visit, which is harmless */
    }
    window.scrollTo(0, 0);

    const assetsReady = Promise.race([
      Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        document.readyState === "complete"
          ? Promise.resolve()
          : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true })),
      ]),
      new Promise<void>((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
    ]);

    const fill = animate(progress, 0.9, { duration: MIN_FILL_S, ease: [0.16, 1, 0.3, 1] });
    let finish: ReturnType<typeof animate> | undefined;

    const reveal = () => {
      if (settled) return;
      settled = true;
      fill.stop();
      finish?.stop();
      progress.set(1);
      setPhase("revealing");
    };
    skip.current = reveal;

    Promise.all([fill, assetsReady]).then(() => {
      if (settled) return;
      finish = animate(progress, 1, { duration: 0.25, ease: "easeOut" });
      finish.then(reveal);
    });

    const onKey = (event: KeyboardEvent) => {
      // Leave browser shortcuts (reload, zoom, devtools) and focus movement alone
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (["Tab", "Shift", "Control", "Alt", "Meta", "CapsLock"].includes(event.key) || /^F\d+$/.test(event.key)) return;
      if ([" ", "PageDown", "PageUp", "ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) event.preventDefault();
      reveal();
    };
    // Swallow the first scroll gesture (the page must stay at the top) and skip
    const onScrollIntent = (event: Event) => {
      event.preventDefault();
      reveal();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", onScrollIntent, { passive: false });
    window.addEventListener("touchmove", onScrollIntent, { passive: false });

    return () => {
      settled = true;
      fill.stop();
      finish?.stop();
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", onScrollIntent);
      window.removeEventListener("touchmove", onScrollIntent);
    };
  }, [phase, progress, setPhase]);

  // Keep keyboard and screen-reader users out of the page while it is covered
  useEffect(() => {
    const shell = document.getElementById("app-shell");
    if (!shell) return;
    if (phase === "loading") {
      shell.setAttribute("inert", "");
      shell.setAttribute("aria-busy", "true");
    } else {
      shell.removeAttribute("inert");
      shell.removeAttribute("aria-busy");
    }
  }, [phase]);

  if (phase === "done") return null;

  const started = phase !== "unknown";
  const lifting = phase === "revealing";

  return (
    <motion.div
      id="intro-loader"
      className="on-cobalt canvas-grid fixed inset-0 z-[60] place-items-center bg-cobalt text-snow"
      initial={false}
      animate={{ y: lifting ? "-100%" : "0%" }}
      transition={{ duration: 0.85, ease: CURTAIN_EASE, delay: 0.08 }}
      onAnimationComplete={() => {
        if (lifting) setPhase("done");
      }}
      onClick={() => skip.current()}
    >
      <p role="status" className="sr-only">
        {lifting ? "Portfolio loaded" : "Loading portfolio"}
      </p>

      <motion.div
        aria-hidden
        className="flex w-[min(38rem,86vw)] flex-col items-center"
        animate={lifting ? { opacity: 0, y: -48 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 1, 1] }}
      >
        <div className="relative">
          <SelectionFrame draw play={started} delay={0.05} className="p-4 sm:p-5">
            <BrandMark className="text-[clamp(1.125rem,4.4vw,2.75rem)]" />
          </SelectionFrame>
          <MultiplayerCursor label={site.handle} show={started} delay={0.5} className="absolute right-0 -bottom-12 translate-x-4 sm:translate-x-8" />
        </div>

        <div className="mt-24 w-full">
          <div className="label flex items-center justify-between text-cream">
            <span>Opening Portfolio.fig</span>
            <motion.span>{percent}</motion.span>
          </div>
          <div className="mt-3 h-[3px] overflow-hidden rounded-full bg-snow/15">
            <motion.div className="h-full origin-left bg-sun" style={{ scaleX: progress }} />
          </div>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          skip.current();
        }}
        className="label absolute right-4 bottom-4 rounded-control px-3 py-2.5 text-cream transition-colors hover:bg-snow/10 hover:text-snow sm:right-6 sm:bottom-6"
      >
        Skip intro
      </button>

      {/* Leading edge of the curtain: a sun rule that sweeps up the screen as it lifts */}
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-sun" />
    </motion.div>
  );
}
