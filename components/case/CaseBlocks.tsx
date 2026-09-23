import { ArrowRight } from "@phosphor-icons/react/ssr";
import type { Block } from "@/content/projects";
import { SlotText } from "@/components/ui/SlotText";

function Tokens() {
  const colors = [
    { name: "color/paper", hex: "#DCDCDC", className: "bg-paper" },
    { name: "color/signal", hex: "#2D5FFF", className: "bg-signal" },
    { name: "color/ink", hex: "#161616", className: "bg-ink" },
  ];
  const type = [
    { label: "Display", spec: "900, -0.045em", className: "text-5xl font-black tracking-[-0.045em]" },
    { label: "Heading", spec: "800, -0.035em", className: "text-3xl font-extrabold tracking-[-0.035em]" },
    { label: "Body", spec: "400, 1.65 line height", className: "text-lg" },
  ];

  return (
    <div className="grid gap-[2.5px] border-[2.5px] border-fg bg-fg md:grid-cols-2">
      <div className="bg-bg p-6">
        <p className="mb-4 text-sm font-bold">Color</p>
        <ul className="flex flex-col gap-3">
          {colors.map((color) => (
            <li key={color.hex} className="flex items-center gap-3">
              <span aria-hidden="true" className={`size-9 border-2 border-fg ${color.className}`} />
              <span className="font-semibold">{color.name}</span>
              <span className="ml-auto text-sm text-muted">{color.hex}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-bg p-6">
        <p className="mb-4 text-sm font-bold">Type, Be Vietnam Pro</p>
        <ul className="flex flex-col gap-3">
          {type.map((item) => (
            <li key={item.label} className="flex items-baseline justify-between gap-4">
              <span className={item.className}>{item.label}</span>
              <span className="text-sm text-muted">{item.spec}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-bg p-6">
        <p className="mb-4 text-sm font-bold">Radius and shadow</p>
        <div className="flex items-center gap-6">
          <span aria-hidden="true" className="size-14 border-[2.5px] border-fg bg-bg shadow-[5px_5px_0_var(--signal)]" />
          <p className="text-sm text-muted">Radius 0. Hard 5px offset in Signal. No blur, no glow.</p>
        </div>
      </div>
      <div className="bg-bg p-6">
        <p className="mb-4 text-sm font-bold">Motion</p>
        <p className="text-sm text-muted">
          UI: <code className="font-semibold text-fg">cubic-bezier(0.16, 1, 0.3, 1)</code>
          <br />
          Comic pops: <code className="font-semibold text-fg">back.out(1.7)</code>
          <br />
          Only transform and opacity animate.
        </p>
      </div>
    </div>
  );
}

export function CaseBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "text":
      return (
        <p className="text-lg leading-[1.75] text-muted">
          <SlotText text={block.body} />
        </p>
      );

    case "insight":
      return (
        <figure className="border-[2.5px] border-fg bg-fg p-6 text-on-fg shadow-[6px_6px_0_var(--signal)] md:p-8">
          <figcaption className="text-sm font-bold opacity-80">{block.label}</figcaption>
          <p className="mt-3 text-2xl font-extrabold leading-snug tracking-tight md:text-3xl">
            <SlotText text={block.body} />
          </p>
        </figure>
      );

    case "flow":
      return (
        <div>
          {block.label ? <p className="mb-4 text-sm font-bold">{block.label}</p> : null}
          <ol className="flex flex-wrap items-center gap-3">
            {block.steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span className={`tag h-10 px-4 text-[0.9375rem] ${i === block.steps.length - 1 ? "bg-fg text-on-fg" : "bg-bg"}`}>{step}</span>
                {i < block.steps.length - 1 ? <ArrowRight size={18} weight="bold" aria-hidden="true" className="text-signal" /> : null}
              </li>
            ))}
          </ol>
        </div>
      );

    case "pairs":
      return (
        <dl className="grid gap-[2.5px] border-[2.5px] border-fg bg-fg md:grid-cols-2 md:[&>div:last-child:nth-child(odd)]:col-span-2">
          {block.items.map((item) => (
            <div key={item.term} className="bg-bg p-6">
              <dt className="text-xl font-extrabold tracking-tight">{item.term}</dt>
              <dd className="mt-2 leading-relaxed text-muted">
                <SlotText text={item.detail} />
              </dd>
            </div>
          ))}
        </dl>
      );

    case "compare":
      return (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="border-[2.5px] border-dashed border-fg p-6">
            <p className="text-sm font-bold text-muted">Before</p>
            <p className="mt-2 text-lg leading-relaxed">
              <SlotText text={block.before} />
            </p>
          </div>
          <div className="border-[2.5px] border-fg bg-bg p-6 shadow-[6px_6px_0_var(--signal)]">
            <p className="text-sm font-bold">After</p>
            <p className="mt-2 text-lg leading-relaxed">
              <SlotText text={block.after} />
            </p>
          </div>
        </div>
      );

    case "tokens":
      return <Tokens />;

    case "metrics":
      return (
        <div>
          <p className="mb-4 text-sm font-bold">{block.note}</p>
          <dl className="grid grid-cols-1 gap-[2.5px] border-[2.5px] border-fg bg-fg sm:grid-cols-2 sm:[&>div:last-child:nth-child(odd)]:col-span-2">
            {block.items.map((item) => (
              <div key={item.label} className="flex flex-col gap-3 bg-bg p-6">
                <dt className="text-sm font-semibold text-muted">{item.label}</dt>
                <dd className="text-2xl font-extrabold tracking-tight">
                  <SlotText text={item.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      );

    case "list":
      return (
        <ul className="flex flex-col gap-4">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-lg leading-relaxed text-muted">
              <span aria-hidden="true" className="mt-[0.6em] size-2.5 shrink-0 rotate-45 bg-signal" />
              <span>
                <SlotText text={item} />
              </span>
            </li>
          ))}
        </ul>
      );
  }
}
