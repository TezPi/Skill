"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Sticky section nav. The active item gets the signal rule: "you are here". */
export function CaseToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  // Active = the last section whose top has crossed 30% of the viewport. Defaults to the first.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.3;
      let current = items[0]?.id;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label="Case study sections" className="sticky top-28">
      <p className="text-overline mb-4 text-fg-lo">On this page</p>
      <ol className="space-y-0.5 border-l border-line">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "relative -ml-px flex min-h-9 items-center border-l py-1 pl-4 text-sm transition-colors duration-300",
                  on ? "border-signal text-fg" : "border-transparent text-fg-lo hover:text-fg",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
