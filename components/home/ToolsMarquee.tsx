import { tools } from "@/content/profile";
import { BrandIcon } from "@/components/ui/BrandIcon";
import { cn } from "@/lib/cn";

/** The one marquee on the page: breadth of stack, nothing that needs individual attention. */
export function ToolsMarquee() {
  return (
    <section aria-label="Tools I work with" className="marquee overflow-hidden border-y-[2.5px] border-fg py-10 md:py-14">
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} className={cn("flex shrink-0 items-center", copy === 1 && "marquee-dupe")}>
            {tools.map((tool) => (
              <li key={tool.name} className="flex items-center gap-4 px-7 text-4xl font-black tracking-tight md:gap-5 md:px-11 md:text-6xl">
                <BrandIcon name={tool.icon} className="size-9 shrink-0 md:size-12" />
                <span className="whitespace-nowrap">{tool.name}</span>
                <span aria-hidden="true" className="ml-7 size-3 shrink-0 rotate-45 bg-signal md:ml-11" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
