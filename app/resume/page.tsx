import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, DownloadSimple } from "@phosphor-icons/react/ssr";
import { profile, skillGroups, tools } from "@/content/profile";
import { projectHref, projects } from "@/content/projects";
import { PrintButton } from "@/components/ui/PrintButton";
import { SlotText } from "@/components/ui/SlotText";

export const metadata: Metadata = {
  title: "Resume",
  description: `${profile.handle}, ${profile.role}. Experience, skills and tools.`,
};

export default function ResumePage() {
  const links = profile.links.filter((link) => link.href);
  const selected = projects.filter((p) => !p.protected);

  return (
    <div className="shell pb-32 pt-16 md:pb-48 md:pt-24">
      <div className="no-print flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <h1 className="display-1">Resume</h1>
        <div className="flex flex-wrap gap-4 pb-1.5 pr-1.5">
          <PrintButton />
          {profile.resumeUrl ? (
            <a href={profile.resumeUrl} download className="btn btn-secondary">
              <DownloadSimple size={18} weight="bold" aria-hidden="true" />
              Download PDF
            </a>
          ) : null}
        </div>
      </div>

      <article className="print-plain mt-14 border-[2.5px] border-fg bg-bg p-7 shadow-[10px_10px_0_var(--fg)] md:mt-20 md:p-14">
        <header className="flex flex-col justify-between gap-6 border-b-[2.5px] border-fg pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-4xl font-black tracking-tight md:text-5xl">{profile.name}</p>
            <p className="mt-2 text-xl font-semibold text-muted">{profile.role}</p>
          </div>
          <ul className="flex flex-col gap-1 text-sm md:items-end">
            {profile.email ? (
              <li>
                <a href={`mailto:${profile.email}`} className="link-line font-semibold">
                  {profile.email}
                </a>
              </li>
            ) : null}
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="link-line font-semibold" target="_blank" rel="noreferrer">
                  {link.href.replace(/^https?:\/\//, "")}
                  <ArrowUpRight size={12} weight="bold" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </header>

        <section className="grid gap-4 border-b-2 border-fg/15 py-10 md:grid-cols-[200px_1fr] md:gap-10">
          <h2 className="font-extrabold">Profile</h2>
          <div className="flex flex-col gap-3 leading-relaxed text-muted">
            {profile.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="grid gap-4 border-b-2 border-fg/15 py-10 md:grid-cols-[200px_1fr] md:gap-10">
          <h2 className="font-extrabold">Experience</h2>
          <ol className="flex flex-col gap-8">
            {profile.experience.map((item, i) => (
              <li key={i}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="text-lg font-bold">
                    <SlotText text={item.role} />, <SlotText text={item.company} />
                  </p>
                  <p className="text-sm font-semibold text-muted">
                    <SlotText text={item.period} />
                  </p>
                </div>
                <p className="mt-2 leading-relaxed text-muted">
                  <SlotText text={item.summary} />
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-4 border-b-2 border-fg/15 py-10 md:grid-cols-[200px_1fr] md:gap-10">
          <h2 className="font-extrabold">Selected work</h2>
          <ul className="flex flex-col gap-4">
            {selected.map((project) => (
              <li key={project.slug}>
                <Link href={projectHref(project)} className="link-line font-bold">
                  {project.name}
                </Link>
                <p className="mt-1 text-muted">{project.title}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid gap-4 border-b-2 border-fg/15 py-10 md:grid-cols-[200px_1fr] md:gap-10">
          <h2 className="font-extrabold">Skills</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {skillGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-bold">{group.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{group.items.join(", ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 border-b-2 border-fg/15 py-10 md:grid-cols-[200px_1fr] md:gap-10">
          <h2 className="font-extrabold">Tools</h2>
          <p className="leading-relaxed text-muted">{tools.map((tool) => tool.name).join(", ")}</p>
        </section>

        <section className="grid gap-4 pt-10 md:grid-cols-[200px_1fr] md:gap-10">
          <h2 className="font-extrabold">Education</h2>
          <p className="leading-relaxed text-muted">
            <SlotText text={profile.education} />
          </p>
        </section>
      </article>
    </div>
  );
}
