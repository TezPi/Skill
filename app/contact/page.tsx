import type { Metadata } from "next";
import { Suspense } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { profile } from "@/content/profile";
import { ContactForm } from "@/components/contact/ContactForm";
import { SlotText } from "@/components/ui/SlotText";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${profile.handle} about a product, a team or a role.`,
};

export default function ContactPage() {
  const links = profile.links.filter((link) => link.href);

  return (
    <div className="shell grid gap-14 pb-32 pt-16 md:pb-48 md:pt-24 lg:grid-cols-[5fr_7fr] lg:gap-20">
      <div>
        <h1 className="display-1">Contact</h1>
        <p className="lede mt-6">Tell me about the product, the team and the timeline. Roles, freelance and collaborations are all welcome.</p>
        <dl className="mt-12 flex flex-col gap-6">
          <div>
            <dt className="text-sm font-bold">Reply time</dt>
            <dd className="mt-1 text-muted">
              <SlotText text={profile.responseTime} />
            </dd>
          </div>
          {profile.email ? (
            <div>
              <dt className="text-sm font-bold">Email</dt>
              <dd className="mt-1">
                <a href={`mailto:${profile.email}`} className="link-line font-semibold">
                  {profile.email}
                </a>
              </dd>
            </div>
          ) : null}
          {links.length ? (
            <div>
              <dt className="text-sm font-bold">Elsewhere</dt>
              <dd className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
                {links.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="link-line font-semibold">
                    {link.label}
                    <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
      <Suspense fallback={<div className="min-h-[560px] border-[2.5px] border-fg/20 bg-bg-alt" aria-hidden="true" />}>
        <ContactForm />
      </Suspense>
    </div>
  );
}
