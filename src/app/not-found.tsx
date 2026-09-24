import { ButtonLink } from "@/components/ui/Button";

/** Figma's own empty state, "Nothing selected", as the 404. */
export default function NotFound() {
  return (
    <section className="on-cobalt canvas-grid bg-cobalt text-snow">
      <div className="container-page flex min-h-[calc(100dvh-4rem)] flex-col items-start justify-center gap-8 py-20">
        <div className="relative w-full max-w-xl rounded-mark border-[3px] border-dashed border-sun/70 px-6 py-14 sm:px-10">
          <p className="label text-cream">Error 404</p>
          <h1 className="mt-3 font-display text-display text-snow">Nothing selected</h1>
          <p className="mt-4 max-w-[34ch] text-lead text-cream">This page doesn&apos;t exist, or it moved.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/" variant="sun" size="lg">
            Back home
          </ButtonLink>
          <ButtonLink href="/#work" variant="ghost" size="lg">
            View work
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
