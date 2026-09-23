import Link from "next/link";
import { ArrowRight, Lock } from "@phosphor-icons/react/ssr";
import type { ProjectCard } from "@/content/projects";
import { projectHref } from "@/content/taxonomy";
import { ComicImage } from "@/components/ui/ComicImage";
import { SlotText } from "@/components/ui/SlotText";
import { cn } from "@/lib/cn";

type Variant = "feature" | "compact" | "wide" | "grid";

/**
 * A project as a comic panel: image on top, caption box below.
 * Role, scope and year are always visible. Hover only adds lift and zoom.
 */
export function ProjectPanel({ project, variant, className, priority }: { project: ProjectCard; variant: Variant; className?: string; priority?: boolean }) {
  if (project.protected) return <LockedPanel project={project} className={className} />;

  const compact = variant === "compact";

  return (
    <li className={cn("group lift", className)} data-flip-id={project.slug}>
      <span className="lift-shadow" aria-hidden="true" />
      <article className="lift-body panel flex h-full flex-col">
        {project.cover ? (
          <ComicImage
            src={project.cover.src}
            alt={project.cover.alt}
            fallback={project.name}
            priority={priority}
            sizes={variant === "feature" ? "(min-width: 768px) 66vw, 100vw" : variant === "grid" ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
            className={cn(
              "border-b-[2.5px] border-fg",
              variant === "grid" ? "aspect-[4/3]" : "aspect-[16/10] md:aspect-auto md:min-h-[140px] md:flex-1",
            )}
          />
        ) : null}
        <div className={cn("flex flex-col gap-3", compact ? "p-5" : "p-5 md:p-7")}>
          <div className="flex items-baseline justify-between gap-4">
            <h3 className={cn("font-extrabold tracking-tight", compact ? "text-xl" : "text-2xl md:text-3xl")}>
              <Link href={projectHref(project)} className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-[2.5px] focus-visible:after:outline-offset-4 focus-visible:after:outline-signal focus-visible:after:outline-solid">
                {project.name}
              </Link>
            </h3>
            <span className="shrink-0 text-sm font-semibold text-muted">
              <SlotText text={project.year} />
            </span>
          </div>
          <p className="text-sm font-semibold">
            <SlotText text={project.type} />
          </p>
          <p className={cn("leading-relaxed text-muted", compact && "line-clamp-2 text-[0.9375rem]")}>{project.summary}</p>
          {!compact ? (
            <p className="text-sm">
              <span className="font-bold">Role </span>
              <span className="text-muted">
                <SlotText text={project.role} />
              </span>
            </p>
          ) : null}
          <div className="flex items-end justify-between gap-4">
            <ul className="flex flex-wrap gap-2" aria-label="Scope">
              {project.scope.slice(0, compact ? 3 : 4).map((item) => (
                <li key={item} className="tag">
                  {item}
                </li>
              ))}
            </ul>
            <ArrowRight
              size={22}
              weight="bold"
              aria-hidden="true"
              className="shrink-0 -translate-x-1 text-signal opacity-60 transition-[translate,opacity] duration-300 ease-snap group-hover:translate-x-0 group-hover:opacity-100"
            />
          </div>
        </div>
      </article>
    </li>
  );
}

function LockedPanel({ project, className }: { project: ProjectCard; className?: string }) {
  return (
    <li className={cn("group lift", className)} data-flip-id={project.slug}>
      <span className="lift-shadow" aria-hidden="true" />
      <article className="lift-body relative grid h-full border-[2.5px] border-fg bg-fg text-on-fg md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="relative grid min-h-[180px] place-items-center overflow-hidden border-b-[2.5px] border-fg md:border-b-0 md:border-r-[2.5px]" aria-hidden="true">
          <div className="halftone absolute inset-0 opacity-70" style={{ "--ht-color": "var(--signal)", "--ht-size": "10px", "--ht-dot": "2px" } as React.CSSProperties} />
          <span className="relative grid size-24 place-items-center border-[2.5px] border-on-fg bg-fg shadow-[6px_6px_0_var(--signal)] transition-[rotate] duration-500 ease-pop group-hover:-rotate-6">
            <Lock size={44} weight="bold" />
          </span>
        </div>
        <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-2xl font-extrabold tracking-tight md:text-3xl">
              <Link href={projectHref(project)} className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-[2.5px] focus-visible:after:outline-offset-4 focus-visible:after:outline-signal focus-visible:after:outline-solid">
                {project.name}
              </Link>
            </h3>
            <span className="text-sm font-semibold opacity-80">Password required</span>
          </div>
          <p className="max-w-[52ch] leading-relaxed opacity-80">{project.summary}</p>
          <p className="flex items-center gap-2 text-sm font-bold">
            Enter password
            <ArrowRight size={16} weight="bold" aria-hidden="true" className="transition-[translate] duration-300 ease-snap group-hover:translate-x-1" />
          </p>
        </div>
      </article>
    </li>
  );
}
