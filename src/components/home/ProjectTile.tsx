import Link from "next/link";
import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/content/types";
import { cn } from "@/lib/cn";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SelectOutline } from "@/components/ui/SelectOutline";
import { TagList } from "@/components/ui/Tag";

/**
 * Personal project as a Figma frame: frame name above, cover inside, details
 * below (labels outside the image, gallery style). Hover or keyboard focus
 * "selects" the frame.
 */
export function ProjectTile({
  project,
  index,
  className,
  coverClassName,
}: {
  project: Project;
  index: number;
  className?: string;
  coverClassName?: string;
}) {
  return (
    <article className={cn("group relative", className)}>
      <p className="label flex justify-between text-fg-muted">
        <span>Personal / {String(index).padStart(2, "0")}</span>
        <span>{project.year}</span>
      </p>

      <div className="relative mt-2.5 rounded-card">
        <SelectOutline />
        <div className="overflow-hidden rounded-card">
          <ImageSlot
            slot={project.cover}
            sizes="(min-width: 768px) 50vw, 100vw"
            className={cn("transition-transform duration-700 ease-out-expo group-hover:scale-[1.025]", coverClassName)}
          />
        </div>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h4 className="font-display text-heading text-fg">
            <Link href={`/work/${project.slug}`} data-cursor="Open project" className="after:absolute after:inset-0 after:z-[3] focus-visible:outline-none">
              {project.title}
            </Link>
          </h4>
          <p className="mt-1 text-body text-fg-muted">{project.tagline}</p>
        </div>
        <span
          aria-hidden
          className="mt-1 grid size-10 shrink-0 place-items-center rounded-control bg-cobalt text-snow shadow-hard transition-[transform,box-shadow] duration-150 ease-snap group-hover:-translate-x-px group-hover:-translate-y-px group-hover:shadow-hard-hover"
        >
          <ArrowUpRightIcon size={18} weight="bold" />
        </span>
      </div>
      <TagList tags={project.tags} className="mt-4" />
    </article>
  );
}
