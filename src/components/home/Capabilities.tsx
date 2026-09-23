import { capabilities, tools } from "@/content/profile";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="container-page py-24 md:py-36">
      <SectionHeader
        titleId="capabilities-title"
        eyebrow="What I do"
        title="Where I'm most useful on a team."
      />
      <ol className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
        {capabilities.map((c, i) => (
          <Reveal as="li" key={c.title} delay={i * 0.08} className="group relative flex flex-col bg-bg p-6 md:p-8">
            {/* Draw verb: a signal rule draws across on hover to guide the eye. */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-signal transition-transform duration-700 ease-expo group-hover:scale-x-100"
            />
            <span className="text-overline tabular-nums text-fg-lo">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="text-title mt-8">{c.title}</h3>
            <p className="mt-3 text-fg-mid">{c.summary}</p>
            <ul className="mt-auto space-y-2 pt-8 text-sm">
              {c.evidence.map((e) => (
                <li key={e} className="flex gap-3 border-t border-line pt-2 text-fg-mid">
                  <span aria-hidden="true" className="text-fg-lo">↳</span>
                  {e}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
      <Reveal as="p" className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-mid">
        <span className="text-overline text-fg-lo">Tools</span>
        {tools.map((t, i) => (
          <span key={t} className="inline-flex items-center gap-4">
            {t}
            {i < tools.length - 1 && <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />}
          </span>
        ))}
      </Reveal>
    </section>
  );
}
