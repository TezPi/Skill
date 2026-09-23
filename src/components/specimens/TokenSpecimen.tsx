const tokens = [
  { name: "accent/blue", role: "The action", swatch: "signal" },
  { name: "text/hi", role: "Primary text", swatch: "paper" },
  { name: "surface/rail", role: "Page plane", swatch: "raised" },
  { name: "state/running", role: "Live status", swatch: "dot" },
  { name: "text/success", role: "State as text", swatch: "ring" },
  { name: "radius/md", role: "10", swatch: "radius" },
] as const;

function Swatch({ kind }: { kind: (typeof tokens)[number]["swatch"] }) {
  switch (kind) {
    case "signal":
      return <span className="size-[1.4em] rounded-[0.35em] bg-signal" />;
    case "paper":
      return <span className="size-[1.4em] rounded-[0.35em] bg-paper" />;
    case "raised":
      return <span className="size-[1.4em] rounded-[0.35em] border border-line-strong bg-fg/10" />;
    case "dot":
      return <span className="mx-[0.45em] size-[0.5em] rounded-full bg-paper" />;
    case "ring":
      return <span className="size-[1.4em] rounded-full border-[0.14em] border-paper" />;
    case "radius":
      return <span className="size-[1.4em] rounded-tl-[0.7em] border-t-[0.14em] border-l-[0.14em] border-paper" />;
  }
}

/** Typographic token sheet + the control grammar row. One blue: the action. */
export function TokenSpecimen() {
  return (
    <div aria-hidden="true" className="@container absolute inset-0 flex flex-col bg-bg-raised [font-size:clamp(9px,2cqw,15px)]">
      <div className="grid flex-1 grid-cols-[1fr_1.35fr] gap-[2em] p-[2em]">
        <div className="flex flex-col justify-between">
          <p className="text-[0.8em] tracking-[0.14em] text-fg-lo uppercase">Agent-X · Console</p>
          <div>
            <p className="text-[5.6em] leading-[0.85] font-semibold tracking-[-0.05em] tabular-nums">344</p>
            <p className="mt-[0.6em] text-[1em] text-fg-mid">variables · 10 collections</p>
          </div>
        </div>
        <ul className="flex flex-col justify-center divide-y divide-line border-y border-line">
          {tokens.map((t) => (
            <li key={t.name} className="flex items-center gap-[0.9em] py-[0.55em]">
              <span className="grid w-[1.4em] place-items-center">
                <Swatch kind={t.swatch} />
              </span>
              <span className="text-[0.95em] font-medium">{t.name}</span>
              <span className="ml-auto text-[0.8em] text-fg-lo">{t.role}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex items-center justify-between gap-[1em] border-t border-line px-[2em] py-[1em] text-[0.75em] text-fg-lo">
        <span className="rounded-[0.8em] border border-line-strong px-[0.9em] py-[0.25em]">Pill · nav</span>
        <span className="flex items-center gap-[0.4em]">
          <span className="size-[1em] rounded-full border border-line-strong" /> Radio
        </span>
        <span className="flex items-center gap-[0.4em]">
          <span className="size-[1em] rounded-[0.25em] border border-line-strong" /> Check
        </span>
        <span className="rounded-[0.5em] bg-signal px-[0.9em] py-[0.35em] font-medium text-on-signal">Action</span>
        <span className="rounded-[0.35em] bg-paper px-[0.5em] py-[0.1em] font-medium text-ink tabular-nums">86%</span>
      </div>
    </div>
  );
}
