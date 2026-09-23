import { NextResponse } from "next/server";
import { validateContact, type ContactPayload } from "@/lib/contact";

/**
 * POST /api/contact
 * Forwards valid messages to CONTACT_WEBHOOK_URL (Slack, Discord, Zapier, Resend relay…).
 * Without it, returns 503 NOT_CONFIGURED and the client hands off to the visitor's email app.
 */
export async function POST(req: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend success, drop silently.
  if (body.company) return NextResponse.json({ ok: true });

  const errors = validateContact(body);
  if (Object.keys(errors).length) {
    return NextResponse.json({ message: "Some fields need attention.", errors }, { status: 422 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    return NextResponse.json({ code: "NOT_CONFIGURED", message: "Direct email is set up instead." }, { status: 503 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name!.trim(),
        email: body.email!.trim(),
        topic: body.topic,
        message: body.message!.trim(),
        receivedAt: new Date().toISOString(),
      }),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "The message couldn't be delivered right now." }, { status: 502 });
  }
}
