import Link from "next/link";
import type { Project } from "@/content/types";
import { Specimen, specimenCaption } from "@/components/specimens";
import { Reveal } from "@/components/ui/Reveal";
import { Rich } from "@/components/ui/Rich";
import { SplitText } from "@/components/ui/SplitText";
import { Tag } from "@/components/ui/Tag";
import { ArrowLeft } from "@/components/ui/icons";

export function CaseHero({ project }: { project: Project }) {
  const meta = [
    { k: "Role", v: project.role },
    { k: "Platform", v: project.platform },
    { k: "Timeline", v: project.timeline },
    { k: "Team", v: project.team },
    { k: "Year", v: project.year },
  ];
  return (
    <header className="container-page pt-28 md:pt-36">
      <Reveal y={10}>
        <Link
          href="/work"
          className="group -ml-2 inline-flex min-h-11 items-center gap-2 rounded-control px-2 text-sm text-fg-mid transition-colors hover:text-fg"
        >
          <ArrowLeft size={14} className="transition-transform duration-500 ease-expo group-hover:-translate-x-1" />
          All work
        </Link>
      </Reveal>

      <Reveal as="p" y={10} delay={0.05} className="text-overline mt-10 flex flex-wrap items-center gap-3 text-fg-lo">
        <span className="tabular-nums text-fg">{project.index}</span>
        <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
        {project.productType}
      </Reveal>

      <SplitText as="h1" trigger="mount" delay={0.1} text={project.title} className="text-display mt-6" />
      <SplitText
        as="p"
        trigger="mount"
        delay={0.35}
        text={project.headline}
        className="text-headline mt-4 max-w-[22ch] font-light text-fg-mid"
      />

      <div className="mt-12 grid gap-10 border-t border-line pt-8 lg:grid-cols-12">
        <Reveal as="p" delay={0.5} className="text-lead text-fg lg:col-span-6">
          {project.summary}
        </Reveal>
        <Reveal as="dl" delay={0.6} className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm lg:col-span-5 lg:col-start-8">
          {meta.map((m) => (
            <div key={m.k} className="contents">
              <dt className="text-fg-lo">{m.k}</dt>
              <dd>
                <Rich text={m.v} />
              </dd>
            </div>
          ))}
          <dt className="text-fg-lo">Did</dt>
          <dd className="flex flex-wrap gap-1.5">
            {project.responsibilities.map((r) => (
              <Tag key={r}>{r}</Tag>
            ))}
          </dd>
        </Reveal>
      </div>

      <Reveal as="figure" delay={0.2} className="mt-16 md:mt-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sheet border border-line bg-bg-raised sm:aspect-[16/9] lg:aspect-[21/9]">
          <Specimen kind={project.specimen} />
        </div>
        <figcaption className="mt-4 text-sm text-fg-lo">{specimenCaption[project.specimen]}</figcaption>
      </Reveal>
    </header>
  );
}
