import type {
  BeforeAfterSection,
  CaseSection,
  DecisionsSection,
  FlowSection,
  InsightSection,
  ListSection,
  ReflectionSection,
  StatsSection,
  TableSection,
  TextSection,
} from "@/content/types";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Rich } from "@/components/ui/Rich";
import { SplitText } from "@/components/ui/SplitText";
import { ArrowRight } from "@/components/ui/icons";
import { MotionPlayground } from "./MotionPlayground";

/* Vietnamese strings get lang="vi" so screen readers switch voice. */
const VI = /[ăâđêôơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;
/** Only tag strings that are mostly Vietnamese; mixed English copy keeps the page language. */
const langOf = (s: string) => {
  const words = s.split(/\s+/);
  return words.filter((w) => VI.test(w)).length / words.length > 0.4 ? "vi" : undefined;
};

function Head({ s }: { s: CaseSection }) {
  return (
    <header className="mb-10 md:mb-14">
      <Reveal as="p" y={10} className="text-overline mb-4 text-fg-lo">
        {s.eyebrow}
      </Reveal>
      <SplitText as="h2" text={s.title} className="text-headline max-w-[20ch] text-balance" />
      {s.intro && (
        <Reveal as="p" delay={0.1} className="text-lead measure mt-5 text-fg-mid">
          {s.intro}
        </Reveal>
      )}
    </header>
  );
}

function Text({ s }: { s: TextSection }) {
  return (
    <>
      <div className="measure space-y-5">
        {s.body.map((p, i) => (
          <Reveal as="p" key={i} className="text-body text-fg-mid">
            <Rich text={p} />
          </Reveal>
        ))}
      </div>
      {s.aside && (
        <Reveal as="p" className="text-lead mt-10 max-w-[48ch] border-l-2 border-signal pl-6 text-fg">
          {s.aside}
        </Reveal>
      )}
    </>
  );
}

function Insight({ s }: { s: InsightSection }) {
  const steps = [
    { k: "Finding", v: s.finding, strong: false },
    { k: "Insight", v: s.insight, strong: true },
    { k: "Opportunity", v: s.opportunity, strong: false },
  ];
  return (
    <ol className="grid gap-3">
      {steps.map((st, i) => (
        <Reveal
          as="li"
          key={st.k}
          delay={i * 0.1}
          className={cn(
            "grid gap-3 rounded-panel border p-6 md:grid-cols-[9rem_1fr] md:gap-8 md:p-8",
            st.strong ? "border-line-strong bg-bg-raised" : "border-line",
          )}
        >
          <p className="text-overline flex items-center gap-2 pt-1 text-fg-lo">
            {st.strong && <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />}
            {st.k}
          </p>
          <p className={cn(st.strong ? "text-title" : "text-body text-fg-mid")}>{st.v}</p>
        </Reveal>
      ))}
    </ol>
  );
}

function BeforeAfter({ s }: { s: BeforeAfterSection }) {
  return (
    <div role="table" aria-label={s.title} className="border-b border-line">
      <div role="row" className="text-overline hidden grid-cols-2 gap-8 pb-4 text-fg-lo md:grid">
        <span role="columnheader">{s.beforeLabel}</span>
        <span role="columnheader" className="flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />
          {s.afterLabel}
        </span>
      </div>
      {s.rows.map((r, i) => (
        <Reveal key={i} className="border-t border-line py-6">
          <div role="row" className="grid gap-4 md:grid-cols-2 md:gap-8">
            <p role="cell" lang="vi" className="text-lg text-fg-lo">
              <span className="text-overline mb-1 block md:hidden">{s.beforeLabel}</span>
              {r.before}
            </p>
            <p role="cell" lang="vi" className="text-lg font-medium text-fg">
              <span className="text-overline mb-1 block text-fg-lo md:hidden">{s.afterLabel}</span>
              {r.after}
            </p>
          </div>
          {r.note && <p className="mt-3 text-sm font-light italic text-fg-lo">{r.note}</p>}
        </Reveal>
      ))}
    </div>
  );
}

function Decisions({ s }: { s: DecisionsSection }) {
  return (
    <ol className="space-y-4">
      {s.items.map((d, i) => (
        <Reveal as="li" key={d.title} className="rounded-panel border border-line p-6 md:p-8">
          <h3 className="text-title flex gap-4">
            <span className="tabular-nums text-fg-lo">{String(i + 1).padStart(2, "0")}</span>
            {d.title}
          </h3>
          <dl className="mt-6 grid gap-x-8 gap-y-4 text-body md:grid-cols-[7rem_1fr]">
            <dt className="text-overline pt-1.5 text-fg-lo">Problem</dt>
            <dd className="text-fg-mid">{d.problem}</dd>
            <dt className="text-overline pt-1.5 text-fg-lo">Decision</dt>
            <dd lang={langOf(d.decision)} className="text-fg">
              {d.decision}
            </dd>
            <dt className="text-overline pt-1.5 text-fg-lo">Why</dt>
            <dd className="text-fg-mid">{d.why}</dd>
          </dl>
        </Reveal>
      ))}
    </ol>
  );
}

function FlowCard({ f, delay = 0 }: { f: FlowSection["flows"][number]; delay?: number }) {
  return (
    <Reveal as="li" delay={delay} className="flex flex-col rounded-panel border border-line p-6">
      <p className="text-overline text-fg-lo">{f.meta}</p>
      <h3 className="text-title mt-2">{f.name}</h3>
      {f.steps && (
        <ol className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          {f.steps.map((st, k) => (
            <li key={st.label} className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-control border px-3 py-1.5",
                  st.flagged ? "border-signal text-fg" : "border-line text-fg-mid",
                )}
              >
                {st.label}
              </span>
              {k < f.steps!.length - 1 && <ArrowRight size={14} className="text-fg-lo" />}
            </li>
          ))}
        </ol>
      )}
      <span aria-hidden="true" className="min-h-6 flex-1" />
      <p className="flex gap-3 border-t border-line pt-4 text-sm">
        <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" />
        <span>
          <span className="font-medium text-fg">{f.flag}</span> <span className="text-fg-mid">{f.response}</span>
        </span>
      </p>
    </Reveal>
  );
}

