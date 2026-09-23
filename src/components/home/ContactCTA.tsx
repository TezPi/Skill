import { profile } from "@/content/profile";
import { ButtonLink } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";
import { SignalDot } from "@/components/ui/Tag";

/** Borrowed from the product's own voice: "Đội ngũ đang trực. Hôm nay giao gì?" */
export function ContactCTA() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden border-t border-line">
      <div className="container-page py-24 md:py-40">
        <Reveal as="p" y={10} className="text-overline mb-8 flex items-center gap-3 text-fg-mid">
          <SignalDot breathe /> {profile.availability}
        </Reveal>
        <h2 id="cta-title" lang="vi" className="text-display max-w-[14ch]">
          <SplitText as="span" text="Đang trực." className="block" />
          <SplitText as="span" text="Hôm nay giao gì?" className="block text-fg-lo" delay={0.2} />
        </h2>
        <Reveal as="p" delay={0.3} className="text-lead mt-6 font-light italic text-fg-mid">
          On duty. What are we building today?
        </Reveal>
        <Reveal delay={0.4} className="mt-12 flex flex-wrap items-center gap-3">
          <ButtonLink href="/contact" size="lg" runner>
            Send a message
          </ButtonLink>
          <CopyButton value={profile.email} label={profile.email} className="h-13 px-5 text-base" />
        </Reveal>
      </div>
    </section>
  );
}
