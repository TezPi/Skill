import { playground } from "@/content/playground";
import { Plate } from "@/components/ui/Plate";
import { Reveal } from "@/components/motion/Reveal";
import { PlaygroundRail } from "./PlaygroundRail";

/** Visual craft outside the case studies. Hidden entirely when there is nothing to show. */
export function PlaygroundSection() {
  if (playground.length === 0) return null;

  return (
    <section id="playground" aria-labelledby="playground-title" className="scroll-mt-16 border-t border-line py-24 lg:py-32">
      <Reveal>
        <PlaygroundRail
          items={playground}
          header={
            <div>
              <Plate id="playground-title">Playground</Plate>
              <p className="mt-6 max-w-[44ch] text-lead text-fg-muted">
                Graphic and motion experiments that live outside the case studies.
              </p>
            </div>
          }
        />
      </Reveal>
    </section>
  );
}
