import type { Metadata } from "next";
import { Suspense } from "react";
import { projects, toCard } from "@/content/projects";
import { WorkGrid, WorkGridSkeleton } from "@/components/work/WorkGrid";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies that show the problem before the pixels.",
};

export default function WorkPage() {
  const cards = projects.map(toCard);

  return (
    <>
      <header className="shell pb-12 pt-16 md:pb-16 md:pt-24">
        <h1 className="display-1">Work</h1>
        <p className="lede mt-6">Case studies that show the problem before the pixels. Filter by the kind of work you are hiring for.</p>
      </header>
      <Suspense fallback={<WorkGridSkeleton />}>
        <WorkGrid projects={cards} />
      </Suspense>
    </>
  );
}
