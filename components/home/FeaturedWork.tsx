import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/ssr";
import { projects, toCard } from "@/content/projects";
import { ProjectPanel } from "@/components/work/ProjectPanel";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Comic page bento. 6 columns:
 * A 4x2 + B 2x1 + C 2x1 fills rows 1-2 (12 cells), D 6x1 fills row 3. No empty cells.
 */
const LAYOUT = [
  { variant: "feature", className: "md:col-span-4 md:row-span-2" },
  { variant: "compact", className: "md:col-span-2" },
  { variant: "compact", className: "md:col-span-2" },
  { variant: "wide", className: "md:col-span-6" },
] as const;

export function FeaturedWork() {
  const featured = projects.slice(0, LAYOUT.length).map(toCard);

  return (
    <section aria-labelledby="work-heading" className="section bg-bg-alt">
      <div className="shell">
        <Reveal className="mb-14 flex flex-col justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <h2 id="work-heading" className="display-2 max-w-[14ch]">
            Selected work
          </h2>
          <Link href="/work" className="link-line text-lg font-bold">
            View work
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal
          as="ul"
          stagger={0.1}
          className="grid grid-cols-1 gap-6 md:grid-flow-dense md:grid-cols-6 md:grid-rows-[repeat(2,minmax(400px,auto))_auto] md:gap-5"
        >
          {featured.map((project, i) => (
            <ProjectPanel key={project.slug} project={project} variant={LAYOUT[i].variant} className={LAYOUT[i].className} priority={i === 0} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
