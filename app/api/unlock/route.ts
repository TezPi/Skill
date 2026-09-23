import { NextResponse } from "next/server";
import { getProject } from "@/content/projects";
import { safeEqual, signUnlock, unlockCookie, unlockSecret } from "@/lib/unlock";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { slug?: string; password?: string };
  const slug = String(body.slug ?? "");
  const password = String(body.password ?? "");

  const project = getProject(slug);
  if (!project?.protected) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const secret = unlockSecret();
  if (!secret) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  if (!safeEqual(password, secret)) return NextResponse.json({ error: "invalid" }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(unlockCookie(slug), signUnlock(slug, secret), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: `/work/private/${slug}`,
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
