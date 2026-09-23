import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getProject, projectHref, projects } from "@/content/projects";
import { CaseStudy } from "@/components/case/CaseStudy";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.filter((p) => !p.protected).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project || project.protected) return {};
  return { title: project.name, description: project.summary };
}

export default async function CaseStudyPage({ params }: Params) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  if (project.protected) redirect(projectHref(project));
  return <CaseStudy project={project} />;
}
