import { cn } from "@/lib/cn";

/** Brand "Marker highlight". Reserved for the one thing on a surface that must be seen first. */
export function Highlight({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <mark className={cn("rounded-mark bg-amber px-1 text-ink [box-decoration-break:clone]", className)}>{children}</mark>
  );
}
