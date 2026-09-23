"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Cursor } from "@phosphor-icons/react";
import { gsap, useGSAP, REDUCED } from "@/lib/gsap";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";
import { IntroLoader } from "./IntroLoader";
import { ResizableFrame, type FrameApi } from "./ResizableFrame";
import { FigmaToolbar, type Preset, type Tool } from "./FigmaToolbar";
import { DesignPanel, LayersPanel } from "./Panels";

const SVG_NS = "http://www.w3.org/2000/svg";
const SHORTCUTS: Record<string, Tool> = { v: "move", f: "frame", p: "pen", t: "text", h: "hand", c: "comment" };

/** Comments pinned to the frame. They move with it when it resizes. */
const PINS = [
  {
    id: "hello",
    text: `Hi, I'm ${profile.handle}. You're inside my portfolio, opened like a Figma file.`,
    pin: "left-[40%] top-3",
    bubble: "bottom-[calc(100%+10px)] left-0 rounded-bl-sm",
  },
  {
    id: "tools",
    text: "Every tool below works. Press P to draw, T to retype the headline, F for device frames.",
    pin: "right-4 top-3",
    bubble: "bottom-[calc(100%+10px)] right-0 rounded-br-sm",
  },
  {
    id: "resize",
    text: "Grab a corner. The type is set in container units, so it reflows with the frame. Shift keeps the ratio.",
    pin: "right-[9%] -bottom-4",
    bubble: "top-[calc(100%+10px)] right-0 rounded-tr-sm",
  },
] as const;

type PinId = (typeof PINS)[number]["id"];

