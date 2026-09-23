"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { nav } from "@/content/site";
import { profile } from "@/content/profile";
import { EASE_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { CloseIcon } from "@/components/ui/icons";
import { SignalDot } from "@/components/ui/Tag";

export function MobileMenu({
  open,
  onClose,
  isActive,
}: {
  open: boolean;
  onClose: () => void;
  isActive: (href: string) => boolean;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab" || !panel.current) return;
      // Keep focus inside the dialog.
      const items = panel.current.querySelectorAll<HTMLElement>("a,button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="surface-ink fixed inset-0 z-[70] flex flex-col bg-bg md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.4, ease: EASE_EXPO }}
        >
          <div className="container-page flex h-16 items-center justify-between">
            <span className="text-lg font-semibold tracking-tight">
              {profile.shortName}
              <span className="text-signal">.</span>
            </span>
            <button
              type="button"
              onClick={onClose}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-control hover:bg-fg/5"
            >
              <CloseIcon size={20} />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav aria-label="Mobile" className="container-page flex flex-1 flex-col justify-center">
            <ul className="space-y-1">
              {[{ label: "Home", href: "/" }, ...nav].map((item, i) => {
                const active = item.href === "/" ? false : isActive(item.href);
                return (
                  <li key={item.href} className="overflow-hidden">
                    <motion.div
                      initial={{ y: "100%", opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.08 + i * 0.06 }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "text-display flex min-h-14 items-center gap-4 py-1",
                          active ? "text-fg" : "text-fg-mid",
                        )}
                      >
                        {item.label}
                        {active && <SignalDot className="size-3" />}
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="container-page flex flex-col gap-1 pb-8 text-sm text-fg-mid">
            <a href={`mailto:${profile.email}`} className="min-h-11 content-center underline-offset-4 hover:underline">
              {profile.email}
            </a>
            <span className="flex items-center gap-2">
              <SignalDot /> {profile.availability}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
