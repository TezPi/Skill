import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const unlockCookie = (slug: string) => `case-${slug}`;

export function unlockSecret() {
  return process.env.PRIVATE_CASE_PASSWORD || "";
}

export function signUnlock(slug: string, secret: string) {
  return createHmac("sha256", secret).update(`unlock:${slug}`).digest("hex");
}

/** Compares two strings without leaking length or timing. */
export function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export async function isUnlocked(slug: string) {
  const secret = unlockSecret();
  if (!secret) return false;
  const value = (await cookies()).get(unlockCookie(slug))?.value;
  return Boolean(value && safeEqual(value, signUnlock(slug, secret)));
}
