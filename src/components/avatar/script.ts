import { site } from "@/content/site";

/**
 * Everything the avatar says. A question always comes with answers so it is
 * never a dead end: links move the visitor forward, replies keep him talking.
 */
export interface Choice {
  id: string;
  label: string;
  /** Answer that navigates (in-page anchor or mailto) */
  href?: string;
  /** Answer that makes the avatar reply instead of navigating */
  reply?: string;
  /** data-avatar-target of an element to look at and highlight while replying */
  attention?: string;
}

export interface Script {
  greeting: string;
  question: { text: string; choices: readonly Choice[] };
}

export const AVATAR_TITLE = `${site.brandName}, a cartoon of the designer with messy black hair, black glasses, a white T-shirt and a blue backpack`;

/** Hovering or focusing anything marked data-contact-cue (and the Contact section itself) */
export const CONTACT_LINE = "I'm waiting for your information.";

/** Hero card: qualify the visitor, then route them */
export const HERO_SCRIPT: Script = {
  greeting: `Hi, I'm ${site.brandName}! Nice to meet you.`,
  question: {
    text: "What brings you here today?",
    choices: [
      { id: "hiring", label: "Hiring", href: "/#contact" },
      { id: "browsing", label: "Browsing", reply: "Then start with my work. It's right over there.", attention: "work" },
    ],
  },
};

/** Contact section: same greeting, the question closes the loop */
export const CONTACT_SCRIPT: Script = {
  greeting: `Hi, I'm ${site.brandName}! Nice to meet you.`,
  question: {
    text: "Shall we build something together?",
    choices: [
      { id: "email", label: "Yes, let's talk", href: `mailto:${site.email}` },
      { id: "later", label: "Maybe later", reply: "No rush. I'll be right here." },
    ],
  },
};
