import Link from "next/link";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/ssr";
import { getNextProject, projectHref, type Project } from "@/content/projects";
import { CaseBlock } from "@/components/case/CaseBlocks";
import { CaseNav } from "@/components/case/CaseNav";
import { ComicImage } from "@/components/ui/ComicImage";
import { Reveal } from "@/components/ui/Reveal";
import { SlotText } from "@/components/ui/SlotText";

/** Scan layer (meta + problem/solution/impact) first, then the deep read with a section index. */
export function CaseStudy({ project }: { project: Project }) {
  const slug = project.slug;
  const next = getNextProject(slug);
  const meta = [
    { label: "Role", value: project.role },
    { label: "Timeline", value: project.meta.timeline },
    { label: "Team", value: project.meta.team.join(", ") },
    { label: "Platform", value: project.meta.platform },
  ];
  const scan = [
    { label: "Problem", value: project.scan.problem },
    { label: "Solution", value: project.scan.solution },
    { label: "Impact", value: project.scan.impact },
  ];

  return (
    <article>
      <header className="shell pt-12 md:pt-20">
        <Link href="/work" className="link-line text-sm font-semibold">
          <ArrowLeft size={16} weight="bold" aria-hidden="true" />
          All work
        </Link>
        <p className="mt-10 font-bold text-muted">
          {project.name}
          {project.sample ? <span className="slot ml-3 text-sm">Sample case study</span> : null}
        </p>
        <h1 className="display-1 mt-4 max-w-[20ch]">{project.title}</h1>
        <p className="lede mt-6 text-xl">{project.summary}</p>
      </header>

      {project.cover ? (
        <div className="shell mt-12 md:mt-16">
          <ComicImage
            src={project.cover.src}
            alt={project.cover.alt}
            fallback={project.name}
            priority
            sizes="(min-width: 1400px) 1336px, 100vw"
            className="aspect-[16/10] border-[2.5px] border-fg shadow-[8px_8px_0_var(--signal)] md:aspect-[16/8]"
          />
        </div>
      ) : null}

      <section aria-label="Project details" className="shell mt-14 md:mt-20">
        <dl className="grid grid-cols-2 gap-[2.5px] border-[2.5px] border-fg bg-fg md:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label} className="bg-bg p-5">
              <dt className="text-sm font-semibold text-muted">{item.label}</dt>
              <dd className="mt-1 font-bold">
                <SlotText text={item.value} />
              </dd>
            </div>
          ))}
        </dl>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Responsibilities">
          {project.meta.responsibilities.map((item) => (
            <li key={item} className="tag">
              <SlotText text={item} />
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="scan-heading" className="shell mt-20 md:mt-28">
        <h2 id="scan-heading" className="sr-only">
          In short
        </h2>
        <div className="grid gap-[2.5px] border-[2.5px] border-fg bg-fg md:grid-cols-[1.25fr_1fr_0.9fr]">
          {scan.map((item, i) => (
            <div key={item.label} className={i === 2 ? "bg-signal-soft p-6 md:p-8" : "bg-bg p-6 md:p-8"}>
              <p className="text-sm font-bold">{item.label}</p>
              <p className="mt-3 text-xl font-bold leading-snug tracking-tight">
                <SlotText text={item.value} />
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="shell mt-24 grid gap-12 md:mt-32 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-20">
        <CaseNav sections={project.sections.map(({ id, title }) => ({ id, title }))} bodyId="case-body" />
        <div id="case-body" className="flex max-w-[72ch] flex-col gap-24 md:gap-32">
          {project.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
              <Reveal>
                <h2 id={`${section.id}-heading`} className="text-[clamp(2rem,3.4vw,3rem)] font-extrabold leading-none tracking-[-0.035em]">
                  {section.title}
                </h2>
              </Reveal>
              <div className="mt-8 flex flex-col gap-8">
                {section.blocks.map((block, i) => (
                  <CaseBlock key={i} block={block} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <nav aria-label="Next project" className="shell section">
        <Link href={projectHref(next)} className="group lift block">
          <span className="lift-shadow" aria-hidden="true" />
          <span className="lift-body panel flex flex-col gap-6 p-8 md:flex-row md:items-end md:justify-between md:p-14">
            <span>
              <span className="block font-bold text-muted">Next project</span>
              <span className="display-2 mt-3 block">{next.name}</span>
              <span className="lede mt-3 block">{next.title}</span>
            </span>
            <ArrowRight size={56} weight="bold" aria-hidden="true" className="shrink-0 text-signal transition-[translate] duration-500 ease-snap group-hover:translate-x-2" />
          </span>
        </Link>
      </nav>
    </article>
  );
}
