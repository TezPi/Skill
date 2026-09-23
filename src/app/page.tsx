import { Hero } from "@/components/home/Hero";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { Principles } from "@/components/home/Principles";
import { AuditNumbers } from "@/components/home/AuditNumbers";
import { Capabilities } from "@/components/home/Capabilities";
import { ExperiencePreview } from "@/components/home/ExperiencePreview";
import { ContactCTA } from "@/components/home/ContactCTA";

/** Recruiter scan order: identity → best work → how I think → proof → capabilities → experience → contact. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <Principles />
      <AuditNumbers />
      <Capabilities />
      <ExperiencePreview />
      <ContactCTA />
    </>
  );
}
