"use client";

import { useRef } from "react";
import { ArrowRight, ArrowCounterClockwise } from "@phosphor-icons/react";
import { principles, type Principle } from "@/content/profile";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

function Visual({ kind }: { kind: Principle["visual"] }) {
  if (kind === "loop") {
    const steps = ["Trigger", "Action", "Feedback", "Return"];
    return (
      <div className="flex flex-wrap items-center gap-3" aria-hidden="true">
        {steps.map((step, i) => (
          <span key={step} className="flex items-center gap-3">
            <span className={`tag h-10 px-4 text-[0.9375rem] ${i === 2 ? "bg-fg text-on-fg" : "bg-bg"}`}>{step}</span>
            {i < steps.length - 1 ? <ArrowRight size={18} weight="bold" /> : <ArrowCounterClockwise size={18} weight="bold" className="text-signal" />}
          </span>
        ))}
      </div>
    );
  }

  if (kind === "tokens") {
    const tokens = [
      { name: "paper", hex: "#DCDCDC", className: "bg-paper" },
      { name: "signal", hex: "#2D5FFF", className: "bg-signal" },
      { name: "ink", hex: "#161616", className: "bg-ink" },
    ];
    return (
      <div className="grid grid-cols-3 gap-3" aria-hidden="true">
        {tokens.map((token) => (
          <div key={token.name}>
            <div className={`h-20 border-[2.5px] border-fg md:h-24 ${token.className}`} />
            <p className="mt-2 text-sm font-bold">color/{token.name}</p>
            <p className="text-sm text-muted">{token.hex}</p>
          </div>
        ))}
      </div>
    );
  }

  if (kind === "easing") {
    return (
      <div className="flex flex-wrap items-end gap-6" aria-hidden="true">
        <div className="relative h-[124px] w-[204px] border-b-2 border-l-2 border-fg">
          <svg viewBox="0 0 200 120" className="absolute inset-0 size-full overflow-visible">
            <path d="M0,120 C32,0 60,0 200,0" fill="none" stroke="var(--signal)" strokeWidth="3" />
          </svg>
          <span className="ease-dot absolute left-0 top-0 size-3.5 rounded-full border-2 border-fg bg-bg" />
        </div>
        <code className="text-sm font-semibold">cubic-bezier(0.16, 1, 0.3, 1)</code>
      </div>
    );
  }

  return (
    <pre className="overflow-x-auto border-[2.5px] border-fg bg-ink p-5 text-sm leading-relaxed text-paper" aria-hidden="true">
      <code>
        <span className="opacity-70">type</span> ButtonState ={"\n"}
        {"  | "}
        <span className="text-signal-light">&quot;default&quot;</span> | <span className="text-signal-light">&quot;hover&quot;</span> |{" "}
        <span className="text-signal-light">&quot;focus&quot;</span>
        {"\n  | "}
        <span className="text-signal-light">&quot;pressed&quot;</span> | <span className="text-signal-light">&quot;loading&quot;</span> |{" "}
        <span className="text-signal-light">&quot;error&quot;</span>;
      </code>
    </pre>
  );
}

/** Sticky title on the left, principles scroll past on the right. The index tracks where you are. */
export function Principles() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".principle");
      const marks = gsap.utils.toArray<HTMLElement>(".principle-mark");

      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) marks.forEach((mark, j) => (mark.dataset.active = String(j <= i)));
          },
        });
      });

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { scale: 0.94, autoAlpha: 0.35 },
            { scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 55%", scrub: 0.5 } },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} aria-labelledby="principles-heading" className="section bg-bg-alt">
      <div className="shell grid gap-14 lg:grid-cols-[5fr_7fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--nav-h)+56px)] lg:self-start">
          <h2 id="principles-heading" className="display-2">
            How I work
          </h2>
          <p className="lede mt-6">Four rules I keep in every file, from the first flow to the last handoff.</p>
          <ol className="mt-12 hidden flex-col gap-4 lg:flex" aria-label="Principles">
            {principles.map((principle) => (
              <li key={principle.id}>
                <a href={`#principle-${principle.id}`} className="group flex items-center gap-4 font-semibold">
                  <span
                    aria-hidden="true"
                    data-active="false"
                    className="principle-mark size-4 border-2 border-fg bg-bg transition-colors duration-300 data-[active=true]:bg-signal"
                  />
                  <span className="link-line">{principle.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col gap-10">
          {principles.map((principle) => (
            <article
              key={principle.id}
              id={`principle-${principle.id}`}
              className="principle panel flex min-h-[420px] flex-col justify-between gap-12 p-6 shadow-[8px_8px_0_var(--fg)] md:p-10"
            >
              <Visual kind={principle.visual} />
              <div>
                <h3 className="text-3xl font-extrabold tracking-tight md:text-4xl">{principle.title}</h3>
                <p className="lede mt-4">{principle.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
