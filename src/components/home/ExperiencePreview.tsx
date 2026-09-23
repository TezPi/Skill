import { ButtonLink } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ExperienceList } from "./ExperienceList";

export function ExperiencePreview() {
  return (
    <section aria-labelledby="experience-title" className="container-page py-24 md:py-36">
      <SectionHeader
        titleId="experience-title"
        eyebrow="Experience"
        title="Where the work happened."
        action={
          <ButtonLink href="/resume" variant="secondary">
            Full résumé
          </ButtonLink>
        }
      />
      <div className="mt-14 lg:mt-20">
        <ExperienceList />
      </div>
    </section>
  );
}
