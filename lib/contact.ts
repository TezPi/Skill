import type { ContactErrors, ContactPayload } from "./validation";

export type ContactResult =
  | { ok: true }
  | { ok: false; reason: "validation"; fieldErrors: ContactErrors }
  | { ok: false; reason: "unavailable" | "network" | "server" };

/** Client-side service. Swap the endpoint here when wiring a real backend. */
export async function sendContactMessage(payload: ContactPayload): Promise<ContactResult> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => ({}))) as { fieldErrors?: ContactErrors };
    if (res.status === 422 && data.fieldErrors) return { ok: false, reason: "validation", fieldErrors: data.fieldErrors };
    if (res.status === 503) return { ok: false, reason: "unavailable" };
    return { ok: false, reason: "server" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
