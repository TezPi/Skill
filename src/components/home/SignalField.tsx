"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "@/components/providers/MotionPreference";
import { cn } from "@/lib/cn";

/**
 * Fig. 01 — Colour speaks once.
 * A grid of neutral dots with exactly one signal. On load the field propagates
 * outward from the signal; the pointer acts as a soft spotlight.
 * Canvas 2D, DPR-capped, paused off-screen, in hidden tabs, and when motion is paused.
 */

const PAPER = "220,220,220";
const SIGNAL = "#2d5fff";
const expoOut = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function SignalField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotionPreference();
  const pausedRef = useRef(paused);
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    kickRef.current();
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let dots: { x: number; y: number; d: number }[] = [];
    let signal = { x: 0, y: 0 };
    let maxD = 1;
    let raf = 0;
    let visible = true;
    const born = performance.now();
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gap = w < 640 ? 22 : 28;
      const cols = Math.floor(w / gap);
      const rows = Math.floor(h / gap);
      const ox = (w - (cols - 1) * gap) / 2;
      const oy = (h - (rows - 1) * gap) / 2;
      // Signal sits right of centre, upper third — where the eye lands after the name.
      const sc = Math.round(cols * (w < 640 ? 0.86 : 0.74));
      const sr = Math.round(rows * (w < 640 ? 0.335 : 0.38));
      signal = { x: ox + sc * gap, y: oy + sr * gap };

      dots = [];
      maxD = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (r === sr && c === sc) continue;
          const x = ox + c * gap;
          const y = oy + r * gap;
          const d = Math.hypot(x - signal.x, y - signal.y);
          maxD = Math.max(maxD, d);
          dots.push({ x, y, d });
        }
      }
    };

    const draw = (now: number) => {
      const t = now - born;
      const isPaused = pausedRef.current;
      ctx.clearRect(0, 0, w, h);

      // Ease the spotlight toward the pointer so it glides rather than snaps.
      pointer.x += (pointer.tx - pointer.x) * 0.14;
      pointer.y += (pointer.ty - pointer.y) * 0.14;

      const spread = isPaused ? Infinity : 1300; // ms for the wave to reach the far corner
      const R = 150;
      let settling = false;

      ctx.fillStyle = `rgba(${PAPER},0.2)`;
      ctx.beginPath();
      const lit: { x: number; y: number; k: number; a: number }[] = [];
      for (const dot of dots) {
        const appear = isPaused ? 1 : expoOut(Math.max(0, (t - (dot.d / maxD) * spread) / 700));
        if (appear < 1) settling = true;
        if (appear <= 0) continue;
        const pd = pointer.active ? Math.hypot(dot.x - pointer.x, dot.y - pointer.y) : Infinity;
        if (pd < R || appear < 1) {
          const f = pd < R ? 1 - pd / R : 0;
          const k = f * f * (3 - 2 * f); // smoothstep falloff
          lit.push({ x: dot.x, y: dot.y, k, a: appear });
          continue;
        }
        ctx.moveTo(dot.x + 1.2, dot.y);
        ctx.arc(dot.x, dot.y, 1.2, 0, Math.PI * 2);
      }
      ctx.fill();

      for (const p of lit) {
        const radius = (1.2 + p.k * 2.2) * p.a;
        ctx.fillStyle = `rgba(${PAPER},${(0.2 + p.k * 0.6) * p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // The one signal: a solid core plus a ring that ripples outward.
      const cycle = isPaused ? 0.35 : ((t % 2400) / 2400);
      const ring = expoOut(cycle);
      ctx.strokeStyle = SIGNAL;
      ctx.globalAlpha = (1 - ring) * 0.6;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(signal.x, signal.y, 5 + ring * 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.fillStyle = SIGNAL;
      ctx.beginPath();
      ctx.arc(signal.x, signal.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      const pointerMoving = pointer.active && Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.5;
      const keepGoing = visible && (!isPaused || settling || pointerMoving);
      raf = keepGoing ? requestAnimationFrame(draw) : 0;
    };

    const kick = () => {
      if (!raf && visible) raf = requestAnimationFrame(draw);
    };
    kickRef.current = kick;

    // Listen on window: the field sits behind the hero copy, so it never receives events itself.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !visible) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      if (inside && !pointer.active) {
        pointer.x = x;
        pointer.y = y;
      }
      pointer.tx = x;
      pointer.ty = y;
      pointer.active = inside;
      kick();
    };
    const onLeave = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      pointer.active = false;
      kick();
    };

    const ro = new ResizeObserver(() => {
      layout();
      kick();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && document.visibilityState === "visible";
      if (visible) kick();
    });
    io.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      kickRef.current = () => {};
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={cn("block size-full", className)} />;
}
