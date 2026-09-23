"use client";

import { useEffect, useRef, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import type { PlaygroundItem } from "@/content/types";
import { ImageSlot } from "@/components/ui/ImageSlot";

/**
 * Horizontal scroll-snap strip. Works with touch, trackpad, keyboard (the rail
 * is focusable) and the arrow buttons. Button state comes from observing the
 * first/last items inside the rail: no scroll listeners.
 */
export function PlaygroundRail({ items, header }: { items: PlaygroundItem[]; header: React.ReactNode }) {
  const rail = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const root = rail.current;
    if (!root || root.children.length === 0) return;
    const first = root.firstElementChild!;
    const last = root.lastElementChild!;
    const observer = new IntersectionObserver(
      (entries) => {
        setEdges((prev) => {
          const next = { ...prev };
          for (const entry of entries) {
            if (entry.target === first) next.start = entry.intersectionRatio > 0.95;
            if (entry.target === last) next.end = entry.intersectionRatio > 0.95;
          }
          return next;
        });
      },
      { root, threshold: [0, 0.95, 1] },
    );
    observer.observe(first);
    observer.observe(last);
    return () => observer.disconnect();
  }, [items.length]);

  function page(direction: 1 | -1) {
    const root = rail.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.scrollBy({ left: direction * root.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <div>
      <div className="container-page flex flex-wrap items-end justify-between gap-6">
        {header}
        <div className="flex gap-2">
          <RailButton label="Previous items" disabled={edges.start} onClick={() => page(-1)}>
            <CaretLeftIcon size={18} weight="bold" aria-hidden />
          </RailButton>
          <RailButton label="Next items" disabled={edges.end} onClick={() => page(1)}>
            <CaretRightIcon size={18} weight="bold" aria-hidden />
          </RailButton>
        </div>
      </div>

      <ul
        ref={rail}
        tabIndex={0}
        aria-label="Playground experiments"
        className="mt-10 flex snap-x snap-mandatory scroll-px-4 items-end gap-6 overflow-x-auto px-4 pb-6 [scrollbar-width:thin] sm:scroll-px-6 sm:px-6 lg:scroll-px-10 lg:px-10 xl:scroll-px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))] xl:px-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]"
      >
        {items.map((item) => (
          <li key={item.id} className="w-[15rem] shrink-0 snap-start sm:w-[18rem]">
            <figure>
              <ImageSlot slot={item.media} sizes="18rem" className="rounded-card" />
              <figcaption className="mt-3 flex items-baseline justify-between gap-3">
                <span className="font-display text-[1.5rem] leading-none text-fg">{item.title}</span>
                <span className="label text-fg-muted">{item.discipline}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-11 place-items-center rounded-control bg-cobalt text-snow shadow-hard transition-[transform,box-shadow,opacity] duration-150 ease-snap hover:-translate-x-px hover:-translate-y-px hover:shadow-hard-hover active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:pointer-events-none disabled:opacity-35"
    >
      {children}
    </button>
  );
}
