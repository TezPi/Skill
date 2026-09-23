import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="container-page flex min-h-[80svh] flex-col justify-center pt-28 pb-16">
      <p className="text-overline text-fg-lo">Error 404</p>
      <h1 className="text-mega mt-6">
        404<span className="text-signal">.</span>
      </h1>
      <p lang="vi" className="text-title mt-8">
        Trang này không tồn tại.
      </p>
      <p className="text-lead mt-2 text-fg-mid">This page doesn&apos;t exist. The link may be old or mistyped.</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/">Back home</ButtonLink>
        <ButtonLink href="/work" variant="secondary">
          View projects
        </ButtonLink>
      </div>
    </section>
  );
}
