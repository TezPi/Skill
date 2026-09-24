import type { MediaSlot } from "@/content/types";
import { cn } from "@/lib/cn";
import { ImageSlot } from "@/components/ui/ImageSlot";

export function MediaBlock({ slot, caption, width = "wide" }: { slot: MediaSlot; caption?: string; width?: "text" | "wide" }) {
  return (
    <figure className={cn(width === "text" && "max-w-[65ch]")}>
      <ImageSlot slot={slot} sizes="(min-width: 1024px) 70vw, 100vw" className="rounded-card ring-1 ring-line" />
      {caption ? <figcaption className="mt-3 max-w-[65ch] font-mono text-[0.8125rem] leading-relaxed text-fg-muted">{caption}</figcaption> : null}
    </figure>
  );
}

export function BeforeAfterBlock({
  before,
  after,
  change,
  evidence,
}: {
  before: MediaSlot;
  after: MediaSlot;
  change: string;
  evidence: string;
}) {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <figure>
          <span className="inline-block rounded-mark bg-putty-deep px-2 pt-1 pb-0.5 font-display text-[1.125rem] leading-tight text-cream">Before</span>
          <ImageSlot slot={before} sizes="(min-width: 768px) 35vw, 100vw" className="mt-3 rounded-card ring-1 ring-line" />
        </figure>
        <figure>
          <span className="inline-block rounded-mark bg-cobalt px-2 pt-1 pb-0.5 font-display text-[1.125rem] leading-tight text-snow">After</span>
          <ImageSlot slot={after} sizes="(min-width: 768px) 35vw, 100vw" className="mt-3 rounded-card ring-1 ring-line" />
        </figure>
      </div>
      <dl className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <dt className="label text-fg-muted">What changed</dt>
          <dd className="mt-2 font-mono text-read text-fg">{change}</dd>
        </div>
        <div>
          <dt className="label text-fg-muted">Evidence</dt>
          <dd className="mt-2 font-mono text-read text-fg">{evidence}</dd>
        </div>
      </dl>
    </div>
  );
}

/** Explored directions. The chosen one stays "selected", so the decision reads at a glance. */
export function OptionsBlock({ items }: { items: { title: string; body: string; media: MediaSlot; chosen?: boolean }[] }) {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <li key={item.title} className={cn(!item.chosen && "md:mt-8")}>
          <div className={cn("relative rounded-card", item.chosen && "ring-2 ring-select")}>
            {item.chosen
              ? ["-top-[5px] -left-[5px]", "-top-[5px] -right-[5px]", "-bottom-[5px] -right-[5px]", "-bottom-[5px] -left-[5px]"].map((pos) => (
                  <span key={pos} aria-hidden className={cn("absolute z-[1] size-[11px] rounded-mark border-2 border-select bg-sun", pos)} />
                ))
              : null}
            <ImageSlot slot={item.media} sizes="(min-width: 768px) 30vw, 100vw" className={cn("rounded-card", !item.chosen && "opacity-80")} />
          </div>
          <p className="mt-4 flex items-center gap-3">
            <span className="font-display text-heading text-fg">{item.title}</span>
            {item.chosen ? (
              <span className="rounded-mark bg-amber px-1.5 pt-0.5 font-display text-[1.125rem] leading-tight text-ink">Chosen</span>
            ) : null}
          </p>
          <p className="mt-1 font-mono text-read text-fg-muted">{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

/** First feature gets the big frame; the rest share a row. Importance sets the size. */
export function FeaturesBlock({
  items,
}: {
  items: { title: string; problem: string; solution: string; benefit: string; media: MediaSlot }[];
}) {
  const [lead, ...rest] = items;
  return (
    <div className="flex flex-col gap-16">
      {lead ? <Feature item={lead} large /> : null}
      {rest.length ? (
        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {rest.map((item) => (
            <Feature key={item.title} item={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Feature({
  item,
  large,
}: {
  item: { title: string; problem: string; solution: string; benefit: string; media: MediaSlot };
  large?: boolean;
}) {
  const steps = [
    { label: "Problem", text: item.problem },
    { label: "Solution", text: item.solution },
    { label: "Benefit", text: item.benefit },
  ];
  return (
    <article>
      <ImageSlot slot={item.media} sizes={large ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 768px) 35vw, 100vw"} className="rounded-card ring-1 ring-line" />
      <h3 className="mt-6 font-display text-heading text-fg">{item.title}</h3>
      <dl className={cn("mt-4 grid gap-5", large && "md:grid-cols-3")}>
        {steps.map((step) => (
          <div key={step.label}>
            <dt className="label text-fg-muted">{step.label}</dt>
            <dd className="mt-1.5 font-mono text-read text-fg">{step.text}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