export function FigmaHero() {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<SVGSVGElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const bandXRef = useRef<HTMLDivElement>(null);
  const bandYRef = useRef<HTMLDivElement>(null);
  const bandLabelRef = useRef<HTMLSpanElement>(null);
  const widthOut = useRef<HTMLOutputElement>(null);
  const heightOut = useRef<HTMLOutputElement>(null);
  const fontOut = useRef<HTMLOutputElement>(null);
  const frameApi = useRef<FrameApi>(null);

  const pan = useRef({ x: 0, y: 0 });
  const size = useRef({ w: 0, h: 0 });
  const panDrag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const stroke = useRef<{ path: SVGPathElement; d: string; left: number; top: number } | null>(null);
  const demo = useRef<gsap.core.Timeline | null>(null);
  const idle = useRef<gsap.core.Tween | null>(null);
  const interacted = useRef(false);

  const [tool, setTool] = useState<Tool>("move");
  const [word, setWord] = useState("Portfolio");
  const [openPin, setOpenPin] = useState<PinId | null>(null);

  // ---- Rulers and panel readouts: direct DOM writes, never React state ----
  const syncReadouts = useCallback(() => {
    const stage = stageRef.current;
    const { w, h } = size.current;
    if (!stage || !w) return;
    const left = (stage.clientWidth - w) / 2 + pan.current.x;
    const top = (stage.clientHeight - h) / 2 + pan.current.y;
    if (bandXRef.current) bandXRef.current.style.transform = `translateX(${left}px) scaleX(${w})`;
    if (bandYRef.current) bandYRef.current.style.transform = `translateY(${top}px) scaleY(${h})`;
    if (bandLabelRef.current) {
      bandLabelRef.current.style.transform = `translateX(${left + w + 4}px)`;
      bandLabelRef.current.textContent = String(w);
    }
  }, []);

  const onSize = useCallback(
    (w: number, h: number) => {
      size.current = { w, h };
      if (widthOut.current) widthOut.current.textContent = String(w);
      if (heightOut.current) heightOut.current.textContent = String(h);
      const inner = { w: w - 5, h: h - 5 };
      const font = w / h < 1 ? Math.min(inner.w * 0.36, inner.h * 0.3) : Math.min(inner.w * 0.205, inner.h * 0.6);
      if (fontOut.current) fontOut.current.textContent = String(Math.round(font));
      syncReadouts();
    },
    [syncReadouts],
  );

  const { contextSafe } = useGSAP({ scope: heroRef });
  const getFrame = useCallback(() => frameApi.current?.element() ?? null, []);

  // ---- The collaborator cursor: one onboarding demo, then an idle drift ----
  const stopDemo = useCallback(() => {
    if (interacted.current) return;
    interacted.current = true;
    demo.current?.kill();
    idle.current?.kill();
    if (cursorRef.current) gsap.to(cursorRef.current, { autoAlpha: 0, duration: 0.25 });
  }, []);

  const startIdle = contextSafe(() => {
    const cursor = cursorRef.current;
    const stage = stageRef.current;
    if (!cursor || !stage || interacted.current) return;
    const { w, h } = size.current;
    const x = (stage.clientWidth - w) / 2 + w * 0.62;
    const y = (stage.clientHeight - h) / 2 - 52;
    gsap.to(cursor, { x, y, duration: 1.3, ease: "power3.inOut" });
    idle.current = gsap.to(cursor, { x: `+=6`, y: `+=8`, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1.3 });
  });

  const runDemo = contextSafe(() => {
    const cursor = cursorRef.current;
    const stage = stageRef.current;
    const api = frameApi.current;
    if (!cursor || !stage || !api) return;
    const start = api.getSize();
    const cx = (stage.clientWidth + start.w) / 2;
    const cy = (stage.clientHeight + start.h) / 2;
    const drag = { t: 0 };
    const apply = () => {
      api.setSize(start.w + 72 * drag.t, start.h + 36 * drag.t);
      gsap.set(cursor, { x: cx + 36 * drag.t, y: cy + 18 * drag.t });
    };
    const arrow = cursor.querySelector("svg");

    demo.current = gsap
      .timeline({
        onComplete: () => {
          api.reset();
          setOpenPin("resize");
          startIdle();
        },
      })
      .set(cursor, { x: stage.clientWidth + 40, y: cy + 110, autoAlpha: 0 })
      .to(cursor, { autoAlpha: 1, duration: 0.25 })
      .to(cursor, { x: cx, y: cy, duration: 1.05, ease: "power3.inOut" }, "<")
      .to(arrow, { scale: 0.8, transformOrigin: "0% 0%", duration: 0.12 })
      .to(drag, { t: 1, duration: 0.75, ease: "power2.inOut", onUpdate: apply })
      .to(drag, { t: 0, duration: 0.65, ease: "power2.inOut", onUpdate: apply }, "+=0.12")
      .to(arrow, { scale: 1, duration: 0.12 });
  });

  const startOnboarding = useCallback(() => {
    const reduce = window.matchMedia(REDUCED).matches;
    const wide = window.matchMedia("(min-width: 1024px)").matches;
    window.setTimeout(() => {
      if (interacted.current) return;
      if (!reduce && wide) return runDemo();
      // On phones the bubble would cover the intro copy; the pins stay tappable instead.
      if (window.matchMedia("(min-width: 768px)").matches) setOpenPin("resize");
    }, 350);
  }, [runDemo]);

  // ---- Entrance, played underneath the lifting intro panels ----
  const playEntrance = contextSafe(() => {
    const q = gsap.utils.selector(heroRef);
    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .from(q(".frame-box"), { autoAlpha: 0, duration: 0.35, ease: "none" }, 0.55)
      .from(q(".frame-letter"), { yPercent: 115, rotate: 8, duration: 1, stagger: 0.04, ease: "back.out(1.7)" }, 0.5)
      .from(q("[data-frame-chrome]"), { autoAlpha: 0, duration: 0.3 }, 0.85)
      .from(q("[data-enter='left']"), { x: -40, autoAlpha: 0, duration: 0.9 }, 0.45)
      .from(q("[data-enter='right']"), { x: 40, autoAlpha: 0, duration: 0.9 }, 0.5)
      .from(q("[data-enter='up']"), { y: 28, autoAlpha: 0, duration: 0.8, stagger: 0.07 }, 0.6);
  });

  // Pause the idle cursor while the hero is off screen.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) idle.current?.resume();
      else idle.current?.pause();
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // ---- Tools ----
  const selectTool = useCallback(
    (next: Tool) => {
      stopDemo();
      setOpenPin(null);
      setTool(next);
    },
    [stopDemo],
  );

  const applyPreset = contextSafe((preset: Preset) => {
    const api = frameApi.current;
    if (!api) return;
    const { maxW, maxH } = api.bounds();
    // Leave headroom above and below the frame for its label, badge and comments.
    const w = Math.min(maxW, maxH * 0.8 * preset.aspect, 1040);
    api.animateTo(w, w / preset.aspect);
    setTool("move");
    const burst = burstRef.current;
    if (burst && !window.matchMedia(REDUCED).matches) {
      gsap.fromTo(
        burst,
        { scale: 0.2, rotate: -20, autoAlpha: 1 },
        { scale: 1, rotate: 0, duration: 0.45, ease: "back.out(2.6)", delay: 0.55, onComplete: () => void gsap.to(burst, { autoAlpha: 0, scale: 0.7, duration: 0.3, delay: 0.35 }) },
      );
    }
  });

  const resetCanvas = contextSafe(() => {
    stopDemo();
    setWord("Portfolio");
    setOpenPin(null);
    setTool("move");
    frameApi.current?.reset(true);
    penRef.current?.replaceChildren();
    gsap.to(pan.current, { x: 0, y: 0, duration: 0.6, ease: "expo.out", onUpdate: applyPan });
  });

  function applyPan() {
    if (worldRef.current) gsap.set(worldRef.current, { x: pan.current.x, y: pan.current.y });
    syncReadouts();
  }

  // Figma shortcuts, scoped to the hero: in view, and focus is on the page or inside the hero.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    let inView = false;
    const observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), { threshold: 0.4 });
    observer.observe(hero);
    const onKey = (event: KeyboardEvent) => {
      if (!inView || event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.documentElement.dataset.intro === "play") return;
      const target = event.target as HTMLElement;
      if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const active = document.activeElement;
      if (active && active !== document.body && !hero.contains(active)) return;
      if (event.key === "Escape") return selectTool("move");
      const next = SHORTCUTS[event.key.toLowerCase()];
      if (next) {
        event.preventDefault();
        selectTool(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKey);
    };
  }, [selectTool]);

  // ---- Pen and hand: pointer handlers write straight to the DOM ----
  const onStagePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button > 0) return;
    if (tool === "pen" && penRef.current) {
      stopDemo();
      const box = penRef.current.getBoundingClientRect();
      const path = document.createElementNS(SVG_NS, "path");
      const d = `M${(event.clientX - box.left).toFixed(1)} ${(event.clientY - box.top).toFixed(1)}`;
      path.setAttribute("d", d);
      penRef.current.appendChild(path);
      stroke.current = { path, d, left: box.left, top: box.top };
      event.currentTarget.setPointerCapture(event.pointerId);
    } else if (tool === "hand") {
      stopDemo();
      gsap.killTweensOf(pan.current);
      panDrag.current = { x: event.clientX, y: event.clientY, px: pan.current.x, py: pan.current.y };
      event.currentTarget.dataset.panning = "true";
      event.currentTarget.setPointerCapture(event.pointerId);
    } else {
      stopDemo();
    }
  };

  const onStagePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const s = stroke.current;
    if (s) {
      s.d += ` L${(event.clientX - s.left).toFixed(1)} ${(event.clientY - s.top).toFixed(1)}`;
      s.path.setAttribute("d", s.d);
      return;
    }
    const p = panDrag.current;
    if (p) {
      const limit = 220;
      pan.current.x = Math.max(-limit, Math.min(limit, p.px + event.clientX - p.x));
      pan.current.y = Math.max(-limit, Math.min(limit, p.py + event.clientY - p.y));
      applyPan();
    }
  };

  const onStagePointerUp = contextSafe((event: React.PointerEvent<HTMLDivElement>) => {
    const s = stroke.current;
    if (s) {
      stroke.current = null;
      gsap.to(s.path, { opacity: 0, duration: 0.8, delay: 2.2, ease: "power1.in", onComplete: () => s.path.remove() });
    }
    if (panDrag.current) {
      panDrag.current = null;
      delete event.currentTarget.dataset.panning;
      // Canvas springs home so the frame is never lost off screen.
      gsap.to(pan.current, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.5)", onUpdate: applyPan });
    }
  });

  const showPins = tool !== "pen";
  const allPins = tool === "comment";

  return (
    <section
      ref={heroRef}
      tabIndex={-1}
      aria-label="Introduction"
      className="canvas-dots relative flex min-h-[calc(100dvh-var(--nav-h))] flex-col overflow-hidden bg-bg-alt outline-none"
    >
      <IntroLoader getTarget={getFrame} onReveal={playEntrance} onDone={startOnboarding} />

      <div className="relative grid flex-1 gap-8 px-4 pt-6 md:px-8 lg:grid-cols-[216px_minmax(0,1fr)_236px] lg:pt-8 xl:grid-cols-[232px_minmax(0,1fr)_252px]">
        <div className="hidden self-center lg:block">
          <LayersPanel word={word} />
        </div>

        <div className="flex min-h-0 flex-col">
          <div
            ref={stageRef}
            data-tool={tool}
            data-all={allPins || undefined}
            className="stage relative z-[2] min-h-[300px] flex-1"
            onPointerDown={onStagePointerDown}
            onPointerMove={onStagePointerMove}
            onPointerUp={onStagePointerUp}
            onPointerCancel={onStagePointerUp}
          >
            <div aria-hidden="true" className="speed-lines pointer-events-none absolute inset-[-10%]" />

            <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block" data-enter="up">
              <div className="ruler ruler-x">
                <div ref={bandXRef} className="ruler-band left-0 top-0 h-full w-px" />
                <span ref={bandLabelRef} className="absolute left-0 top-[3px] font-bold text-signal" />
              </div>
              <div className="ruler ruler-y">
                <div ref={bandYRef} className="ruler-band left-0 top-0 h-px w-full" />
              </div>
              <div className="absolute left-0 top-0 size-[18px] border-b-[1.5px] border-r-[1.5px] border-fg bg-bg" />
            </div>

            <div ref={worldRef} className="absolute inset-0">
              <ResizableFrame
                apiRef={frameApi}
                stageRef={stageRef}
                word={word}
                editing={tool === "text"}
                handles={tool === "move" || tool === "frame"}
                label={`${profile.handle} / ${profile.role}`}
                srPrefix={profile.handle}
                onCommitWord={(value) => {
                  setWord(value);
                  setTool("move");
                }}
                onSize={onSize}
                onInteract={stopDemo}
              >
                {showPins
                  ? PINS.map((pin) => {
                      const expanded = allPins || openPin === pin.id;
                      return (
                        <div key={pin.id} className={cn("absolute", pin.pin)} data-frame-chrome>
                          <button
                            type="button"
                            className="pin relative"
                            aria-expanded={expanded}
                            aria-controls={`pin-${pin.id}`}
                            aria-label={`Comment from ${profile.handle}`}
                            onPointerDown={(event) => event.stopPropagation()}
                            onClick={() => {
                              stopDemo();
                              setOpenPin((current) => (current === pin.id ? null : pin.id));
                            }}
                          >
                            {profile.initials}
                          </button>
                          <div
                            id={`pin-${pin.id}`}
                            role="note"
                            hidden={!expanded}
                            className={cn("bubble pin-bubble", pin.bubble, allPins && openPin !== pin.id && "max-md:hidden")}
                          >
                            <p className="mb-1 text-xs font-bold">{profile.handle}</p>
                            {pin.text}
                          </div>
                        </div>
                      );
                    })
                  : null}
                <div ref={burstRef} aria-hidden="true" className="snap-burst -bottom-12 -left-12">
                  SNAP!
                </div>
              </ResizableFrame>

              <div ref={cursorRef} aria-hidden="true" className="pointer-events-none invisible absolute left-0 top-0 z-[6] opacity-0">
                <Cursor size={24} weight="fill" className="text-signal drop-shadow-[1.5px_1.5px_0_var(--fg)]" />
                <span className="ml-4 inline-block -translate-y-1 rounded-full border-2 border-fg bg-bg px-2 py-0.5 text-[0.6875rem] font-bold">
                  {profile.handle}
                </span>
              </div>
            </div>

            <svg
              ref={penRef}
              aria-hidden="true"
              className={cn(
                "absolute inset-0 z-[7] size-full fill-none stroke-signal [stroke-linecap:round] [stroke-linejoin:round] [stroke-width:4]",
                tool !== "pen" && "pointer-events-none",
              )}
            />
          </div>

          <div className="flex flex-col gap-5 pb-2 pt-6 md:flex-row md:items-end md:justify-between md:gap-8">
            <p data-enter="up" className="max-w-[44ch] text-[1.0625rem] leading-relaxed text-muted md:text-lg">
              <strong className="font-bold text-fg">I&apos;m {profile.name}</strong>, {profile.intro}
            </p>
            <div data-enter="up" className="flex shrink-0 flex-wrap gap-4 pb-1.5 pr-1.5">
              <Link href="/work" className="btn">
                View work
                <ArrowRight size={16} weight="bold" aria-hidden="true" />
              </Link>
              <Link href="/resume" className="btn btn-secondary">
                Resume
              </Link>
            </div>
          </div>
        </div>

        <div className="hidden self-center lg:block">
          <DesignPanel widthRef={widthOut} heightRef={heightOut} fontRef={fontOut} />
        </div>
      </div>

      <div data-enter="up" className="relative z-[3] flex justify-center px-4 pb-6 pt-5 md:pb-8">
        <FigmaToolbar tool={tool} onTool={selectTool} onPreset={applyPreset} onReset={resetCanvas} />
      </div>
    </section>
  );
}
