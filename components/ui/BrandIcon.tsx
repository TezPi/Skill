import * as icons from "simple-icons";

type SimpleIcon = { title: string; path: string };

/** Official brand marks from simple-icons, tinted with currentColor for both themes. */
export function BrandIcon({ name, className }: { name: string; className?: string }) {
  const icon = (icons as unknown as Record<string, SimpleIcon>)[name];
  if (!icon) return null;
  return (
    <svg role="img" viewBox="0 0 24 24" aria-label={icon.title} className={className} fill="currentColor">
      <path d={icon.path} />
    </svg>
  );
}
