import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Brand lockup "Thịnh - UIUX Designer" on the snow badge from the Figma logo.
 * Set in Iosevka Charon Mono Bold because Jersey 10 cannot render "ị".
 * Size it with font-size on `className`; everything else scales in em.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-[0.45em] rounded-control bg-snow px-[0.6em] pt-[0.42em] pb-[0.36em] font-mono leading-none font-bold whitespace-nowrap text-cobalt",
        className,
      )}
    >
      <span>{site.brandName}</span>
      <span className="text-cobalt/45">-</span>
      <span className="tracking-[0.02em]">{site.brandRole}</span>
    </span>
  );
}
