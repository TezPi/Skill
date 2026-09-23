"use client";

import { useEffect, useImperativeHandle, useLayoutEffect, useRef, type ReactNode, type Ref, type RefObject } from "react";
import { Hash } from "@phosphor-icons/react";
import { gsap } from "@/lib/gsap";

export type FrameApi = {
  element: () => HTMLDivElement | null;
  getSize: () => { w: number; h: number };
  /** Immediate resize. Marks the frame as custom-sized. */
  setSize: (w: number, h: number) => void;
  /** Tween to a size. Used by device presets. */
  animateTo: (w: number, h: number) => void;
  /** Back to the responsive CSS size. */
  reset: (animate?: boolean) => void;
  bounds: () => { maxW: number; maxH: number };
};

type Dir = "nw" | "n" | "ne" | "e" | "se" | "s" | "sw" | "w";
const HANDLES: Dir[] = ["n", "e", "s", "w", "nw", "ne", "se", "sw"];
const MIN_W = 160;
const MIN_H = 96;

type Props = {
  apiRef: Ref<FrameApi>;
  stageRef: RefObject<HTMLDivElement | null>;
  word: string;
  editing: boolean;
  handles: boolean;
  label: string;
  srPrefix: string;
  onCommitWord: (value: string) => void;
  onSize: (w: number, h: number) => void;
  onInteract: () => void;
  children?: ReactNode;
};

