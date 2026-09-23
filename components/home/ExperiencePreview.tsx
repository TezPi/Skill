import Link from "next/link";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SlotText } from "@/components/ui/SlotText";

export function ExperiencePreview() {
  return (
    <section aria-labelledby="experience-heading" className="section">
      <div className="shell">
        <Reveal>
          <h2 id="experience-heading" className="display-2">
            Experience
          </h2>
        </Reveal>
        <Reveal as="ol" stagger={0.08} className="mt-14 border-t-[2.5px] border-fg md:mt-20">
          {profile.experience.map((item, i) => (
            <li key={i} className="grid gap-3 border-b-[2.5px] border-fg py-8 md:grid-cols-[1fr_2fr_2fr] md:gap-10 md:py-10">
              <p className="font-semibold text-muted">
                <SlotText text={item.period} />
              </p>
              <div>
                <p className="text-2xl font-extrabold tracking-tight">
                  <SlotText text={item.role} />
                </p>
                <p className="mt-1 text-muted">
                  <SlotText text={item.company} />
                </p>
              </div>
              <p className="leading-relaxed text-muted">
                <SlotText text={item.summary} />
              </p>
            </li>
          ))}
        </Reveal>
        <Link href="/resume" className="btn btn-secondary mt-14">
          Resume
        </Link>
      </div>
    </section>
  );
}
