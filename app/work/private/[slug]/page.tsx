import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject } from "@/content/projects";
import { CaseStudy } from "@/components/case/CaseStudy";
import { ProtectedGate } from "@/components/case/ProtectedGate";
import { isUnlocked } from "@/lib/unlock";

// Reads the unlock cookie on every request, so it can never be prerendered.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project?.protected ? { title: project.name, description: "Private case study.", robots: { index: false, follow: false } } : {};
}

export default async function PrivateCaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.protected) notFound();
  if (!(await isUnlocked(slug))) return <ProtectedGate slug={slug} name={project.name} />;
  return <CaseStudy project={project} />;
}
