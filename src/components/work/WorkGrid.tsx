"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { categories, projects } from "@/content/projects";
import type { ProjectCategory } from "@/content/types";
import { EASE_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { ProjectCard } from "@/components/home/ProjectCard";
import { Button } from "@/components/ui/Button";

type Filter = "All" | ProjectCategory;

export function WorkGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const count = (f: Filter) => (f === "All" ? projects.length : projects.filter((p) => p.categories.includes(f)).length);
  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));
  const filters: Filter[] = ["All", ...categories];

  return (
    <>
      {/* Filter options show their result count, so you know what you'll get before clicking. */}
      <div role="radiogroup" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const on = f === filter;
          const n = count(f);
          return (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={n === 0}
              onClick={() => setFilter(f)}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-control border px-4 text-sm font-medium transition-[background-color,border-color,color,transform] duration-300 ease-expo active:scale-[0.97]",
                on ? "border-signal bg-signal/12 text-fg" : "border-line text-fg-mid hover:border-line-strong hover:text-fg",
                "disabled:opacity-40",
              )}
            >
              {f}
              <span className={cn("tabular-nums text-xs", on ? "text-fg" : "text-fg-lo")}>{n}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
        {filter !== "All" ? ` in ${filter}` : ""}.
      </p>

      {shown.length === 0 ? (
        <div className="mt-12 rounded-panel border border-dashed border-line-strong p-10 text-center">
          <p className="text-title">No projects in {filter} yet.</p>
          <p className="mt-2 text-fg-mid">Everything else is one click away.</p>
          <Button variant="secondary" className="mt-6" onClick={() => setFilter("All")}>
            Show all projects
          </Button>
        </div>
      ) : (
        <motion.ul layout className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: EASE_EXPO }}
              >
                <ProjectCard project={p} compact />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </>
  );
}
