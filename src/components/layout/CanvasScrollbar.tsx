"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/cn";
import { useIntro } from "@/components/intro/IntroProvider";

const MIN_THUMB = 44;
const IDLE_MS = 1200;

interface Marker {
  id: string;
  label: string;
  /** thumb-center position on the rail, px */
  y: number;
}

/**
 * Brand scrollbar replacing the OS one on mouse devices (the boot script sets
 * html[data-scrollbar="canvas"] before first paint, so the native bar never flashes).
 * - Thumb position comes straight from scroll progress: always in sync, no lag.
 * - Drag the thumb, click the track to jump, or click a section marker.
 * - Markers come from any element with data-scroll-marker="Label".
 * - Calm when idle, full strength while scrolling or hovered.
 * Keyboard, wheel and touch scrolling are untouched; the rail is aria-hidden
 * because it duplicates native scrolling.
 */
export function CanvasScrollbar() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(document.documentElement.dataset.scrollbar === "canvas");
  }, []);
  return enabled ? <Rail /> : null;
}

function Rail() {
  const pathname = usePathname();
  const { phase } = useIntro();
  const { scrollY, scrollYProgress } = useScroll();
  const rail = useRef<HTMLDivElement>(null);

  const [geo, setGeo] = useState({ railH: 0, thumbH: MIN_THUMB, scrollable: false });
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [awake, setAwake] = useState(false);
  const [dragging, setDragging] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const travel = Math.max(0, geo.railH - geo.thumbH);
  const travelMV = useMotionValue(0);
  const thumbY = useTransform(() => scrollYProgress.get() * travelMV.get());

  const measure = useCallback(() => {
    const railH = rail.current?.clientHeight ?? 0;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const thumbH = Math.max(MIN_THUMB, Math.round((window.innerHeight / doc.scrollHeight) * railH));
    const trav = Math.max(0, railH - thumbH);
    travelMV.set(trav);
    setGeo({ railH, thumbH, scrollable: max > 4 });
    setMarkers(
      Array.from(document.querySelectorAll<HTMLElement>("[data-scroll-marker]")).map((el) => {
        const top = el.getBoundingClientRect().top + window.scrollY;
        return {
          id: el.id,
          label: el.dataset.scrollMarker ?? el.id,
          y: (max > 0 ? Math.min(1, top / max) : 0) * trav + thumbH / 2,
        };
      }),
    );
  }, [travelMV]);

  // Re-measure on resize, on content growth (images, reveals) and on route change
  useEffect(() => {
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, pathname]);

  const wake = useCallback(() => {
    setAwake(true);
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setAwake(false), IDLE_MS);
  }, []);
  useEffect(() => () => clearTimeout(idleTimer.current), []);

  // Active marker = last section whose start the thumb has passed
  useMotionValueEvent(scrollY, "change", () => {
    wake();
    const center = thumbY.get() + geo.thumbH / 2;
    let current: string | null = null;
    for (const m of markers) if (center >= m.y - 2) current = m.id;
    setActive((prev) => (prev === current ? prev : current));
  });

  const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
  const scrollToProgress = (p: number, smooth: boolean) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, Math.min(1, p)) * maxScroll(), behavior: smooth && !reduce ? "smooth" : "instant" });
  };

  function onThumbDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    const el = event.currentTarget;
    el.setPointerCapture(event.pointerId);
    const startY = event.clientY;
    const startP = scrollYProgress.get();
    setDragging(true);
    const move = (e: PointerEvent) => {
      if (travel > 0) scrollToProgress(startP + (e.clientY - startY) / travel, false);
    };
    const up = () => {
      setDragging(false);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  }

  function onTrackDown(event: React.PointerEvent<HTMLDivElement>) {
    const rect = rail.current?.getBoundingClientRect();
    if (!rect || travel <= 0) return;
    scrollToProgress((event.clientY - rect.top - geo.thumbH / 2) / travel, true);
  }

  const hidden = phase === "loading" || !geo.scrollable;
  const lit = awake || dragging;

  return (
    <div
      aria-hidden
      className={cn(
        "group/rail fixed top-2 right-0 bottom-2 z-[45] w-4 transition-opacity duration-300",
        hidden ? "pointer-events-none opacity-0" : lit ? "opacity-100" : "opacity-70 hover:opacity-100",
      )}
    >
      <div ref={rail} className="absolute inset-y-0 right-1 w-2 cursor-pointer" onPointerDown={onTrackDown}>
        {/* Track */}
        <span className="absolute inset-y-0 left-1/2 w-[3px] -translate-x-1/2 rounded-full bg-ink/15 dark:bg-snow/15" />

        {/* Section markers (Figma layer names on hover) */}
        {markers.map((m) => (
          <button
            key={m.id}
            type="button"
            tabIndex={-1}
            onPointerDown={(e) => {
              e.stopPropagation();
              document.getElementById(m.id)?.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
              });
            }}
            className="group/mark absolute left-1/2 grid h-4 w-4 -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{ top: m.y }}
          >
            <span
              className={cn(
                "h-[2px] w-2.5 rounded-full transition-[background-color,width] duration-200",
                active === m.id ? "w-3 bg-sun ring-1 ring-cobalt-deep/50" : "bg-ink/40 dark:bg-snow/45",
              )}
            />
            <span className="pointer-events-none absolute right-full mr-2 rounded-control bg-panel px-2 py-1 font-mono text-[0.6875rem] leading-none font-bold whitespace-nowrap text-snow opacity-0 ring-1 ring-snow/10 transition-opacity duration-150 group-hover/mark:opacity-100">
              {m.label}
            </span>
          </button>
        ))}

        {/* Thumb */}
        <motion.div
          className="absolute top-0 left-1/2 w-2 -translate-x-1/2 cursor-grab active:cursor-grabbing"
          style={{ y: thumbY, height: geo.thumbH }}
          onPointerDown={onThumbDown}
        >
          <span
            className={cn(
              "absolute inset-y-0 left-1/2 -translate-x-1/2 rounded-full bg-sun ring-1 ring-cobalt-deep/70 transition-[width] duration-200 ease-out-expo",
              lit ? "w-2" : "w-[5px] group-hover/rail:w-2",
            )}
          />
        </motion.div>
      </div>
    </div>
  );
}
