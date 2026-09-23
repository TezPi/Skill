export const nav = [
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Résumé", href: "/resume" },
  { label: "Contact", href: "/contact" },
] as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
