import type { TimelineItem } from "@/content/types";
import { site } from "@/content/site";
import { Plate } from "@/components/ui/Plate";
import { Highlight } from "@/components/ui/Highlight";
import { TagList } from "@/components/ui/Tag";
import { Reveal } from "@/components/motion/Reveal";

/*
 * Audit fix: the Figma board highlighted every organisation in amber, so the
 * highlight stopped meaning anything. Here amber marks only the current role.
 */
export function AboutSection() {
  return (
    <section id="about" data-scroll-marker="About" aria-labelledby="about-title" className="scroll-mt-16 overflow-x-clip border-t border-line py-24 lg:py-32">
      <div className="container-page">
        <Reveal>
          <Plate id="about-title" bleed="right">
            About Me
          </Plate>
        </Reveal>

        <div className="mt-14 grid gap-x-12 gap-y-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="max-w-[30ch] text-[1.75rem] leading-[1.15] text-fg">{site.bio[0]}</p>
            {site.bio.slice(1).map((paragraph) => (
              <p key={paragraph} className="mt-6 max-w-[46ch] font-mono text-read text-fg-muted">
                {paragraph}
              </p>
            ))}

            <SubHeading className="mt-12">Disciplines</SubHeading>
            <TagList tags={site.disciplines} className="mt-4" />
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <SubHeading id="experience" className="scroll-mt-24">
              Work Experience
            </SubHeading>
            <Timeline items={site.experience} />

            <SubHeading className="mt-14">Education</SubHeading>
            <Timeline items={site.education} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Brand sub-header chip ("Contact", "Education", "Work Experience" on the Figma board) */
function SubHeading({ children, id, className }: { children: React.ReactNode; id?: string; className?: string }) {
  return (
    <h3 id={id} className={className}>
      <span className="inline-block rounded-mark bg-cobalt px-2.5 pt-1 pb-0.5 font-display text-[1.375rem] leading-tight text-snow">
        {children}
      </span>
    </h3>
  );
}

function Timeline({ items }: { items: readonly TimelineItem[] }) {
  return (
    <ol className="mt-6 flex flex-col gap-7">
      {items.map((item) => (
        <li key={`${item.org}-${item.period}`} className="grid grid-cols-[5.5rem_1fr] gap-x-5 sm:grid-cols-[7rem_1fr]">
          <p className="pt-1.5 font-mono text-[0.8125rem] font-bold tracking-[0.04em] text-fg-muted">{item.period}</p>
          <div>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-display text-[1.75rem] leading-none text-fg">
                {item.current ? <Highlight>{item.org}</Highlight> : item.org}
              </span>
              <span className="label text-fg-muted">
                {item.current ? `${item.type}, now` : item.type}
              </span>
            </p>
            <p className="mt-1.5 text-body text-fg">
              {item.title}
              {item.detail ? <span className="text-fg-muted">. {item.detail}</span> : null}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
