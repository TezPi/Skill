"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { FigmaLogo } from "@phosphor-icons/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { profile } from "@/content/profile";

type Props = {
  /** The hero frame. The loader's drawn outline flies onto it. */
  getTarget: () => HTMLElement | null;
  /** Fires as the ink panels start to lift, so the hero can animate in underneath. */
  onReveal: () => void;
  /** Fires when the loader is gone, or immediately when it is skipped. */
  onDone: (played: boolean) => void;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/**
 * Purpose: masks font loading on the very first visit, then hands the viewer to
 * the canvas. Budget is about two seconds, skippable, once per session.
 */
export function IntroLoader({ getTarget, onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const callbacks = useRef({ onReveal, onDone, getTarget });
  const [gone, setGone] = useState(false);

  useLayoutEffect(() => {
    callbacks.current = { onReveal, onDone, getTarget };
  }, [onReveal, onDone, getTarget]);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.dataset.intro !== "play" || !root.current) {
        setGone(true);
        callbacks.current.onDone(false);
        return;
      }

      const el = root.current;
      el.style.animation = "none"; // cancel the CSS failsafe, JS is in charge
      const q = gsap.utils.selector(el);
      const [top, right, bottom, left] = q(".intro-edge");
      const corners = q(".intro-corner");
      const count = q(".intro-count-num")[0] as HTMLElement;
      const bar = q(".intro-bar")[0];
      const rect = q(".intro-rect")[0];

      const w = Math.min(window.innerWidth * 0.62, 560);
      const h = w / 2.4;
      gsap.set(rect, { left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, width: w, height: h, autoAlpha: 1 });

      const state = { p: 0 };
      const render = () => {
        const p = state.p;
        count.textContent = String(Math.round(p));
        gsap.set(top, { scaleX: clamp01(p / 25) });
        gsap.set(right, { scaleY: clamp01((p - 25) / 25) });
        gsap.set(bottom, { scaleX: clamp01((p - 50) / 25) });
        gsap.set(left, { scaleY: clamp01((p - 75) / 25) });
        gsap.set(bar, { scaleX: p / 100 });
      };

      const target = () => {
        const box = callbacks.current.getTarget()?.getBoundingClientRect();
        return box ?? { left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2, width: w, height: h };
      };

      const fontsReady = Promise.race([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise((resolve) => window.setTimeout(resolve, 1200)),
      ]);

      const finish = () => {
        html.dataset.intro = "skip";
        try {
          sessionStorage.setItem("tezpi:intro", "1");
        } catch {
          /* Storage blocked: the intro may replay on the next hard load. */
        }
        setGone(true);
        callbacks.current.onDone(true);
      };

      const tl = gsap.timeline({ onComplete: finish });
      timeline.current = tl;

      tl.to(state, { p: 84, duration: 1, ease: "power2.out", onUpdate: render })
        // Hold at 84 until fonts are ready (or 1.2s passed), so the reveal never shows a font swap.
        .add(() => {
          tl.pause();
          fontsReady.then(() => tl.resume());
        })
        .to(state, { p: 100, duration: 0.3, ease: "power1.inOut", onUpdate: render })
        .fromTo(corners, { scale: 0 }, { scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(2.4)" }, "-=0.05")
        .to(q("[data-intro-fade]"), { autoAlpha: 0, y: -14, duration: 0.28, stagger: 0.03, ease: "power2.in" }, "+=0.05")
        .addLabel("exit")
        .add(() => callbacks.current.onReveal(), "exit")
        .to(q(".intro-strip"), { yPercent: -100, duration: 0.85, ease: "expo.inOut", stagger: 0.07 }, "exit")
        .to(
          rect,
          {
            left: () => target().left,
            top: () => target().top,
            width: () => target().width,
            height: () => target().height,
            duration: 0.85,
            ease: "expo.inOut",
          },
          "exit",
        )
        .to(rect, { autoAlpha: 0, duration: 0.25 }, ">-0.1");

      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") skip();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    },
    { scope: root },
  );

  const skip = () => {
    const tl = timeline.current;
    if (!tl) return;
    tl.timeScale(6);
    if (tl.paused()) tl.resume();
  };

  if (gone) return null;

  return (
    <div ref={root} className="intro" role="status" aria-label="Loading portfolio">
      <div className="absolute inset-0 flex" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="intro-strip -mx-px h-full flex-1 bg-ink" />
        ))}
      </div>
      <div
        aria-hidden="true"
        data-intro-fade
        className="halftone fade-br absolute inset-0 opacity-40"
        style={{ "--ht-color": "var(--signal)", "--ht-size": "10px", "--ht-dot": "1.8px" } as React.CSSProperties}
      />

      <div className="relative flex h-full flex-col justify-between p-5 md:p-8">
        <div className="flex items-center justify-between gap-4">
          <p data-intro-fade className="flex items-center gap-2.5 text-sm font-semibold">
            <FigmaLogo size={18} weight="bold" aria-hidden="true" />
            Opening Portfolio.fig
          </p>
          <button
            type="button"
            data-intro-fade
            onClick={skip}
            className="border-2 border-paper px-3 py-1.5 text-sm font-semibold transition-colors duration-150 hover:bg-paper hover:text-ink"
          >
            Skip intro
          </button>
        </div>
        <div className="flex items-end justify-between gap-6">
          <p data-intro-fade className="intro-count" aria-hidden="true">
            <span className="intro-count-num">0</span>
          </p>
          <p data-intro-fade className="hidden max-w-[24ch] pb-3 text-right text-sm font-medium text-paper md:block">
            {profile.handle}
            <br />
            {profile.role}
          </p>
        </div>
      </div>

      <div data-intro-fade aria-hidden="true" className="intro-bar absolute bottom-0 left-0 h-1.5 w-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />

      <div aria-hidden="true" className="intro-rect invisible absolute">
        <span className="intro-edge absolute left-0 top-0 h-[2px] w-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
        <span className="intro-edge absolute right-0 top-0 h-full w-[2px] origin-top bg-signal" style={{ transform: "scaleY(0)" }} />
        <span className="intro-edge absolute bottom-0 left-0 h-[2px] w-full origin-right bg-signal" style={{ transform: "scaleX(0)" }} />
        <span className="intro-edge absolute bottom-0 left-0 h-full w-[2px] origin-bottom bg-signal" style={{ transform: "scaleY(0)" }} />
        {["left-0 top-0", "right-0 top-0", "right-0 bottom-0", "left-0 bottom-0"].map((pos) => (
          <span
            key={pos}
            className={`intro-corner absolute ${pos} size-[11px] border-[1.5px] border-signal bg-paper`}
            style={{ translate: `${pos.includes("left") ? "-50%" : "50%"} ${pos.includes("top") ? "-50%" : "50%"}` }}
          />
        ))}
      </div>
    </div>
  );
}
