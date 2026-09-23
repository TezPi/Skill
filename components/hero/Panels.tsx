"use client";

import Link from "next/link";
import type { Ref } from "react";
import { ArrowUpRight, ChatCircle, Hash, TextT } from "@phosphor-icons/react";
import { navLinks, profile } from "@/content/profile";

const panelClass = "w-full border-2 border-fg bg-bg text-[0.8125rem] shadow-[5px_5px_0_var(--fg)]";
const headingClass = "border-b-2 border-fg px-3.5 py-2.5 font-bold";

export function LayersPanel({ word }: { word: string }) {
  const pages = [{ href: "/", label: "Home" }, ...navLinks, { href: "/contact", label: "Contact" }];

  return (
    <aside aria-label="Layers and pages" className={panelClass} data-enter="left">
      <p className={headingClass}>Layers</p>
      <ul className="px-1.5 py-2" aria-label="Layers">
        <li className="flex items-center gap-2 bg-signal-soft px-2 py-1.5 font-semibold">
          <Hash size={14} weight="bold" className="text-signal" aria-hidden="true" />
          Portfolio
        </li>
        {[
          { Icon: TextT, label: word },
          { Icon: TextT, label: profile.role },
          { Icon: ChatCircle, label: "Comments" },
        ].map(({ Icon, label }, i) => (
          <li key={i} className="flex items-center gap-2 py-1.5 pl-7 pr-2 text-muted">
            <Icon size={14} weight="bold" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </li>
        ))}
      </ul>
      <p className={`${headingClass} border-t-2`}>Pages</p>
      <nav aria-label="Pages">
        <ul className="px-1.5 py-2">
          {pages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                aria-current={page.href === "/" ? "page" : undefined}
                className="group flex items-center justify-between px-2 py-1.5 font-medium transition-colors duration-150 hover:bg-bg-alt aria-[current=page]:font-bold"
              >
                {page.label}
                <ArrowUpRight
                  size={12}
                  weight="bold"
                  aria-hidden="true"
                  className="opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

type DesignPanelProps = {
  widthRef: Ref<HTMLOutputElement>;
  heightRef: Ref<HTMLOutputElement>;
  fontRef: Ref<HTMLOutputElement>;
};

const swatches = [
  { name: "color/paper", hex: "#DCDCDC", className: "bg-paper" },
  { name: "color/signal", hex: "#2D5FFF", className: "bg-signal" },
  { name: "color/ink", hex: "#161616", className: "bg-ink" },
];

export function DesignPanel({ widthRef, heightRef, fontRef }: DesignPanelProps) {
  const field = "flex items-center justify-between gap-2 border-2 border-fg/15 px-2 py-1.5";

  return (
    <aside aria-label="Design properties" className={panelClass} data-enter="right">
      <p className={headingClass}>Design</p>
      <div className="flex flex-col gap-4 p-3.5">
        <section aria-label="Frame size">
          <p className="mb-2 font-bold">Frame</p>
          <div className="grid grid-cols-2 gap-2">
            <div className={field}>
              <span className="text-muted">W</span>
              <output ref={widthRef} className="font-semibold tabular-nums" aria-label="Frame width">
                0
              </output>
            </div>
            <div className={field}>
              <span className="text-muted">H</span>
              <output ref={heightRef} className="font-semibold tabular-nums" aria-label="Frame height">
                0
              </output>
            </div>
          </div>
        </section>

        <section aria-label="Typography">
          <p className="mb-2 font-bold">Text</p>
          <p className={field}>Be Vietnam Pro</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <p className={field}>Black</p>
            <p className={field}>
              <output ref={fontRef} className="font-semibold tabular-nums" aria-label="Font size">
                0
              </output>
              <span className="text-muted">px</span>
            </p>
          </div>
        </section>

        <section aria-label="Color variables">
          <p className="mb-2 font-bold">Variables</p>
          <ul className="flex flex-col gap-1.5">
            {swatches.map((swatch) => (
              <li key={swatch.hex} className="flex items-center gap-2.5">
                <span aria-hidden="true" className={`size-4 border-2 border-fg ${swatch.className}`} />
                <span className="font-medium">{swatch.name}</span>
                <span className="ml-auto text-muted">{swatch.hex}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Export">
          <p className="mb-2 font-bold">Export</p>
          <Link href="/resume" className="flex items-center justify-between border-2 border-fg px-2.5 py-2 font-semibold transition-colors duration-150 hover:bg-bg-alt">
            Resume
            <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </aside>
  );
}
