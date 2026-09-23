import { FigmaHero } from "@/components/hero/FigmaHero";
import { Statement } from "@/components/home/Statement";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Expertise } from "@/components/home/Expertise";
import { Principles } from "@/components/home/Principles";
import { ToolsMarquee } from "@/components/home/ToolsMarquee";
import { ExperiencePreview } from "@/components/home/ExperiencePreview";
import { ContactCta } from "@/components/home/ContactCta";

export default function HomePage() {
  return (
    <>
      <FigmaHero />
      <Statement />
      <FeaturedWork />
      <Expertise />
      <Principles />
      <ToolsMarquee />
      <ExperiencePreview />
      <ContactCta />
    </>
  );
}
