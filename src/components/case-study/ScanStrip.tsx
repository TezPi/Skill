import type { Project } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { Rich } from "@/components/ui/Rich";

/** Scan mode: the whole story in 30 seconds, before the deep read. */
export function ScanStrip({ scan }: { scan: Project["scan"] }) {
  const cols = [
    { k: "Problem", v: scan.problem },
    { k: "Solution", v: scan.solution },
    { k: "Impact", v: scan.impact },
  ];
  return (
    <section aria-label="Summary" className="container-page py-16 md:py-24">
      <p className="text-overline mb-6 text-fg-lo">The 30-second version</p>
      <div className="grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-3">
        {cols.map((c, i) => (
          <Reveal key={c.k} delay={i * 0.08} className="bg-bg p-6 md:p-8">
            <h2 className="text-overline flex items-center gap-2 text-fg-lo">
              {c.k === "Impact" && <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />}
              {c.k}
            </h2>
            <p className="mt-4 text-fg">
              <Rich text={c.v} />
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
