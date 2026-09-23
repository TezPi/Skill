import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { principles, profile, skillGroups, tools } from "@/content/profile";
import { ExperiencePreview } from "@/components/home/ExperiencePreview";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { Reveal } from "@/components/ui/Reveal";
import { SlotText } from "@/components/ui/SlotText";

export const metadata: Metadata = {
  title: "About",
  description: `${profile.handle}, ${profile.role}. How I think, what I bring and the tools I use.`,
};

function Portrait() {
  if (profile.portrait) {
    return (
      <Image src={profile.portrait} alt={`Portrait of ${profile.name}`} fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover tritone" priority />
    );
  }
  // No portrait yet: a monogram panel rather than a stock face.
  return (
    <div className="absolute inset-0 grid place-items-center" role="img" aria-label={`${profile.name} monogram`}>
      <div className="halftone fade-br absolute inset-0 opacity-60" style={{ "--ht-color": "var(--signal)", "--ht-size": "10px", "--ht-dot": "2px" } as React.CSSProperties} />
      <span className="relative text-[clamp(6rem,16vw,12rem)] font-black leading-none tracking-[-0.06em]">{profile.initials}</span>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="shell grid gap-12 pb-24 pt-16 md:pt-24 lg:grid-cols-[7fr_5fr] lg:gap-20">
        <div>
          <h1 className="display-1">Hi, I&apos;m {profile.name}.</h1>
          <p className="mt-8 max-w-[34ch] text-2xl font-bold leading-snug tracking-tight md:text-3xl">
            {profile.role} focused on AI products, design systems and the motion between states.
          </p>
          <div className="mt-8 flex flex-col gap-5">
            {profile.bio.map((paragraph) => (
              <p key={paragraph} className="lede">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/5] border-[2.5px] border-fg bg-bg-alt shadow-[10px_10px_0_var(--signal)] lg:mt-6">
          <Portrait />
        </div>
      </section>

      <section aria-labelledby="philosophy-heading" className="section bg-bg-alt">
        <div className="shell">
          <Reveal>
            <h2 id="philosophy-heading" className="display-2 max-w-[14ch]">
              Design philosophy
            </h2>
          </Reveal>
          <Reveal as="ul" stagger={0.08} className="mt-14 grid gap-[2.5px] border-[2.5px] border-fg bg-fg md:mt-20 md:grid-cols-2">
            {principles.map((principle) => (
              <li key={principle.id} className="flex flex-col gap-4 bg-bg p-7 md:p-10">
                <h3 className="text-2xl font-extrabold tracking-tight md:text-3xl">{principle.title}</h3>
                <p className="lede">{principle.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="skills-heading" className="section">
        <div className="shell">
          <Reveal>
            <h2 id="skills-heading" className="display-2">
              Skills
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[1.2fr_1fr_1fr]">
            {skillGroups.map((group) => (
              <div key={group.title} className="border-t-[2.5px] border-fg pt-6">
                <h3 className="text-xl font-extrabold">{group.title}</h3>
                <ul className="mt-5 flex flex-col gap-3 text-lg text-muted">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mt-24 text-xl font-extrabold">Tools</h3>
          <ul className="mt-6 flex flex-wrap gap-3">
            {tools.map((tool) => (
              <li key={tool.name} className="flex h-12 items-center gap-3 border-2 border-fg px-4 font-semibold">
                <BrandIcon name={tool.icon} className="size-5" />
                {tool.name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="bg-bg-alt">
        <ExperiencePreview />
      </div>

      <section aria-labelledby="personal-heading" className="section">
        <div className="shell grid gap-10 md:grid-cols-[5fr_7fr]">
          <h2 id="personal-heading" className="display-2">
            Outside the file
          </h2>
          <div>
            <p className="text-2xl leading-snug">
              <SlotText text={profile.personal} />
            </p>
            <Link href="/contact" className="btn mt-12">
              Contact
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
