import { projects } from "@/content/projects";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "./ProjectCard";

export function FeaturedWork() {
  return (
    <section id="work" aria-labelledby="work-title" className="container-page scroll-mt-24 py-24 md:py-36">
      <SectionHeader
        titleId="work-title"
        eyebrow="Selected work"
        title="Three projects, three different strengths."
        intro="Product UX for an AI platform, the design system under it, and the motion grammar on top. Each case study explains the reasoning, not only the final screens."
        action={
          <ButtonLink href="/work" variant="secondary">
            All work
          </ButtonLink>
        }
      />
      <div className="mt-16 space-y-24 md:mt-24 md:space-y-36">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} flip={i % 2 === 1} />
        ))}
      </div>
    </section>
  );
}
