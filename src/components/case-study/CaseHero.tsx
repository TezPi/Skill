import Link from "next/link";
import { ArrowLeftIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/content/types";
import { groupIndex } from "@/content/projects";
import { ButtonLink } from "@/components/ui/Button";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { ProjectRail } from "@/components/ui/ProjectRail";
import { TagList } from "@/components/ui/Tag";

/**
 * Scan mode in one screen: name, value, tags, summary, role + metadata,
 * then the visuals. Layout is the Figma "Project Detail" frame.
 */
export function CaseHero({ project }: { project: Project }) {
  const { index, total } = groupIndex(project);
  const kicker = project.kind === "client" ? "Client work" : "Personal project";
  const meta = [{ label: "Role", value: project.role }, { label: "Year", value: project.year }, ...project.meta];

  return (
    <section id="case-top" data-scroll-marker="Cover" aria-labelledby="case-title" className="grid border-b border-line lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12">
      <ProjectRail index={index} total={total} kicker={kicker} name={project.shortName} className="lg:col-span-3 xl:col-span-2" />

      <div className="relative grid gap-12 px-4 py-12 sm:px-8 lg:col-span-9 lg:grid-cols-9 lg:gap-8 lg:px-12 lg:py-16 xl:col-span-10 xl:grid-cols-10">
        <div className="flex flex-col lg:col-span-5 xl:col-span-6">
          <nav aria-label="Breadcrumb">
            <ol className="label flex items-center gap-2 text-fg-muted">
              <li>
                <Link href="/#work" className="inline-flex items-center gap-1.5 hover:text-fg">
                  <ArrowLeftIcon size={14} weight="bold" aria-hidden />
                  Work
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li aria-current="page">{kicker}</li>
            </ol>
          </nav>

          <h1 id="case-title" className="mt-6 font-display text-[clamp(3rem,5.2vw,4.75rem)] leading-[0.92] text-fg">
            {project.title}
            <span className="mt-1 block text-accent-fg">{project.tagline}</span>
          </h1>

          <TagList tags={project.tags} className="mt-7" />

          <p className="mt-6 max-w-[46ch] text-lead text-fg-muted">{project.summary}</p>

          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3">
            {meta.map((item) => (
              <div key={item.label}>
                <dt className="label text-fg-muted">{item.label}</dt>
                <dd className="mt-1 text-body text-fg">{item.value}</dd>
              </div>
            ))}
          </dl>

          {project.links?.length ? (
            <div className="mt-9 flex flex-wrap gap-3">
              {project.links.map((link, i) => (
                <ButtonLink
                  key={link.url}
                  href={link.url}
                  external
                  variant={i === 0 ? "primary" : "outline"}
                  icon={<ArrowUpRightIcon size={18} weight="bold" />}
                >
                  {link.label}
                </ButtonLink>
              ))}
            </div>
          ) : null}
        </div>

        {/* Two tilted polaroids on a sun card, as on the Figma frame */}
        <div aria-hidden={!project.polaroids.some((p) => p.src)} className="relative min-h-[20rem] self-center sm:min-h-[26rem] lg:col-span-4">
          <span className="absolute top-2 right-0 h-[62%] w-[74%] -rotate-[4deg] rounded-control bg-sun" />
          <Polaroid slot={project.polaroids[0]} className="absolute top-5 right-2 w-[70%] -rotate-[4deg]" />
          <Polaroid slot={project.polaroids[1]} className="absolute bottom-0 left-0 w-[64%] rotate-[5deg]" />
        </div>
      </div>
    </section>
  );
}

function Polaroid({ slot, className }: { slot: Project["polaroids"][number]; className?: string }) {
  return (
    <figure className={`rounded-control bg-snow p-3 pb-2 shadow-[0_10px_24px_-8px_rgb(11_11_12/0.35)] ${className ?? ""}`}>
      <ImageSlot slot={slot} sizes="(min-width: 1024px) 22vw, 60vw" className="rounded-mark" priority />
      <figcaption className="mt-2 font-display text-[0.9375rem] text-ink uppercase">{slot.label}</figcaption>
    </figure>
  );
}
