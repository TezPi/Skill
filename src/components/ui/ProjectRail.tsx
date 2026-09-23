import { cn } from "@/lib/cn";

const marks = ["top-4 left-4", "top-4 right-4", "bottom-4 left-4", "bottom-4 right-4"];

/**
 * Cobalt case-file rail from the Figma "Project Detail" frames: sun registration
 * marks, amber index chip, and the project name set vertically in Jersey 10.
 * Below `lg` it folds into a horizontal band so the name stays readable.
 */
export function ProjectRail({
  index,
  total,
  kicker,
  name,
  className,
}: {
  index: number;
  total: number;
  kicker: string;
  name: string;
  className?: string;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");
  // Fit the vertical name to the rail: ~0.47em per Jersey glyph
  const verticalSize = `min(7.5rem, ${28 / Math.max(name.length * 0.47, 1)}rem)`;

  return (
    <div className={cn("on-cobalt relative bg-cobalt text-snow", className)}>
      {marks.map((pos) => (
        <span key={pos} aria-hidden className={cn("absolute size-[13px] rounded-mark bg-sun", pos)} />
      ))}

      <div className="flex h-full flex-col gap-3 px-4 pt-11 pb-10 lg:pb-11">
        <span className="self-start rounded-mark bg-amber px-1.5 pt-0.5 font-display text-[1.25rem] leading-tight text-ink">
          {pad(index)}/{pad(total)}
        </span>
        <span className="label text-cream">{kicker}</span>

        <span aria-hidden className="mt-2 font-display text-[3.25rem] leading-[0.9] uppercase lg:hidden">
          {name}
        </span>
        <span
          aria-hidden
          className="hidden flex-1 items-center justify-center font-display leading-none uppercase lg:flex"
          style={{ fontSize: verticalSize }}
        >
          <span className="rotate-180 whitespace-nowrap [writing-mode:vertical-rl]">{name}</span>
        </span>
      </div>
    </div>
  );
}
