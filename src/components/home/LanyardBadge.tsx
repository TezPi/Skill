"use client";

import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type AnimationPlaybackControls,
} from "motion/react";
import { site } from "@/content/site";
import { useIntro } from "@/components/intro/IntroProvider";
import { IdCard } from "./IdCard";

/** Pendulum release: low damping so it swings back and settles like a real badge */
const RELEASE = { type: "spring", stiffness: 55, damping: 4.5 } as const;
const MAX_SWING = 42;

const strapText = `${site.brandName.toUpperCase()} · ${site.brandRole.toUpperCase()} · `.repeat(4);

/**
 * Lanyard ID badge (hero). Arrives with a short drop (never travels over the
 * intro text on mobile). A double pendulum: the card swings on its clasp and
 * drags the straps along at 30%. Drag it sideways (mouse or touch), let go and
 * it swings back; the plastic glare and hologram move with the angle.
 * Every value is a motion value: no React re-renders while it moves.
 * Reduced motion: static, no drag, no idle sway.
 */
export function LanyardBadge() {
  const reduce = useReducedMotion();
  const { ready, cue } = useIntro();

  const swing = useMotionValue(0); // drag + release pendulum
  const hover = useMotionValue(0); // lean toward the pointer
  const idle = useMotionValue(0); // barely-there sway: it's hanging in air
  const hoverSmooth = useSpring(hover, { stiffness: 120, damping: 14 });

  const card = useTransform(() => swing.get() + hoverSmooth.get() + idle.get());
  const straps = useTransform(card, (r) => r * 0.3);
  const twist = useTransform(card, (r) => Math.max(-24, Math.min(24, r * -0.9)));
  const glare = useTransform(card, [-30, 30], ["-35%", "35%"]);
  const holo = useTransform(card, [-30, 30], ["0% 0%", "100% 100%"]);

  const pivot = useRef<HTMLSpanElement>(null);
  const drag = useRef<{ start: number; grab: number } | null>(null);
  const release = useRef<AnimationPlaybackControls | null>(null);

  // Arrival: lowered in, then a natural first swing + idle sway.
  // jump() (not set()) so the start angle doesn't register as velocity.
  useEffect(() => {
    if (!ready || reduce) return;
    const delay = cue("hero") + 0.25;
    swing.jump(14);
    release.current = animate(swing, 0, { ...RELEASE, velocity: 0, delay: delay + 0.1 });
    const sway = animate(idle, [-0.7, 0.7], {
      duration: 3.6,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
      delay: delay + 1.2,
    });
    return () => {
      release.current?.stop();
      sway.stop();
    };
    // `cue` is read once, at arrival, on purpose
  }, [ready, reduce, swing, idle]);

  function angleTo(event: React.PointerEvent) {
    const rect = pivot.current?.getBoundingClientRect();
    if (!rect) return 0;
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = Math.max(event.clientY - rect.bottom, 24);
    return (-Math.atan2(dx, dy) * 180) / Math.PI;
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    release.current?.stop();
    hover.set(0);
    drag.current = { start: swing.get(), grab: angleTo(event) };
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduce) return;
    if (drag.current) {
      const next = drag.current.start + (angleTo(event) - drag.current.grab);
      swing.set(Math.max(-MAX_SWING, Math.min(MAX_SWING, next)));
      return;
    }
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    hover.set(((event.clientX - (rect.left + rect.width / 2)) / rect.width) * -5);
  }

  function onRelease() {
    if (!drag.current) return;
    drag.current = null;
    release.current = animate(swing, 0, { ...RELEASE, velocity: swing.getVelocity() });
  }

  return (
    <motion.div
      className="flex flex-col items-center [@media(max-height:820px)_and_(min-height:741px)]:[zoom:0.84] [@media(max-height:740px)]:[zoom:0.74]"
      initial={reduce ? false : { y: -72, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : { y: -72, opacity: 0 }}
      transition={{
        y: { type: "spring", stiffness: 90, damping: 12, delay: cue("hero") + 0.25 },
        opacity: { duration: 0.3, delay: cue("hero") + 0.25 },
      }}
    >
      <motion.div className="flex origin-top flex-col items-center" style={{ rotate: straps }}>
        {/* Two printed straps meeting in a V, running up out of the hero */}
        <div aria-hidden className="pointer-events-none relative h-[clamp(4.5rem,10vh,6.5rem)] w-10">
          <Strap className="-translate-x-[92%] -rotate-[12deg] brightness-[0.88]" />
          <Strap className="-translate-x-[8%] rotate-[12deg]" />
        </div>

        {/* Hardware: crimp, split ring */}
        <span aria-hidden className="metal pointer-events-none relative z-[2] -mt-1.5 h-3.5 w-8 rounded-[3px] shadow-[0_1px_2px_rgb(11_11_12/0.45)]" />
        <span ref={pivot} aria-hidden className="ring-metal pointer-events-none relative z-[2] -mt-1 size-6 rounded-full" />

        <motion.div
          data-cursor="Drag me"
          className="relative flex origin-top touch-pan-y flex-col items-center select-none"
          style={{ rotate: card, rotateY: twist, transformPerspective: 900 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onRelease}
          onPointerCancel={onRelease}
          onPointerLeave={() => {
            if (!drag.current) hover.set(0);
          }}
        >
          {/* Lobster clasp threading into the holder slot */}
          <span aria-hidden className="relative z-[2] -mt-1.5 h-7 w-4 rounded-full border-[3px] border-[#aeb4be] border-t-[#eef0f3] border-r-[#d5d9df] shadow-[0_1px_1px_rgb(11_11_12/0.35)]" />
          <div className="-mt-4">
            <IdCard glare={glare} holo={holo} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Strap({ className }: { className?: string }) {
  return (
    <span
      className={`strap-band absolute bottom-0 left-1/2 flex h-[calc(100%+3rem)] w-[1.375rem] origin-bottom justify-center overflow-hidden [mask-image:linear-gradient(to_top,black_62%,transparent)] ${className ?? ""}`}
    >
      <span className="font-mono text-[0.5625rem] leading-none font-bold tracking-[0.22em] whitespace-nowrap text-cobalt-deep/80 [writing-mode:vertical-rl]">
        {strapText}
      </span>
    </span>
  );
}
