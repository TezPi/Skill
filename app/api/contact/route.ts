import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/validation";

/**
 * Contact endpoint. Forwards valid messages to CONTACT_WEBHOOK_URL
 * (Formspree, Make, Slack, your own API). See .env.example.
 */
export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const payload: ContactPayload = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    message: String(body.message ?? ""),
    company: String(body.company ?? ""),
  };

  // Honeypot filled: pretend success so bots learn nothing.
  if (payload.company) return NextResponse.json({ ok: true });

  const fieldErrors = validateContact(payload);
  if (Object.keys(fieldErrors).length) return NextResponse.json({ fieldErrors }, { status: 422 });

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  const message = { name: payload.name.trim(), email: payload.email.trim(), message: payload.message.trim() };

  if (!webhook) {
    if (process.env.NODE_ENV === "development") {
      console.info("[contact] CONTACT_WEBHOOK_URL not set. Message:", message);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(message),
    });
    if (!res.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "upstream" }, { status: 502 });
  }
}
