import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacentProjects, getProject, projects } from "@/content/projects";
import { CaseHero } from "@/components/case-study/CaseHero";
import { CaseToc } from "@/components/case-study/CaseToc";
import { NextProject } from "@/components/case-study/NextProject";
import { ReadingProgress } from "@/components/case-study/ReadingProgress";
import { ScanStrip } from "@/components/case-study/ScanStrip";
import { SectionRenderer } from "@/components/case-study/SectionRenderer";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: `${project.headline} ${project.summary}`,
    openGraph: { title: project.title, description: project.headline },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const { next } = getAdjacentProjects(slug);

  return (
    <article>
      <ReadingProgress />
      <CaseHero project={project} />
      <ScanStrip scan={project.scan} />
      <div className="container-page grid gap-10 lg:grid-cols-12">
        <aside className="hidden lg:col-span-3 lg:block">
          <CaseToc items={project.sections.map((s) => ({ id: s.id, label: s.nav }))} />
        </aside>
        <div className="min-w-0 lg:col-span-9">
          {project.sections.map((s) => (
            <SectionRenderer key={s.id} section={s} />
          ))}
        </div>
      </div>
      <NextProject next={next} />
    </article>
  );
}
