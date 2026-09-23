/** Shared by the form hook (client) and the route handler (server). */

export const TOPICS = ["Full-time role", "Freelance project", "Something else"] as const;
export type Topic = (typeof TOPICS)[number];

export type ContactPayload = {
  name: string;
  email: string;
  topic: Topic;
  message: string;
  company?: string; // honeypot — real people never see or fill it
};

export type ContactErrors = Partial<Record<"name" | "email" | "topic" | "message", string>>;

export const LIMITS = { nameMax: 80, messageMin: 20, messageMax: 2000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Error copy says what to do next, not just what's wrong. */
export function validateContact(input: Partial<ContactPayload>): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name?.trim() ?? "";
  const email = input.email?.trim() ?? "";
  const message = input.message?.trim() ?? "";

  if (!name) errors.name = "Add your name so I know who I'm replying to.";
  else if (name.length > LIMITS.nameMax) errors.name = `Keep it under ${LIMITS.nameMax} characters.`;

  if (!email) errors.email = "Add your email. It's the only way I can reply.";
  else if (!EMAIL.test(email)) errors.email = "That email looks incomplete. Check the part after the @.";

  if (!input.topic || !TOPICS.includes(input.topic)) errors.topic = "Pick what this is about.";

  if (message.length < LIMITS.messageMin)
    errors.message = `A little more detail, please. At least ${LIMITS.messageMin} characters.`;
  else if (message.length > LIMITS.messageMax)
    errors.message = `That's over ${LIMITS.messageMax} characters. Email me directly for longer notes.`;

  return errors;
}

export function buildMailto(to: string, p: Partial<ContactPayload>) {
  const subject = `${p.topic ?? "Hello"} from ${p.name?.trim() || "your portfolio"}`;
  const body = `${p.message?.trim() ?? ""}\n\n${p.name?.trim() ?? ""}${p.email ? ` · ${p.email.trim()}` : ""}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
