import { site } from "@/content/site";

/**
 * Recruiter fast-scan: current role, history, focus, location. Visible at the fold on desktop.
 * Bottom padding reserves the floating toolbar zone so the toolbar never covers these facts.
 */
export function GlanceStrip() {
  return (
    <section aria-label="At a glance" className="on-cobalt bg-cobalt text-snow">
      <div className="container-page">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 border-t border-snow/20 pt-8 pb-[5.5rem] lg:grid-cols-4">
          {site.glance.map((item) => (
            <div key={item.label}>
              <dt className="label text-cream">{item.label}</dt>
              <dd className="mt-2 text-lead text-snow">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
