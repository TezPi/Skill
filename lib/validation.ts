export type ContactPayload = {
  name: string;
  email: string;
  message: string;
  /** Honeypot. Humans never see it. */
  company?: string;
};

export type ContactErrors = Partial<Record<"name" | "email" | "message", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(values: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Add your name so I know who to reply to.";
  else if (name.length > 120) errors.name = "Keep your name under 120 characters.";

  if (!email) errors.email = "Add an email address for the reply.";
  else if (!EMAIL.test(email)) errors.email = "That email looks incomplete. Check for a typo.";

  if (!message) errors.message = "Tell me a little about the project.";
  else if (message.length < 20) errors.message = "Add a bit more detail, at least 20 characters.";
  else if (message.length > 4000) errors.message = "Keep it under 4000 characters.";

  return errors;
}