export function ResizableFrame({
  apiRef,
  stageRef,
  word,
  editing,
  handles,
  label,
  srPrefix,
  onCommitWord,
  onSize,
  onInteract,
  children,
}: Props) {
  const frameRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLOutputElement>(null);
  const editRef = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ dir: Dir; x: number; y: number; w: number; h: number; raf: number } | null>(null);
  const announceTimer = useRef<number>(0);
  const onSizeRef = useRef(onSize);

  useLayoutEffect(() => {
    onSizeRef.current = onSize;
  }, [onSize]);

  const bounds = () => {
    const stage = stageRef.current;
    if (!stage) return { maxW: 1040, maxH: 480 };
    return { maxW: stage.clientWidth - 24, maxH: stage.clientHeight - 76 };
  };

  const clamp = (w: number, h: number) => {
    const { maxW, maxH } = bounds();
    return {
      w: Math.round(Math.min(Math.max(w, MIN_W), Math.max(MIN_W, maxW))),
      h: Math.round(Math.min(Math.max(h, MIN_H), Math.max(MIN_H, maxH))),
    };
  };

  const getSize = () => {
    const el = frameRef.current;
    return el ? { w: el.offsetWidth, h: el.offsetHeight } : { w: 0, h: 0 };
  };

  const apply = (w: number, h: number) => {
    const el = frameRef.current;
    if (!el) return;
    const next = clamp(w, h);
    el.dataset.custom = "true";
    el.style.width = `${next.w}px`;
    el.style.height = `${next.h}px`;
  };

  /* The frame is absolutely centered in a fixed-size stage, so width/height
     changes never reflow siblings. That is why tweening them is acceptable here. */
  const animateTo = (w: number, h: number) => {
    const el = frameRef.current;
    if (!el) return;
    const from = getSize();
    const to = clamp(w, h);
    apply(from.w, from.h);
    gsap.to(el, { width: to.w, height: to.h, duration: 0.7, ease: "expo.inOut", overwrite: true });
  };

  const reset = (animate = false) => {
    const el = frameRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    const clear = () => {
      el.style.removeProperty("width");
      el.style.removeProperty("height");
      delete el.dataset.custom;
    };
    if (!animate || el.dataset.custom !== "true") return clear();
    const from = getSize();
    clear();
    const to = getSize();
    apply(from.w, from.h);
    gsap.to(el, { width: to.w, height: to.h, duration: 0.6, ease: "expo.inOut", onComplete: clear });
  };

  useImperativeHandle(apiRef, () => ({
    element: () => frameRef.current,
    getSize,
    setSize: apply,
    animateTo,
    reset,
    bounds,
  }));

  // Report every size change (drag, preset, window resize) without React renders.
  useEffect(() => {
    const el = frameRef.current;
    const stage = stageRef.current;
    if (!el || !stage) return;
    const report = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (badgeRef.current) badgeRef.current.textContent = `${w} × ${h}`;
      onSizeRef.current(w, h);
    };
    const frameObserver = new ResizeObserver(report);
    frameObserver.observe(el);
    // Keep a custom size inside the stage when the window shrinks.
    const stageObserver = new ResizeObserver(() => {
      if (el.dataset.custom === "true" && !gsap.isTweening(el)) {
        const { w, h } = getSize();
        apply(w, h);
      }
      report();
    });
    stageObserver.observe(stage);
    return () => {
      frameObserver.disconnect();
      stageObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editing || !editRef.current) return;
    const node = editRef.current;
    node.focus();
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [editing]);

  const startDrag = (event: React.PointerEvent<HTMLSpanElement>, dir: Dir) => {
    if (!handles || event.button > 0) return;
    event.preventDefault();
    event.stopPropagation();
    onInteract();
    const el = frameRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    const { w, h } = getSize();
    drag.current = { dir, x: event.clientX, y: event.clientY, w, h, raf: 0 };
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.dataset.active = "true";
    el.dataset.resizing = "true";
  };

  const moveDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d) return;
    const sx = d.dir.includes("e") ? 1 : d.dir.includes("w") ? -1 : 0;
    const sy = d.dir.includes("s") ? 1 : d.dir.includes("n") ? -1 : 0;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    // Frame is centered, so each side moves by the pointer delta: size changes by 2x.
    let w = d.w + 2 * dx * sx;
    let h = d.h + 2 * dy * sy;
    if (event.shiftKey && sx && sy) {
      const ratio = d.w / d.h;
      if (Math.abs(dx) > Math.abs(dy)) h = w / ratio;
      else w = h * ratio;
    }
    cancelAnimationFrame(d.raf);
    d.raf = requestAnimationFrame(() => apply(w, h));
  };

  const endDrag = (event: React.PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d) return;
    cancelAnimationFrame(d.raf);
    drag.current = null;
    delete event.currentTarget.dataset.active;
    if (frameRef.current) delete frameRef.current.dataset.resizing;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!handles || event.target !== event.currentTarget) return;
    const step = event.shiftKey ? 40 : 8;
    const { w, h } = getSize();
    const moves: Record<string, [number, number]> = {
      ArrowRight: [step, 0],
      ArrowLeft: [-step, 0],
      ArrowDown: [0, step],
      ArrowUp: [0, -step],
    };
    if (event.key === "Home") {
      event.preventDefault();
      onInteract();
      reset(true);
      return;
    }
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    onInteract();
    apply(w + move[0], h + move[1]);
    window.clearTimeout(announceTimer.current);
    announceTimer.current = window.setTimeout(() => {
      const size = getSize();
      if (liveRef.current) liveRef.current.textContent = `Frame is ${size.w} by ${size.h} pixels.`;
    }, 450);
  };

  const commit = () => {
    const value = (editRef.current?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 16);
    onCommitWord(value || "Portfolio");
  };

  return (
    <>
      <div
        ref={frameRef}
        className="frame"
        data-handles={handles}
        tabIndex={handles ? 0 : -1}
        role="group"
        aria-roledescription="resizable frame"
        aria-label={`${label} frame`}
        aria-describedby="frame-help"
        onKeyDown={onKeyDown}
      >
        <div className="frame-label" data-frame-chrome>
          <Hash size={12} weight="bold" className="text-signal" aria-hidden="true" />
          {label}
        </div>

        <div className="frame-box">
          <div
            aria-hidden="true"
            className="halftone fade-br pointer-events-none absolute inset-0 opacity-50"
            style={{ "--ht-color": "var(--signal)", "--ht-size": "9px", "--ht-dot": "1.4px" } as React.CSSProperties}
          />
          <h1 className="frame-word">
            <span className="sr-only">{srPrefix} </span>
            {editing ? (
              <span
                ref={editRef}
                role="textbox"
                aria-label="Edit headline. Press Enter to finish."
                contentEditable
                suppressContentEditableWarning
                spellCheck={false}
                className="frame-edit"
                onBlur={commit}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === "Escape") {
                    event.preventDefault();
                    event.currentTarget.blur();
                  }
                }}
              >
                {word}
              </span>
            ) : (
              <>
                <span className="sr-only">{word}</span>
                <span aria-hidden="true">
                  {Array.from(word).map((char, i) => (
                    <span key={`${char}-${i}`} className="frame-letter" data-l={char}>
                      {char === " " ? " " : char}
                    </span>
                  ))}
                </span>
              </>
            )}
          </h1>
        </div>

        <div className="frame-select" aria-hidden="true" data-frame-chrome />
        {HANDLES.map((dir) => (
          <span
            key={dir}
            data-dir={dir}
            data-frame-chrome
            aria-hidden="true"
            className={dir.length === 2 ? "handle handle-corner" : "handle handle-edge"}
            onPointerDown={(event) => startDrag(event, dir)}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          />
        ))}
        <div ref={badgeRef} className="frame-badge" aria-hidden="true" data-frame-chrome />
        {children}
      </div>
      <p id="frame-help" className="sr-only">
        Use the arrow keys to resize the frame. Hold Shift for bigger steps. Press Home to reset.
      </p>
      <output ref={liveRef} className="sr-only" aria-live="polite" />
    </>
  );
}
