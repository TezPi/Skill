"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MagnifyingGlass } from "@phosphor-icons/react";
import type { ProjectCard } from "@/content/projects";
import { categories } from "@/content/taxonomy";
import { Flip, gsap, REDUCED } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { ProjectPanel } from "./ProjectPanel";

type FilterId = (typeof categories)[number]["id"];

/** Filter lives in the URL (?filter=ai), so a filtered view can be shared. */
export function WorkGrid({ projects }: { projects: ProjectCard[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const listRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const requested = params.get("filter");
  const filter: FilterId = categories.some((c) => c.id === requested) ? (requested as FilterId) : "all";

  const counts = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        count: category.id === "all" ? projects.length : projects.filter((p) => p.categories.includes(category.id as never)).length,
      })),
    [projects],
  );

  const visible = filter === "all" ? projects : projects.filter((p) => p.categories.includes(filter as never));
  const activeLabel = categories.find((c) => c.id === filter)?.label ?? "All";

  const choose = (id: FilterId) => {
    if (id === filter) return;
    if (listRef.current && !window.matchMedia(REDUCED).matches) {
      flipState.current = Flip.getState(listRef.current.querySelectorAll("[data-flip-id]"));
    }
    const next = new URLSearchParams(params.toString());
    if (id === "all") next.delete("filter");
    else next.set("filter", id);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  // Cards that stay glide to their new slot; new cards pop in.
  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !listRef.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: listRef.current.querySelectorAll("[data-flip-id]"),
      duration: 0.6,
      ease: "expo.out",
      absolute: true,
      onEnter: (elements) => gsap.fromTo(elements, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "expo.out" }),
    });
  }, [filter]);

  return (
    <div className="shell pb-32 md:pb-48">
      <div role="group" aria-label="Filter projects" className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-3 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {counts.map((category) => {
          const active = category.id === filter;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => choose(category.id)}
              className={cn(
                "flex h-11 shrink-0 snap-start items-center gap-2 border-2 border-fg px-4 text-[0.9375rem] font-semibold",
                "transition-[translate,box-shadow,background-color] duration-200 ease-snap active:translate-y-px",
                active ? "bg-fg text-on-fg shadow-[4px_4px_0_var(--signal)]" : "bg-bg hover:bg-bg-alt",
              )}
            >
              {category.label}
              <span className={cn("text-sm", active ? "opacity-80" : "text-muted")}>{category.count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown for {activeLabel}.
      </p>

      {visible.length ? (
        <ul ref={listRef} className="mt-12 grid grid-cols-1 gap-8 md:mt-16 md:grid-cols-2 md:gap-10">
          {visible.map((project, i) => (
            <ProjectPanel key={project.slug} project={project} variant="grid" priority={i < 2} className={project.protected ? "md:col-span-2" : undefined} />
          ))}
        </ul>
      ) : (
        <div className="mt-12 grid place-items-start gap-5 border-[2.5px] border-dashed border-fg bg-bg-alt p-8 md:mt-16 md:p-14">
          <span className="grid size-14 place-items-center border-[2.5px] border-fg bg-bg shadow-[4px_4px_0_var(--signal)]" aria-hidden="true">
            <MagnifyingGlass size={26} weight="bold" />
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">Nothing in {activeLabel} yet</h2>
          <p className="lede">No case studies match this filter. Try another one, or see everything.</p>
          <button type="button" className="btn mt-2" onClick={() => choose("all")}>
            Show all
          </button>
        </div>
      )}
    </div>
  );
}

export function WorkGridSkeleton() {
  return (
    <div className="shell pb-32" aria-hidden="true">
      <div className="flex gap-3">
        {[80, 110, 120, 110].map((w) => (
          <div key={w} className="h-11 border-2 border-fg/20 bg-bg-alt" style={{ width: w }} />
        ))}
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="border-[2.5px] border-fg/20">
            <div className="halftone aspect-[4/3] opacity-20" />
            <div className="flex flex-col gap-3 p-7">
              <div className="h-7 w-2/5 bg-bg-alt" />
              <div className="h-4 w-4/5 bg-bg-alt" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
