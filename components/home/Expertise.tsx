"use client";

import { useEffect, useState } from "react";
import { Code, FlowArrow, Sparkle, SquaresFour, type Icon } from "@phosphor-icons/react";
import { expertise } from "@/content/profile";
import { cn } from "@/lib/cn";

const ICONS: Record<string, Icon> = { product: FlowArrow, motion: Sparkle, systems: SquaresFour, engineering: Code };

/** Each slice has its own surface so the row never reads as four identical cards. */
const SURFACES = [
  { slice: "bg-bg text-fg", art: <div className="halftone fade-tl absolute inset-0 opacity-60" /> },
  {
    slice: "bg-fg text-on-fg",
    art: (
      <div
        className="absolute inset-0 opacity-70"
        style={{ background: "repeating-conic-gradient(from 0deg at 100% 0%, var(--signal) 0deg 2deg, transparent 2deg 9deg)" }}
      />
    ),
  },
  {
    slice: "bg-bg text-fg",
    art: (
      <div className="absolute right-6 top-6 flex h-28 w-24 border-[2.5px] border-fg">
        <span className="flex-1 bg-paper" />
        <span className="flex-1 bg-signal" />
        <span className="flex-1 bg-ink" />
      </div>
    ),
  },
  {
    slice: "bg-signal text-ink",
    art: <div className="halftone fade-br absolute inset-0 opacity-50" style={{ "--ht-color": "var(--ink)" } as React.CSSProperties} />,
  },
];

function useDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return desktop;
}

/** Horizontal accordion. Hover, focus or click opens a slice; on mobile every slice is open. */
export function Expertise() {
  const [active, setActive] = useState(0);
  const desktop = useDesktop();

  return (
    <section aria-labelledby="expertise-heading" className="section">
      <div className="shell">
        <h2 id="expertise-heading" className="display-2 mb-14 max-w-[16ch] md:mb-20">
          What I bring to a team
        </h2>

        <div className="flex flex-col gap-5 md:h-[540px] md:flex-row md:gap-4">
          {expertise.map((item, i) => {
            const open = !desktop || active === i;
            const Icon = ICONS[item.id] ?? Sparkle;
            return (
              <article
                key={item.id}
                onMouseEnter={() => setActive(i)}
                className={cn(
                  "relative min-h-[340px] overflow-hidden border-[2.5px] border-fg md:min-h-0 md:basis-0",
                  "transition-[flex-grow] duration-700 ease-snap",
                  active === i ? "md:grow-[2.6]" : "md:grow",
                  SURFACES[i % SURFACES.length].slice,
                )}
              >
                <div aria-hidden="true">{SURFACES[i % SURFACES.length].art}</div>
                <div className="relative flex h-full flex-col justify-between gap-8 p-6">
                  <span className="grid size-11 place-items-center border-[2.5px] border-current" aria-hidden="true">
                    <Icon size={22} weight="bold" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-extrabold leading-tight tracking-tight">
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={`expertise-${item.id}`}
                        onClick={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        className="text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-[3px] focus-visible:after:-outline-offset-8 focus-visible:after:outline-signal focus-visible:after:outline-solid md:cursor-default"
                      >
                        {item.title}
                      </button>
                    </h3>
                    <div
                      id={`expertise-${item.id}`}
                      inert={!open}
                      className={cn(
                        "mt-4 border-2 border-fg bg-bg p-4 text-fg md:w-[400px]",
                        "transition-[opacity,translate] duration-500 ease-snap",
                        open ? "translate-y-0 opacity-100 md:delay-200" : "translate-y-3 opacity-0",
                      )}
                    >
                      <p className="leading-relaxed">{item.blurb}</p>
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Skills">
                        {item.skills.map((skill) => (
                          <li key={skill} className="tag">
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
