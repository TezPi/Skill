"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type Props = { sections: { id: string; title: string }[]; bodyId: string };

/** Section index with a reading-progress rail. Only earns its place on long case studies. */
export function CaseNav({ sections, bodyId }: Props) {
  const ref = useRef<HTMLElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const topBar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const body = document.getElementById(bodyId);
      if (!body) return;

      ScrollTrigger.create({
        trigger: body,
        start: "top 40%",
        end: "bottom 60%",
        onUpdate: (self) => {
          gsap.set(bar.current, { scaleY: self.progress });
          gsap.set(topBar.current, { scaleX: self.progress });
        },
      });

      const links = gsap.utils.toArray<HTMLAnchorElement>("[data-section-link]", ref.current);
      sections.forEach((section, i) => {
        const el = document.getElementById(section.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 45%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (!self.isActive) return;
            links.forEach((link, j) => {
              if (j === i) link.setAttribute("aria-current", "true");
              else link.removeAttribute("aria-current");
            });
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <>
      <div aria-hidden="true" className="fixed inset-x-0 top-(--nav-h) z-(--z-nav) h-1 lg:hidden">
        <div ref={topBar} className="h-full origin-left bg-signal" style={{ transform: "scaleX(0)" }} />
      </div>
      <nav ref={ref} aria-label="Case study sections" className="hidden lg:block">
        <div className="sticky top-[calc(var(--nav-h)+48px)] flex gap-5">
          <div aria-hidden="true" className="relative w-[3px] shrink-0 bg-fg/15">
            <div ref={bar} className="absolute inset-0 origin-top bg-signal" style={{ transform: "scaleY(0)" }} />
          </div>
          <ol className="flex flex-col gap-3 py-1 text-[0.9375rem]">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  data-section-link
                  className="font-medium text-muted transition-colors duration-200 hover:text-fg aria-[current=true]:font-bold aria-[current=true]:text-fg"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </nav>
    </>
  );
}
