import Link from "next/link";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";
import { Specimen } from "@/components/specimens";
import { Reveal } from "@/components/ui/Reveal";
import { Tag } from "@/components/ui/Tag";
import { ArrowRight } from "@/components/ui/icons";

/**
 * Whole card is clickable via a stretched title link (one tab stop, correct semantics).
 * Essential info is always visible; hover only adds emphasis.
 */
export function ProjectCard({ project, flip = false, compact = false }: { project: Project; flip?: boolean; compact?: boolean }) {
  const href = `/work/${project.slug}`;
  return (
    <Reveal
      as="article"
      className={cn(
        "group relative grid gap-6 rounded-sheet focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-signal has-[a:focus:not(:focus-visible)]:outline-none",
        !compact && "lg:grid-cols-12 lg:items-center lg:gap-12",
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/11] overflow-hidden rounded-panel border border-line bg-bg-raised",
          !compact && "lg:col-span-7",
          !compact && flip && "lg:order-2",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-700 ease-expo group-hover:scale-[1.025]">
          <Specimen kind={project.specimen} />
        </div>
      </div>

      <div className={cn(!compact && "lg:col-span-5", !compact && flip && "lg:order-1")}>
        <p className="text-overline flex items-center gap-3 text-fg-lo">
          <span className="tabular-nums text-fg">{project.index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-line-strong transition-all duration-500 ease-expo group-hover:w-10 group-hover:bg-signal" />
          {project.productType}
        </p>
        <h3 className={cn("mt-4", compact ? "text-title" : "text-headline")}>
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            <span className="link-draw">{project.title}</span>
          </Link>
        </h3>
        <p className={cn("mt-3 text-fg-mid", compact ? "text-body" : "text-lead")}>{project.headline}</p>

        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line pt-5 text-sm">
          <dt className="text-fg-lo">Role</dt>
          <dd>{project.role}</dd>
          <dt className="text-fg-lo">Scope</dt>
          <dd className="flex flex-wrap gap-1.5">
            {project.responsibilities.slice(0, compact ? 3 : 4).map((r) => (
              <Tag key={r}>{r}</Tag>
            ))}
          </dd>
          <dt className="text-fg-lo">Year</dt>
          <dd className="tabular-nums">{project.year}</dd>
        </dl>

        <p aria-hidden="true" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-fg">
          Read case study
          <ArrowRight size={16} className="transition-transform duration-500 ease-expo group-hover:translate-x-1.5" />
        </p>
      </div>
    </Reveal>
  );
}
