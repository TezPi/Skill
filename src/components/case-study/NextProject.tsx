import Link from "next/link";
import type { Project } from "@/content/types";
import { Specimen } from "@/components/specimens";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";

/** No dead ends: every case study hands off to the next one, or to contact. */
export function NextProject({ next }: { next: Project }) {
  return (
    <section aria-label="Next project" className="container-page border-t border-line py-20 md:py-28">
      <p className="text-overline text-fg-lo">Next case study</p>
      <Link href={`/work/${next.slug}`} className="group mt-6 grid items-center gap-8 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="text-overline tabular-nums text-fg-lo">{next.index}</p>
          <p className="text-display mt-3 flex items-center gap-4">
            <span className="link-draw">{next.title}</span>
            <ArrowRight size={40} className="hidden shrink-0 transition-transform duration-500 ease-expo group-hover:translate-x-2 md:block" />
          </p>
          <p className="text-lead mt-3 text-fg-mid">{next.headline}</p>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden rounded-panel border border-line md:col-span-5">
          <div className="absolute inset-0 transition-transform duration-700 ease-expo group-hover:scale-[1.03]">
            <Specimen kind={next.specimen} />
          </div>
        </div>
      </Link>
      <div className="mt-14 flex flex-wrap gap-3">
        <ButtonLink href="/contact">Talk about this work</ButtonLink>
        <ButtonLink href="/work" variant="secondary" arrow={false}>
          All work
        </ButtonLink>
      </div>
    </section>
  );
}
