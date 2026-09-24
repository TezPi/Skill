import { Hero } from "@/components/home/Hero";
import { GlanceStrip } from "@/components/home/GlanceStrip";
import { WorkSection } from "@/components/home/WorkSection";
import { AboutSection } from "@/components/home/AboutSection";
import { PlaygroundSection } from "@/components/home/PlaygroundSection";

/*
 * Order follows the recruiter scan path: identity -> facts -> best work ->
 * background -> range -> contact (footer). Work moved from the bottom of the
 * original board to directly under the fold.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <GlanceStrip />
      <WorkSection />
      <AboutSection />
      <PlaygroundSection />
    </>
  );
}
