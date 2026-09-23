import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";
import { SplitText } from "./SplitText";

export function SectionHeader({
  eyebrow,
  title,
  intro,
  className,
  titleId,
  action,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  className?: string;
  titleId?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className={cn("grid gap-6 lg:grid-cols-12 lg:items-end", className)}>
      <div className="lg:col-span-8">
        <Reveal as="p" y={10} className="text-overline mb-5 flex items-center gap-3 text-fg-lo">
          <span aria-hidden="true" className="h-px w-8 bg-current" />
          {eyebrow}
        </Reveal>
        <SplitText as="h2" id={titleId} text={title} className="text-headline text-balance" />
        {intro && (
          <Reveal as="p" delay={0.15} className="text-lead measure mt-5 text-fg-mid">
            {intro}
          </Reveal>
        )}
      </div>
      {action && <div className="lg:col-span-4 lg:justify-self-end">{action}</div>}
    </header>
  );
}
