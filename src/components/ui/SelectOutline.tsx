import { cn } from "@/lib/cn";

const handles = ["-top-[5px] -left-[5px]", "-top-[5px] -right-[5px]", "-bottom-[5px] -right-[5px]", "-bottom-[5px] -left-[5px]"];

/**
 * Hover/focus affordance for project frames: the tile gets "selected" the way a
 * frame does in Figma. Place inside a `group` element; keyboard focus on any link
 * inside the group shows the same state, so mouse and keyboard users get identical feedback.
 */
export function SelectOutline({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-[2] rounded-[inherit] opacity-0 ring-2 ring-select",
        "transition-opacity duration-200 ease-out-expo group-hover:opacity-100 group-has-[a:focus-visible]:opacity-100",
        className,
      )}
    >
      {handles.map((pos) => (
        <span key={pos} className={cn("absolute size-[11px] rounded-mark border-2 border-select bg-sun", pos)} />
      ))}
    </span>
  );
}