/** Flows with mapped steps get the full width; the rest sit three across. */
function Flow({ s }: { s: FlowSection }) {
  const mapped = s.flows.filter((f) => f.steps);
  const rest = s.flows.filter((f) => !f.steps);
  return (
    <div className="space-y-4">
      {mapped.length > 0 && (
        <ol className="grid gap-4">
          {mapped.map((f) => (
            <FlowCard key={f.name} f={f} />
          ))}
        </ol>
      )}
      <ol className="grid gap-4 md:grid-cols-3">
        {rest.map((f, i) => (
          <FlowCard key={f.name} f={f} delay={i * 0.08} />
        ))}
      </ol>
    </div>
  );
}

function Table({ s }: { s: TableSection }) {
  return (
    <Reveal>
      <div className="overflow-x-auto rounded-panel border border-line" tabIndex={0} role="region" aria-label={s.title}>
        <table className={cn("w-full border-collapse text-left", s.columns.length > 2 && "min-w-[34rem]")}>
          {s.caption && <caption className="sr-only">{s.caption}</caption>}
          <thead>
            <tr className="text-overline text-fg-lo">
              {s.columns.map((c) => (
                <th key={c} scope="col" className="border-b border-line px-5 py-4 font-medium">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.rows.map((row, i) => (
              <tr key={i} className="align-top transition-colors hover:bg-fg/[0.03]">
                {row.map((cell, k) => (
                  <td
                    key={k}
                    lang={langOf(cell)}
                    className={cn("border-t border-line px-5 py-4", k === 0 ? "font-medium text-fg" : "text-fg-mid")}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {s.caption && (
        <p aria-hidden="true" className="measure mt-5 flex gap-3 text-sm text-fg-mid">
          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" />
          {s.caption}
        </p>
      )}
    </Reveal>
  );
}

function Stats({ s }: { s: StatsSection }) {
  return (
    <>
      <dl className="grid gap-px overflow-hidden rounded-panel border border-line bg-line sm:grid-cols-2 xl:grid-cols-4">
        {s.stats.map((st, i) => (
          <Reveal key={st.label} delay={i * 0.06} className="flex flex-col-reverse justify-end bg-bg p-6">
            <dt className="mt-3 text-sm text-fg-mid">
              {st.label}
              {st.note && <span className="mt-2 block text-xs text-fg-lo">{st.note}</span>}
            </dt>
            <dd className="text-[clamp(2.25rem,4vw,3.25rem)] leading-none font-semibold tracking-[-0.04em]">{st.value}</dd>
          </Reveal>
        ))}
      </dl>
      <Reveal as="p" className="measure mt-5 text-sm text-fg-lo">
        <Rich text={s.disclaimer} />
      </Reveal>
    </>
  );
}

function List({ s }: { s: ListSection }) {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {s.groups.map((g) => (
        <Reveal key={g.title}>
          <h3 className="text-overline mb-4 text-fg-lo">{g.title}</h3>
          <ul className="border-b border-line">
            {g.items.map((it) => (
              <li key={it} className="flex gap-3 border-t border-line py-3 text-fg-mid">
                <span aria-hidden="true" className="mt-[0.75em] h-px w-3 shrink-0 bg-fg-lo" />
                {it}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

function Reflection({ s }: { s: ReflectionSection }) {
  const cols = [
    { t: "What worked", items: s.worked },
    { t: "What I learned", items: s.learned },
    { t: "What's next", items: s.next },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {cols.map((c, i) => (
        <Reveal key={c.t} delay={i * 0.08} className="rounded-panel border border-line p-6">
          <h3 className="text-overline text-fg-lo">{c.t}</h3>
          <ul className="mt-4 space-y-4">
            {c.items.map((it) => (
              <li key={it} lang={langOf(it)} className="text-fg-mid">
                <Rich text={it} />
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

export function SectionRenderer({ section }: { section: CaseSection }) {
  const body = (() => {
    switch (section.kind) {
      case "text":
        return <Text s={section} />;
      case "insight":
        return <Insight s={section} />;
      case "beforeAfter":
        return <BeforeAfter s={section} />;
      case "decisions":
        return <Decisions s={section} />;
      case "flow":
        return <Flow s={section} />;
      case "table":
        return <Table s={section} />;
      case "stats":
        return <Stats s={section} />;
      case "list":
        return <List s={section} />;
      case "playground":
        return <MotionPlayground />;
      case "reflection":
        return <Reflection s={section} />;
    }
  })();

  return (
    <section id={section.id} aria-label={section.nav} className="scroll-mt-28 border-t border-line py-16 md:py-24">
      <Head s={section} />
      {body}
    </section>
  );
}
