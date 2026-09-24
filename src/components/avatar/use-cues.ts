"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** true while the element is on screen: idle loops and cue reactions pause off-screen */
export function useOnScreen(ref: RefObject<Element | null>, amount = 0) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOn(entry.isIntersecting), { threshold: amount });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, amount]);
  return on;
}

/**
 * Hover or keyboard focus on anything marked [data-contact-cue] (header
 * Contact button, toolbar Contact tool). Pointer and focus both count, so the
 * reaction is not mouse-only.
 */
export function useContactCue({ enabled, onEnter, onLeave }: { enabled: boolean; onEnter: (el: Element) => void; onLeave: () => void }) {
  const handlers = useRef({ onEnter, onLeave });
  handlers.current = { onEnter, onLeave };

  useEffect(() => {
    if (!enabled) return;
    let current: Element | null = null;
    const find = (t: EventTarget | null) => (t instanceof Element ? t.closest("[data-contact-cue]") : null);
    const update = (el: Element | null) => {
      if (el === current) return;
      current = el;
      if (el) handlers.current.onEnter(el);
      else handlers.current.onLeave();
    };
    const onOver = (e: Event) => update(find(e.target));
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) update(null); // pointer left the window
    };
    const onBlur = (e: FocusEvent) => {
      if (!find(e.relatedTarget)) update(null);
    };
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("focusin", onOver);
    document.addEventListener("focusout", onBlur);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onOver);
      document.removeEventListener("focusout", onBlur);
      if (current) handlers.current.onLeave();
    };
  }, [enabled]);
}
