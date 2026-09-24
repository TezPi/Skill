"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { NavigationArrowIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/cn";

const DEFAULT_LABEL = "You";
const INTERACTIVE = 'a[href], button:not([disabled]), [role="button"], [data-cursor], summary, [tabindex="0"]';

/**
 * The visitor's pointer as a Figma multiplayer cursor, next to the designer's
 * own "HoPhuThinh" cursor in the hero.
 *   arrow   follows the pointer exactly (precision is never traded for effect)
 *   tag     trails on a spring, and says what a click will do: elements can set
 *           data-cursor="View case study"; other interactive elements flip the
 *           tag to cobalt so the affordance reads without a label
 *   press   arrow dips (tactile feedback)
 * Mouse + hover-capable devices only; touch keeps native behavior. The native
 * cursor is hidden only after the first mouse move, so there is never a moment
 * with no cursor at all.
 */
export function CanvasCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return enabled ? <CursorLayer /> : null;
}

function CursorLayer() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const tagX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const tagY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [target, setTarget] = useState<{ label: string | null; interactive: boolean }>({ label: null, interactive: false });

  useEffect(() => {
    const root = document.documentElement;

    let present = false;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      x.set(event.clientX);
      y.set(event.clientY);
      // First move (or re-entering the window): place the tag, don't fly it in
      if (!present) {
        present = true;
        tagX.jump(event.clientX);
        tagY.jump(event.clientY);
      }
      if (root.dataset.pointer !== "canvas") root.dataset.pointer = "canvas";
      setVisible(true);
    };
    const onOver = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest?.(INTERACTIVE) ?? null;
      const label = el?.getAttribute("data-cursor") ?? null;
      setTarget((prev) => (prev.label === label && prev.interactive === !!el ? prev : { label, interactive: !!el }));
    };
    const onDown = (event: PointerEvent) => event.pointerType === "mouse" && setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      present = false;
      setVisible(false);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      delete root.dataset.pointer;
    };
  }, [x, y, tagX, tagY]);

  const label = target.label ?? DEFAULT_LABEL;
  const active = target.interactive;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]" style={{ opacity: visible ? 1 : 0 }}>
      {/* Arrow: tip sits exactly on the hotspot */}
      <motion.div className="absolute top-0 left-0 will-change-transform" style={{ x, y }}>
        <motion.span
          className="block origin-top-left"
          animate={{ scale: pressed ? 0.86 : active ? 1.12 : 1 }}
          transition={{ type: "spring", stiffness: 600, damping: 30 }}
        >
          <NavigationArrowIcon
            size={26}
            weight="fill"
            className="-mt-1 -ml-1 text-sun [&_path]:stroke-cobalt-deep [&_path]:[paint-order:stroke] [&_path]:[stroke-linejoin:round] [&_path]:[stroke-width:14px]"
          />
        </motion.span>
      </motion.div>

      {/* Name tag: trails the arrow, swaps its text on context */}
      <motion.div className="absolute top-0 left-0 will-change-transform" style={{ x: reduce ? x : tagX, y: reduce ? y : tagY }}>
        <div className="translate-x-5 translate-y-6">
          <motion.div
            layout={!reduce}
            transition={{ type: "spring", stiffness: 500, damping: 36 }}
            className={cn(
              "overflow-hidden rounded-control px-2.5 py-1 font-mono text-[0.75rem] leading-none font-bold whitespace-nowrap shadow-[0_4px_12px_-4px_rgb(11_11_12/0.45)] ring-1",
              active ? "bg-cobalt text-snow ring-snow/30" : "bg-sun text-cobalt-deep ring-cobalt-deep/25",
            )}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={label}
                className="block"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                {label}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
