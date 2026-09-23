import { ArrowRightIcon, CheckIcon } from "@phosphor-icons/react/dist/ssr";
import type { CaseBlock } from "@/content/types";
import { cn } from "@/lib/cn";
import { TagList } from "@/components/ui/Tag";
import { BeforeAfterBlock, FeaturesBlock, MediaBlock, OptionsBlock } from "./MediaBlocks";

export function CaseBlockView({ block }: { block: CaseBlock }) {
  switch (block.type) {
    case "text":
      return (
        <div className="flex max-w-[65ch] flex-col gap-5 font-mono text-read text-fg">
          {block.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      );
    case "glance":
      return <GlanceBlock items={block.items} />;
    case "statement":
      return (
        <figure className="max-w-[40ch] border-l-4 border-sun pl-6">
          <figcaption className="label text-fg-muted">{block.label}</figcaption>
          <blockquote className="mt-3 font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] text-fg">{block.text}</blockquote>
        </figure>
      );
    case "chips":
      return (
        <div>
          <p className="label text-fg-muted">{block.label}</p>
          <TagList tags={block.items} className="mt-3" />
        </div>
      );
    case "insights":
      return <InsightsBlock rows={block.rows} />;
    case "media":
      return <MediaBlock slot={block.slot} caption={block.caption} width={block.width} />;
    case "beforeAfter":
      return <BeforeAfterBlock {...block} />;
    case "options":
      return <OptionsBlock items={block.items} />;
    case "features":
      return <FeaturesBlock items={block.items} />;
    case "metrics":
      return <MetricsBlock items={block.items} qualitative={block.qualitative} />;
    case "swatches":
      return <SwatchesBlock colors={block.colors} typefaces={block.type_} />;
    case "reflection":
      return <ReflectionBlock worked={block.worked} change={block.change} />;
  }
}

/** Scan-mode summary. One cobalt cell anchors the eye on the problem. */
function GlanceBlock({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map((item, i) => (
        <div
          key={item.label}
          className={cn(
            "rounded-card p-6",
            i === 0 ? "on-cobalt bg-cobalt text-snow" : "bg-surface-raised ring-1 ring-line",
          )}
        >
          <dt className={cn("label", i === 0 ? "text-cream" : "text-fg-muted")}>{item.label}</dt>
          <dd className={cn("mt-3 text-lead", i === 0 ? "text-snow" : "text-fg")}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Observation -> insight -> opportunity, read left to right */
function InsightsBlock({ rows }: { rows: { finding: string; insight: string; opportunity: string }[] }) {
  const cols = [
    { key: "finding", label: "Finding" },
    { key: "insight", label: "Insight" },
    { key: "opportunity", label: "Opportunity" },
  ] as const;

  return (
    <ol className="flex flex-col gap-3">
      {rows.map((row, i) => (
        <li key={i} className="grid gap-5 rounded-card bg-surface-raised p-6 ring-1 ring-line md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-start md:gap-4">
          {cols.map((col, c) => (
            <div key={col.key} className="contents">
              <div>
                <p className={cn("label", c === 2 ? "text-accent-fg" : "text-fg-muted")}>{col.label}</p>
                <p className="mt-2 text-body text-fg">{row[col.key]}</p>
              </div>
              {c < 2 ? (
                <ArrowRightIcon size={18} weight="bold" aria-hidden className="hidden text-fg-muted md:mt-6 md:block" />
              ) : null}
            </div>
          ))}
        </li>
      ))}
    </ol>
  );
}

function MetricsBlock({ items, qualitative }: { items: { value: string; label: string }[]; qualitative?: string[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <ul className="grid gap-3 sm:grid-cols-2 lg:col-span-3">
        {items.map((item, i) => (
          <li key={i} className="rounded-card bg-surface-raised p-6 ring-1 ring-line">
            <p className="font-display text-title text-accent-fg">{item.value}</p>
            <p className="mt-2 text-body text-fg-muted">{item.label}</p>
          </li>
        ))}
      </ul>
      {qualitative?.length ? (
        <div className="lg:col-span-2">
          <p className="label text-fg-muted">Qualitative outcomes</p>
          <ul className="mt-4 flex flex-col gap-3">
            {qualitative.map((q) => (
              <li key={q} className="flex gap-3 font-mono text-read text-fg">
                <CheckIcon size={18} weight="bold" aria-hidden className="mt-1 shrink-0 text-accent-fg" />
                {q}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function SwatchesBlock({ colors, typefaces }: { colors: { name: string; hex: string }[]; typefaces: string[] }) {
  return (
    <div className="grid gap-10 lg:grid-cols-5">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:col-span-3">
        {colors.map((c) => (
          <li key={c.name}>
            <span aria-hidden className="block aspect-square rounded-card ring-1 ring-line" style={{ backgroundColor: c.hex }} />
            <p className="mt-2 font-mono text-nav font-bold text-fg">{c.name}</p>
            <p className="font-mono text-label text-fg-muted">{c.hex}</p>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-3 lg:col-span-2">
        {typefaces.map((t) => (
          <li key={t} className="rounded-card bg-surface-raised p-5 ring-1 ring-line">
            <p className="font-display text-[3rem] leading-none text-fg">Aa</p>
            <p className="mt-2 font-mono text-nav font-bold text-fg-muted">{t}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReflectionBlock({ worked, change }: { worked: string[]; change: string[] }) {
  const groups = [
    { title: "What worked", items: worked },
    { title: "What I'd change", items: change },
  ];
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="font-display text-heading text-fg">{group.title}</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {group.items.map((item) => (
              <li key={item} className="flex gap-3 font-mono text-read text-fg">
                <span aria-hidden className="mt-2 size-2 shrink-0 rounded-mark bg-sun" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
