/** Client-safe project taxonomy. Keep case study content out of this file. */

export type CategoryId = "ai" | "system" | "interaction" | "web" | "mobile";

export const categories: { id: "all" | CategoryId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "ai", label: "AI product" },
  { id: "system", label: "Design system" },
  { id: "interaction", label: "Interaction" },
  { id: "web", label: "Web" },
  { id: "mobile", label: "Mobile" },
];

/** Protected case studies live on a dynamic route so the server can read the unlock cookie. */
export const projectHref = (project: { slug: string; protected?: boolean }) =>
  project.protected ? `/work/private/${project.slug}` : `/work/${project.slug}`;
