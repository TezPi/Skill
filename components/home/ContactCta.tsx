import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { profile } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";

/** The page ends in one voice: a speech bubble with one action. */
export function ContactCta() {
  return (
    <section aria-labelledby="cta-heading" className="section relative overflow-hidden bg-bg-alt">
      <div aria-hidden="true" className="speed-lines pointer-events-none absolute inset-[-20%]" />
      <div className="shell relative">
        <Reveal className="bubble relative mx-auto max-w-5xl px-6 py-12 md:px-16 md:py-20">
          <h2 id="cta-heading" className="display-1 max-w-[15ch]">
            Have a product that needs a sharper frame?
          </h2>
          <p className="lede mt-6">Tell me what you&apos;re building and where it hurts. I&apos;ll reply with how I would approach it.</p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/contact" className="btn">
              Contact
              <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </Link>
            {profile.email ? (
              <a href={`mailto:${profile.email}`} className="link-line font-semibold">
                {profile.email}
              </a>
            ) : null}
          </div>
          <span aria-hidden="true" className="absolute -bottom-[19px] left-16 size-9 rotate-45 border-b-2 border-r-2 border-fg bg-bg" />
        </Reveal>
      </div>
    </section>
  );
}
