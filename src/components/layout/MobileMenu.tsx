"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import { resumeLink, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Full-screen menu under the header. While open, Tab cycles between the
 * menu toggle and the menu contents, Escape closes it, and focus returns
 * to the toggle on close.
 */
export function MobileMenu({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: readonly { id: string; label: string; href: string }[];
}) {
  const panel = useRef<HTMLDivElement>(null);
  // Latest onClose without re-running the focus/scroll-lock effect on every parent render
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const trigger = document.activeElement as HTMLElement | null;
    panel.current?.querySelector<HTMLElement>("a, button")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeRef.current();
        return;
      }
      if (event.key !== "Tab" || !panel.current) return;
      const toggle = document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]');
      const focusable = [
        ...(toggle ? [toggle] : []),
        ...panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previous;
      trigger?.focus();
    };
  }, [open]);

  const links = [
    ...items.map((item) => ({ ...item, external: false })),
    { id: "resume", label: "Resume", href: resumeLink.href, external: resumeLink.external },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          id="mobile-menu"
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="on-cobalt canvas-grid fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-cobalt px-4 pt-6 pb-10 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {links.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.04 * i, ease: EASE }}
                >
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="flex items-center gap-3 py-2 font-display text-[3.5rem] leading-none text-snow"
                    >
                      {link.label}
                      <ArrowUpRightIcon size={28} weight="bold" aria-hidden className="text-sun" />
                    </a>
                  ) : (
                    <Link href={link.href} onClick={onClose} className="block py-2 font-display text-[3.5rem] leading-none text-snow">
                      {link.label}
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-4 pt-10">
            <ButtonLink href="/#contact" variant="sun" size="lg" onClick={onClose} className="self-start">
              Contact
            </ButtonLink>
            <a href={`mailto:${site.email}`} className="font-mono text-sm font-bold text-cream underline-offset-4 hover:underline">
              {site.email}
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
