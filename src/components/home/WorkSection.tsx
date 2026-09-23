import { clientProjects, personalProjects } from "@/content/projects";
import { cn } from "@/lib/cn";
import { Plate } from "@/components/ui/Plate";
import { Reveal } from "@/components/motion/Reveal";
import { CaseFileCard } from "./CaseFileCard";
import { ProjectTile } from "./ProjectTile";

/*
 * Two groups, in trust order: client work (proof of real constraints) first,
 * personal work (range and initiative) second. With 7 items a filter would add
 * a decision without saving any scanning, so grouping does the filtering.
 */

/** Bento rhythm for the 4 personal tiles: 7/5 then 5/7, with offset columns */
const tileLayout = [
  { tile: "md:col-span-7", cover: "md:aspect-auto md:h-[20rem] lg:h-[26rem]" },
  { tile: "md:col-span-5 md:mt-24", cover: "md:aspect-auto md:h-[20rem] lg:h-[26rem]" },
  { tile: "md:col-span-5", cover: "md:aspect-auto md:h-[20rem] lg:h-[26rem]" },
  { tile: "md:col-span-7 md:mt-24", cover: "md:aspect-auto md:h-[20rem] lg:h-[26rem]" },
];

export function WorkSection() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-16 overflow-x-clip py-24 lg:py-32">
      <div className="container-page">
        <Reveal>
          <Plate id="work-title" bleed="left">
            Selected Work
          </Plate>
          <p className="mt-6 max-w-[44ch] text-lead text-fg-muted">
            Client work first, then the projects I start on my own.
          </p>
        </Reveal>

        <GroupHeading className="mt-20" title="Client work" count={clientProjects.length} note="Designed for real businesses" />
        <ol className="mt-8 flex flex-col gap-8 lg:gap-12">
          {clientProjects.map((project, i) => (
            <li
              key={project.slug}
              className="stack:sticky"
              style={{ top: `calc(5.5rem + ${i} * 1.5rem)` }}
            >
              <Reveal>
                <CaseFileCard project={project} index={i + 1} total={clientProjects.length} />
              </Reveal>
            </li>
          ))}
        </ol>

        <GroupHeading className="mt-28" title="Personal projects" count={personalProjects.length} note="Self-initiated" />
        <ol className="mt-8 grid gap-x-8 gap-y-16 md:grid-cols-12">
          {personalProjects.map((project, i) => (
            <li key={project.slug} className={tileLayout[i % tileLayout.length].tile}>
              <Reveal delay={(i % 2) * 0.08}>
                <ProjectTile project={project} index={i + 1} coverClassName={tileLayout[i % tileLayout.length].cover} />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function GroupHeading({ title, count, note, className }: { title: string; count: number; note: string; className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-end gap-x-4 gap-y-2 border-b border-line pb-4", className)}>
      <h3 className="font-display text-heading text-fg">{title}</h3>
      <span className="mb-1 rounded-mark bg-amber px-1.5 pt-0.5 font-display text-[1.25rem] leading-tight text-ink">
        {String(count).padStart(2, "0")}
      </span>
      <span className="mb-1.5 ml-auto font-mono text-nav font-bold text-fg-muted">{note}</span>
    </div>
  );
}
