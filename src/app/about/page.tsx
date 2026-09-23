import type { Metadata } from "next";
import { profile } from "@/content/profile";
import { Capabilities } from "@/components/home/Capabilities";
import { ContactCTA } from "@/components/home/ContactCTA";
import { ExperienceList } from "@/components/home/ExperienceList";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Placeholder } from "@/components/ui/Rich";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SplitText } from "@/components/ui/SplitText";

export const metadata: Metadata = {
  title: "About",
  description: `${profile.name}: ${profile.positioning}`,
};

const workflow = [
  {
    step: "Set the scope",
    body: "I fix the screen I was pointed at. If a change should spread to other screens, I ask first, because announcing it afterwards isn't the same as asking.",
  },
  {
    step: "Let agents draft",
    body: "AI agents script Figma builds and sweeps through the Plugin API. They target nodes by label, not ID, and clone originals instead of moving them.",
  },
  {
    step: "Approve every change",
    body: "Nothing lands without review. It's the same human-in-the-loop promise I design into Agent-X, applied to my own workflow.",
  },
  {
    step: "Verify, don't assume",
    body: "Every build ends with an audit: token sources, contrast on the real background, text overflow, and diffs between variants.",
  },
];

const beliefs = [
  { t: "Honest numbers.", b: "When a landing draft invented social proof, it was replaced with real product commitments and footnoted figures. This site uses placeholders, not made-up metrics, for the same reason." },
  { t: "The shipped product beats the spec.", b: "A spec once said Plus Jakarta Sans while production ran Inter. Now I measure what's live before I design against it." },
  { t: "Depth before colour.", b: "When something looks lifeless, add planes and shadow. More colour usually adds noise." },
  { t: "Motion explains.", b: "Four verbs and one curve. If an animation doesn't show a change of state, it goes." },
];

export default function AboutPage() {
  return (
    <>
      <section className="container-page pt-28 md:pt-36">
        <Reveal as="p" y={10} className="text-overline text-fg-lo">
          About
        </Reveal>
        <div className="mt-6 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h1 className="text-display">
              <SplitText as="span" lang="vi" trigger="mount" text="Xin chào." className="block text-fg-lo" />
              <SplitText as="span" trigger="mount" delay={0.2} text={`I'm ${profile.shortName}.`} className="block" />
            </h1>
            <div className="text-body mt-10 max-w-[58ch] space-y-5 text-fg-mid">
              {profile.bio.map((p, i) => (
                <Reveal as="p" key={i} delay={0.3 + i * 0.08}>
                  {p}
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.5} className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/resume">Résumé</ButtonLink>
              <ButtonLink href="/contact" variant="secondary" arrow={false}>
                Get in touch
              </ButtonLink>
            </Reveal>
          </div>

          {/* Portrait slot: a monogram stands in until a photo is added. */}
          <Reveal as="figure" delay={0.2} className="lg:col-span-4 lg:col-start-9">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sheet border border-line bg-bg-raised">
              <p className="absolute left-6 top-6 text-sm">
                {profile.name}
                <span className="block text-fg-lo">
                  {profile.role} · {profile.location}
                </span>
              </p>
              {/* Monogram: the initial plus the one signal, same mark as the logo. */}
              <p
                aria-hidden="true"
                className="absolute -bottom-[0.14em] left-4 text-[clamp(11rem,22vw,19rem)] leading-none font-semibold tracking-[-0.08em] text-fg/15"
              >
                T<span className="text-signal">.</span>
              </p>
            </div>
            <figcaption className="mt-3 text-xs text-fg-lo">
              <Placeholder>Add portrait photo</Placeholder>
            </figcaption>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="workflow-title" className="container-page py-24 md:py-36">
        <SectionHeader
          titleId="workflow-title"
          eyebrow="How I work"
          title="I work with AI agents the way Agent-X asks shop owners to."
          intro="Agents draft, people approve. I use my own product's rule on my own process."
        />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-panel border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {workflow.map((w, i) => (
            <Reveal as="li" key={w.step} delay={i * 0.08} className="bg-bg p-6 md:p-8">
              <span className="text-overline tabular-nums text-fg-lo">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="text-title mt-6">{w.step}</h3>
              <p className="mt-3 text-fg-mid">{w.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section aria-labelledby="beliefs-title" className="px-2 md:px-4">
        <div className="surface-paper rounded-sheet bg-bg text-fg">
          <div className="container-page py-20 md:py-28">
            <SectionHeader titleId="beliefs-title" eyebrow="What I believe" title="Four opinions I'll defend in a review." />
            <dl className="mt-14 grid gap-x-12 md:grid-cols-2">
              {beliefs.map((b) => (
                <Reveal key={b.t} className="border-t border-line py-8">
                  <dt className="text-title">{b.t}</dt>
                  <dd className="mt-3 text-fg-mid">{b.b}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Capabilities />

      <section aria-labelledby="exp-title" className="container-page pb-24 md:pb-36">
        <SectionHeader titleId="exp-title" eyebrow="Experience" title="Where the work happened." />
        <div className="mt-14">
          <ExperienceList detailed />
        </div>
      </section>

      <ContactCTA />
    </>
  );
}
