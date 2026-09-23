import Link from "next/link";
import { experience } from "@/content/profile";
import { getProject } from "@/content/projects";
import { Reveal } from "@/components/ui/Reveal";
import { Rich } from "@/components/ui/Rich";

export function ExperienceList({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className="border-b border-line">
      {experience.map((job, i) => (
        <Reveal as="li" key={i} className="grid gap-4 border-t border-line py-8 md:grid-cols-12 md:gap-8">
          <p className="text-sm tabular-nums text-fg-lo md:col-span-3">
            <Rich text={job.period} />
          </p>
          <div className="md:col-span-9">
            <h3 className="text-title">
              <Rich text={job.role} />
              <span className="text-fg-lo"> · </span>
              <Rich text={job.org} />
            </h3>
            <p className="mt-2 max-w-[60ch] text-fg-mid">
              <Rich text={job.summary} />
            </p>
            {detailed && job.highlights.length > 0 && (
              <ul className="mt-5 max-w-[68ch] space-y-2 text-fg-mid">
                {job.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-fg-lo" />
                    {h}
                  </li>
                ))}
              </ul>
            )}
            {job.projects && (
              <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-fg-lo">Case studies:</span>
                {job.projects.map((slug) => {
                  const p = getProject(slug);
                  return p ? (
                    <Link key={slug} href={`/work/${slug}`} className="link-draw inline-flex min-h-9 items-center">
                      {p.title}
                    </Link>
                  ) : null;
                })}
              </p>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
