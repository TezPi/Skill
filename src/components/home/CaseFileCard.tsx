import Link from "next/link";
import { ArrowRightIcon, LockSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/content/types";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { ProjectRail } from "@/components/ui/ProjectRail";
import { TagList } from "@/components/ui/Tag";

/**
 * Client project as a "case file": the Figma Project Detail layout reused as the
 * listing card, so the card previews exactly what the case study opens with.
 * The whole card is one link target (stretched from the title link).
 */
export function CaseFileCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const href = `/work/${project.slug}`;
  const facts = [{ label: "Role", value: project.role }, { label: "Year", value: project.year }, ...project.meta.slice(0, 1)];

  return (
    <article className="group relative grid overflow-hidden rounded-card bg-surface-raised ring-1 ring-line has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-select shadow-[0_30px_60px_-40px_rgb(25_47_129/0.55)] lg:min-h-[34rem] lg:grid-cols-12">
      <ProjectRail index={index} total={total} kicker="Client work" name={project.shortName} className="lg:col-span-3" />

      <div className="grid gap-10 p-6 sm:p-8 lg:col-span-9 lg:grid-cols-9 lg:gap-8 lg:p-10">
        <div className="flex flex-col lg:col-span-5">
          <p className="label text-fg-muted">
            Project / {String(index).padStart(2, "0")}
          </p>
          <h4 className="mt-3 font-display text-title text-fg">
            <Link href={href} className="after:absolute after:inset-0 after:z-[3] focus-visible:outline-none">
              {project.title}
            </Link>
          </h4>
          <p className="mt-1 font-display text-heading text-accent-fg">{project.tagline}</p>

          <TagList tags={project.tags} className="mt-5" />

          <p className="mt-5 max-w-[42ch] text-body text-fg-muted">{project.summary}</p>

          <dl className="mt-7 grid grid-cols-3 gap-4">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="label text-fg-muted">{fact.label}</dt>
                <dd className="mt-1 text-body text-fg">{fact.value}</dd>
              </div>
            ))}
          </dl>

          <span
            aria-hidden
            className="mt-8 inline-flex h-10 items-center gap-2 self-start rounded-control bg-cobalt px-4 font-display text-[1.25rem] leading-none text-snow shadow-hard transition-[transform,box-shadow] duration-150 ease-snap group-hover:-translate-x-px group-hover:-translate-y-px group-hover:shadow-hard-hover"
          >
            {project.confidential ? <LockSimpleIcon size={16} weight="bold" /> : null}
            View case study
            <ArrowRightIcon size={18} weight="bold" className="transition-transform duration-200 ease-out-expo group-hover:translate-x-0.5" />
          </span>
        </div>

        {/* Cover as a polaroid on a sun backing card; straightens on hover */}
        <div className="relative self-center lg:col-span-4">
          <span aria-hidden className="absolute inset-0 -rotate-[4deg] rounded-control bg-sun transition-transform duration-500 ease-out-expo group-hover:-rotate-[6deg]" />
          <div className="relative -rotate-2 rounded-control bg-snow p-3 pb-9 shadow-[0_10px_24px_-8px_rgb(11_11_12/0.3)] transition-transform duration-500 ease-out-expo group-hover:rotate-0 group-hover:-translate-y-1">
            <ImageSlot slot={{ ...project.cover, ratio: "5 / 4" }} sizes="(min-width: 1024px) 30vw, 90vw" className="rounded-mark" />
            <span className="absolute bottom-2.5 left-3 font-display text-[0.9375rem] text-ink uppercase">{project.cover.label}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
