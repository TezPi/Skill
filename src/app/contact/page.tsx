import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyButton } from "@/components/ui/CopyButton";
import { LocalTime } from "@/components/ui/LocalTime";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Rich";
import { SplitText } from "@/components/ui/SplitText";
import { SignalDot } from "@/components/ui/Tag";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${profile.name}.`,
};

export default function ContactPage() {
  const linkedin = profile.socials.find((s) => s.label === "LinkedIn");
  return (
    <div className="container-page grid gap-16 pt-28 pb-24 md:pt-36 md:pb-36 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Reveal as="p" y={10} className="text-overline flex items-center gap-3 text-fg-mid">
          <SignalDot breathe /> {profile.availability}
        </Reveal>
        <h1 className="text-display mt-6">
          <SplitText as="span" trigger="mount" lang="vi" text="Đang trực." className="block" />
          <SplitText as="span" trigger="mount" delay={0.2} text="Let's talk." className="block text-fg-lo" />
        </h1>
        <Reveal as="p" delay={0.3} className="text-lead mt-8 max-w-[34ch] text-fg-mid">
          Hiring for a product design role, or building an AI product that needs a designer? Tell me about it.
        </Reveal>

        <Reveal as="dl" delay={0.4} className="mt-12 space-y-6 border-t border-line pt-8 text-sm">
          <div>
            <dt className="text-fg-lo">Email</dt>
            <dd className="mt-2">
              <CopyButton value={profile.email} label={profile.email} />
            </dd>
          </div>
          {profile.phone && (
            <div>
              <dt className="text-fg-lo">Phone</dt>
              <dd className="mt-1">
                <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="link-draw inline-flex min-h-11 items-center">
                  {profile.phone}
                </a>
              </dd>
            </div>
          )}
          <div>
            <dt className="text-fg-lo">LinkedIn</dt>
            <dd className="mt-1">
              {linkedin?.href ? (
                <a href={linkedin.href} target="_blank" rel="noreferrer" className="link-draw inline-flex min-h-11 items-center">
                  {linkedin.href.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <Placeholder>add LinkedIn URL</Placeholder>
              )}
            </dd>
          </div>
          <div>
            <dt className="text-fg-lo">Local time</dt>
            <dd className="mt-1">
              {profile.location} · <LocalTime timeZone={profile.timezone} /> (GMT+7)
            </dd>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="lg:col-span-6 lg:col-start-7 lg:pt-10">
        <ContactForm to={profile.email} />
      </Reveal>
    </div>
  );
}
