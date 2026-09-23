import type { ExternalLink, MetaItem, TimelineItem } from "./types";

/**
 * Personal profile. Values come from the Figma "About Me" board.
 * Empty strings are treated as "not set" and hide their UI.
 */
export const site = {
  brand: "TezPi Studio",
  /** Full name with diacritics: rendered in Iosevka Charon Mono (Jersey 10 has no Vietnamese glyphs) */
  name: "Hồ Phú Thịnh",
  /** Latin form for Jersey 10 display type */
  nameLatin: "Ho Phu Thinh",
  handle: "HoPhuThinh",
  role: "UI/UX Designer",
  intro: "I design clear product interfaces, then sharpen them with brand and motion craft.",
  url: "https://tezpi.studio",

  email: "hophuthinh0609@gmail.com",
  phone: "+84 378 721 294",
  phoneHref: "+84378721294",
  location: "District 1, Ho Chi Minh City",

  /** e.g. "/resume.pdf" (put the file in /public). Empty = Resume links jump to Experience. */
  resumeUrl: "",
  /** Portrait for the lanyard badge, e.g. "/images/portrait.jpg". Empty = monogram fallback. */
  portrait: "",

  disciplines: ["UIUX Design", "Graphic Design", "Motion Art"],

  socials: [
    { label: "Behance", url: "" },
    { label: "Dribbble", url: "" },
    { label: "LinkedIn", url: "" },
    { label: "Instagram", url: "" },
  ] satisfies ExternalLink[],

  /** Recruiter fast-scan strip under the hero */
  glance: [
    { label: "Now", value: "UI Design Intern, FPT IS" },
    { label: "Before", value: "MindX Technology, Rêu Garden" },
    { label: "Focus", value: "Product UI, Brand, Motion" },
    { label: "Based in", value: "Ho Chi Minh City" },
  ] satisfies MetaItem[],

  bio: [
    "I'm a UI/UX designer in Ho Chi Minh City, currently designing internal banking interfaces as a UI design intern at FPT IS.",
    "Before that I worked on the Murror AI mobile app at MindX Technology and on brand and banner design at Rêu Garden. A background in web development and business administration helps me design things teams can build and businesses can use.",
  ],

  experience: [
    {
      org: "FPT IS",
      period: "Aug 2026",
      type: "Internship",
      title: "UI Design",
      detail: "Internal banking interface design",
      current: true,
    },
    {
      org: "MindX Technology",
      period: "Feb 2026",
      type: "Apprenticeship",
      title: "Mobile App",
      detail: "Murror AI",
    },
    {
      org: "Rêu Garden",
      period: "Jun 2023",
      type: "Apprenticeship",
      title: "Graphic Design",
      detail: "Brand design, banners",
    },
    {
      org: "FPT Polytechnic",
      period: "May 2021",
      type: "Apprenticeship",
      title: "Social Marketing",
      detail: "PSYCHO Studio",
    },
  ] satisfies TimelineItem[],

  education: [
    { org: "MindX Technology School", period: "Feb 2026", type: "Apprenticeship", title: "UI/UX Designer" },
    { org: "Arena Multimedia", period: "Jul 2024", type: "Apprenticeship", title: "Web Developer" },
    { org: "FPT Polytechnic College", period: "May 2021", type: "Apprenticeship", title: "Business Administrator" },
  ] satisfies TimelineItem[],
} as const;

export const nav = [
  { id: "work", label: "Work", href: "/#work" },
  { id: "about", label: "About", href: "/#about" },
  { id: "playground", label: "Playground", href: "/#playground" },
] as const;

export const resumeLink = site.resumeUrl
  ? { href: site.resumeUrl, external: true }
  : { href: "/#experience", external: false };
