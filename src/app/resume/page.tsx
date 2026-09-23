import type { Metadata } from "next";
import Link from "next/link";
import { capabilities, experience, profile, tools } from "@/content/profile";
import { projects } from "@/content/projects";
import { PrintButton } from "@/components/resume/PrintButton";
import { ButtonLink } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Résumé",
  description: `Résumé of ${profile.name}, ${profile.role}.`,
};

/** Single source of truth: the résumé renders from the same content as the site, and prints clean. */
export default function ResumePage() {
  return (
    <div className="container-page max-w-5xl pt-28 pb-24 md:pt-36 print:max-w-none print:p-0">
      <Reveal as="header" className="flex flex-col gap-8 border-b border-line pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-overline text-fg-lo print:hidden">Résumé</p>
          <h1 className="text-display mt-4 print:mt-0 print:text-5xl">
            {profile.name}
            <span className="text-signal">.</span>
          </h1>
          <p className="text-lead mt-3 text-fg-mid">{profile.heroLine}</p>
          <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <a href={`mailto:${profile.email}`} className="link-draw">
              {profile.email}
            </a>
            {profile.phone && (
              <a href={`tel:${profile.phone.replace(/\s/g, "")}`} className="link-draw">
                {profile.phone}
              </a>
            )}
            <span className="text-fg-mid">{profile.location}</span>
          </p>
        </div>
        <div data-print="hide" className="flex flex-wrap gap-3">
          <PrintButton />
          {profile.resumePdf && (
            <ButtonLink href={profile.resumePdf} variant="secondary" download>
              Download PDF
            </ButtonLink>
          )}
        </div>
      </Reveal>

      <Block title="Summary">
        <p className="text-lead max-w-[60ch]">{profile.positioning}</p>
      </Block>

      <Block title="Experience">
        <ol className="space-y-10">
          {experience.map((job, i) => (
            <li key={i} className="grid gap-2 md:grid-cols-[10rem_1fr] md:gap-8">
              <p className="text-sm tabular-nums text-fg-lo">
                <Rich text={job.period} />
              </p>
              <div>
                <h3 className="text-lg font-semibold">
                  <Rich text={job.role} /> <span className="font-normal text-fg-lo">·</span> <Rich text={job.org} />
                </h3>
                <p className="mt-1 text-fg-mid">
                  <Rich text={job.summary} />
                </p>
                {job.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-fg-mid">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-fg-lo" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Block>

      <Block title="Selected case studies">
        <ul className="space-y-4">
          {projects.map((p) => (
            <li key={p.slug} className="grid gap-1 md:grid-cols-[10rem_1fr] md:gap-8">
              <p className="text-sm tabular-nums text-fg-lo">
                {p.index} · {p.year}
              </p>
              <p>
                <Link href={`/work/${p.slug}`} className="link-draw font-semibold">
                  {p.title}
                </Link>
                <span className="text-fg-mid">: {p.headline}</span>
              </p>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Capabilities">
        <dl className="grid gap-x-8 gap-y-5 md:grid-cols-2">
          {capabilities.map((c) => (
            <div key={c.title}>
              <dt className="font-semibold">{c.title}</dt>
              <dd className="mt-1 text-fg-mid">{c.evidence.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </Block>

      <Block title="Tools">
        <p className="text-fg-mid">{tools.join(" · ")}</p>
      </Block>

      <Block title="Languages">
        <p className="text-fg-mid">
          Vietnamese (native) · English <Rich text="[Insert level]" />
        </p>
      </Block>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="grid gap-4 border-b border-line py-10 md:grid-cols-[10rem_1fr] md:gap-8 print:break-inside-avoid print:py-6">
      <h2 className="text-overline pt-1 text-fg-lo">{title}</h2>
      <div>{children}</div>
    </Reveal>
  );
}
