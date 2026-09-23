import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="speed-lines pointer-events-none absolute inset-[-20%]" />
      <div className="shell relative grid min-h-[calc(100dvh-var(--nav-h))] content-center gap-10 py-20">
        <p className="misprint w-fit text-[clamp(8rem,28vw,22rem)] font-black leading-[0.8] tracking-[-0.06em]" data-text="404" aria-hidden="true">
          404
        </p>
        <div className="bubble max-w-xl p-7 md:p-9">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl">This page doesn&apos;t exist.</h1>
          <p className="lede mt-3">The link may be old, or the frame was renamed.</p>
          <div className="mt-8 flex flex-wrap gap-4 pb-1.5 pr-1.5">
            <Link href="/" className="btn">
              Back home
            </Link>
            <Link href="/work" className="btn btn-secondary">
              View work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
