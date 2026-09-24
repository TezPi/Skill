import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import { resumeLink, site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { HeroHeadline } from "./HeroHeadline";
import { LanyardBadge } from "./LanyardBadge";

/**
 * Intro section. Hero stack (4 elements max): role headline, one-line intro
 * with the full name, primary + secondary CTA. Identity is carried visually by
 * the ID badge; fast-scan facts live in the strip right below.
 */
export function Hero() {
  return (
    <section id="intro" data-scroll-marker="Intro" aria-label="Introduction" className="on-cobalt canvas-grid relative overflow-hidden bg-cobalt text-snow">
      <div className="container-page grid gap-y-4 lg:min-h-[calc(100dvh-4rem-11.5rem)] lg:grid-cols-12 lg:gap-x-10">
        <div className="self-center pt-12 pb-6 sm:pt-16 lg:col-span-7 lg:py-10 lg:[@media(max-height:760px)]:py-5">
          <HeroHeadline />

          <p className="mt-6 max-w-[36ch] text-[1.625rem] leading-[1.2] text-cream sm:text-[1.875rem]">
            I&apos;m <span className="font-mono text-[0.84em] font-bold whitespace-nowrap text-snow">{site.name}</span>. {site.intro}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href="/#work" variant="sun" size="lg" icon={<ArrowRightIcon size={20} weight="bold" />}>
              View work
            </ButtonLink>
            <ButtonLink
              href={resumeLink.href}
              external={resumeLink.external}
              variant="ghost"
              size="lg"
              icon={resumeLink.external ? <ArrowUpRightIcon size={20} weight="bold" /> : undefined}
            >
              Resume
            </ButtonLink>
          </div>
        </div>

        <div className="flex justify-center pt-12 pb-14 lg:col-span-5 lg:justify-end lg:self-start lg:pt-0 lg:pr-8 lg:pb-0">
          <LanyardBadge />
        </div>
      </div>
    </section>
  );
}
