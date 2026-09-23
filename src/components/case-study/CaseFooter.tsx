import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, LockSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/content/types";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";

/** NDA state: the hero stays public, the body is available on request. */
export function NdaGate({ project }: { project: Project }) {
  const subject = encodeURIComponent(`Case study access: ${project.title}`);
  return (
    <section aria-labelledby="nda-title" className="container-page py-24">
      <div className="mx-auto max-w-2xl rounded-card bg-surface-raised p-8 text-center ring-1 ring-line sm:p-12">
        <span className="mx-auto grid size-14 place-items-center rounded-control bg-cobalt text-snow">
          <LockSimpleIcon size={26} weight="bold" aria-hidden />
        </span>
        <h2 id="nda-title" className="mt-6 font-display text-title text-fg">
          Under NDA
        </h2>
        <p className="mx-auto mt-4 max-w-[40ch] font-mono text-read text-fg-muted">
          The full process and screens for this project are shared privately. Ask and I&apos;ll send a walkthrough.
        </p>
        <ButtonLink href={`mailto:${site.email}?subject=${subject}`} className="mt-8" size="lg">
          Request access
        </ButtonLink>
      </div>
    </section>
  );
}

/** No dead ends: every case study hands off to the next one. */
export function NextProject({ prev, next }: { prev?: Project; next: Project }) {
  return (
    <nav aria-label="More projects" className="border-t border-line">
      <Link
        href={`/work/${next.slug}`}
        className="group container-page flex flex-col gap-6 py-16 focus-visible:outline-offset-[-3px] sm:flex-row sm:items-end sm:justify-between lg:py-24"
      >
        <span>
          <span className="label block text-fg-muted">Next project</span>
          <span className="mt-3 block font-display text-display text-fg transition-colors duration-200 group-hover:text-accent-fg">
            {next.title}
          </span>
          <span className="mt-1 block text-lead text-fg-muted">{next.tagline}</span>
        </span>
        <span
          aria-hidden
          className="grid size-16 shrink-0 place-items-center rounded-control bg-cobalt text-snow shadow-hard transition-[transform,box-shadow] duration-150 ease-snap group-hover:-translate-x-px group-hover:-translate-y-px group-hover:shadow-hard-hover"
        >
          <ArrowRightIcon size={28} weight="bold" className="transition-transform duration-200 ease-out-expo group-hover:translate-x-1" />
        </span>
      </Link>
      {prev ? (
        <div className="container-page border-t border-line py-5">
          <Link href={`/work/${prev.slug}`} className="inline-flex items-center gap-2 font-mono text-nav font-bold text-fg-muted hover:text-fg">
            <ArrowLeftIcon size={14} weight="bold" aria-hidden />
            Previous: {prev.title}
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
