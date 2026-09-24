import { cn } from "@/lib/cn";

type Level = "h1" | "h2" | "h3";

/**
 * Brand section plate ("About Me", "Design System" boards):
 * cobalt panel, snow pixel type, four 8px screw dots.
 * `bleed` extends a cobalt tab to the viewport edge, as in the Figma About board.
 */
export function Plate({
  as: Tag = "h2",
  children,
  bleed,
  id,
  className,
}: {
  as?: Level;
  children: React.ReactNode;
  bleed?: "left" | "right";
  id?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative inline-flex", className)}>
      {bleed ? (
        <span
          aria-hidden
          className={cn(
            "absolute top-[28%] bottom-[28%] w-screen bg-cobalt",
            bleed === "right" ? "left-full" : "right-full",
          )}
        />
      ) : null}
      <Tag
        id={id}
        className="relative rounded-control bg-cobalt px-5 pt-2.5 pb-1.5 font-display text-title text-snow sm:px-7 sm:pt-3 sm:pb-2"
      >
        {children}
        {(["top-2 left-2", "top-2 right-2", "bottom-2 left-2", "bottom-2 right-2"] as const).map((pos) => (
          <span key={pos} aria-hidden className={cn("absolute size-2 rounded-full bg-snow", pos)} />
        ))}
      </Tag>
    </div>
  );
}
