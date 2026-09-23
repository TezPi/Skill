import type { Metadata } from "next";
import { WorkGrid } from "@/components/work/WorkGrid";
import { Reveal } from "@/components/ui/Reveal";
import { SplitText } from "@/components/ui/SplitText";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies in AI product UX, design systems and motion.",
};

const more = [
  {
    title: "XRetention landing v3 · Console",
    note: "A night-shift timeline: 22:47 the problem → 03:12 the AI drafts → 06:58 you approve → 09:41 the message lands.",
  },
  { title: "XRetention landing v4 · Editorial", note: "Pill section labels and an asymmetric bento row." },
  { title: "XOmnichannel landing · Liquid", note: "Glass nav, gradient clip-text headline, a 10-channel grid." },
];

export default function WorkPage() {
  return (
    <div className="container-page pt-28 pb-24 md:pt-36 md:pb-36">
      <Reveal as="p" y={10} className="text-overline text-fg-lo">
        Work · {new Date().getFullYear()}
      </Reveal>
      <SplitText as="h1" trigger="mount" text="Case studies that show the reasoning." className="text-display mt-6 max-w-[16ch]" />
      <Reveal as="p" delay={0.3} className="text-lead measure mt-6 text-fg-mid">
        Each one starts with the problem and ends with what I&apos;d do next. Scan the 30-second summary at the top, or
        read the whole thing.
      </Reveal>

      <div className="mt-14 md:mt-20">
        <WorkGrid />
      </div>

      <section aria-labelledby="more-title" className="mt-28 border-t border-line pt-10">
        <h2 id="more-title" className="text-overline text-fg-lo">
          Also in the file · walkthroughs on request
        </h2>
        <ul className="mt-6 divide-y divide-line border-b border-line">
          {more.map((m) => (
            <li key={m.title} className="grid gap-2 py-5 md:grid-cols-12 md:gap-8">
              <p className="font-medium md:col-span-4">{m.title}</p>
              <p className="text-fg-mid md:col-span-8">{m.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
