import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacent, getProject, projects } from "@/content/projects";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseToc } from "@/components/case-study/CaseToc";
import { CaseBlockView } from "@/components/case-study/CaseBlocks";
import { NdaGate, NextProject } from "@/components/case-study/CaseFooter";
import { Reveal } from "@/components/motion/Reveal";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.tagline}. ${project.summary}`,
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { prev, next } = getAdjacent(slug);
  const toc = project.sections.map(({ id, nav }) => ({ id, nav }));

  return (
    <article>
      <CaseHero project={project} />

      {project.confidential ? (
        <NdaGate project={project} />
      ) : (
        <div className="container-page grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <aside className="hidden lg:col-span-3 lg:block xl:col-span-2">
            <CaseToc sections={toc} />
          </aside>

          <div className="lg:col-span-9 xl:col-span-10">
            {/* Below lg: contents as jump chips instead of a sticky rail */}
            <nav aria-label="Case study contents" className="mb-12 lg:hidden">
              <ul className="flex flex-wrap gap-2">
                {toc.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="inline-flex h-9 items-center rounded-full px-3.5 font-mono text-nav font-bold text-fg ring-1 ring-line hover:bg-fg/5">
                      {s.nav}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {project.sections.map((section, i) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-title`}
                className={i === 0 ? "scroll-mt-24" : "scroll-mt-24 border-t border-line pt-14 mt-14 lg:pt-20 lg:mt-20"}
              >
                <Reveal>
                  <h2 id={`${section.id}-title`} className="font-display text-title text-fg">
                    {section.title}
                  </h2>
                </Reveal>
                <div className="mt-8 flex flex-col gap-10">
                  {section.blocks.map((block, b) => (
                    <Reveal key={b}>
                      <CaseBlockView block={block} />
                    </Reveal>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}

      <NextProject prev={prev} next={next} />
    </article>
  );
}
