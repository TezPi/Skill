import { cn } from "@/lib/cn";

/**
 * Brand "Tag pill": putty fill, sun dot, sun label.
 * Uses putty-deep (#5E5A51) instead of putty (#898478) so sun text passes AA (4.6:1).
 */
export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-2 rounded-full bg-putty-deep pr-3 pl-2.5 font-mono text-[0.8125rem] font-bold tracking-[0.06em] text-sun",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-sun" />
      {children}
    </span>
  );
}

export function TagList({ tags, className }: { tags: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Tag>{tag}</Tag>
        </li>
      ))}
    </ul>
  );
}
