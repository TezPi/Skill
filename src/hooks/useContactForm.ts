"use client";

import { useCallback, useMemo, useState } from "react";
import { buildMailto, validateContact, type ContactErrors, type ContactPayload } from "@/lib/contact";

export type FormStatus = "idle" | "submitting" | "success" | "error" | "fallback";
type Field = keyof ContactErrors;

const EMPTY: ContactPayload = { name: "", email: "", topic: "Full-time role", message: "", company: "" };

/**
 * Form state + submission, kept out of the UI.
 * - Validates on blur, then live once a field has been touched.
 * - 503 NOT_CONFIGURED → "fallback": the message is handed to the visitor's email app, never lost.
 */
export function useContactForm({ to, endpoint = "/api/contact" }: { to: string; endpoint?: string }) {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const allErrors = useMemo(() => validateContact(values), [values]);
  const errors = useMemo(() => {
    const visible: ContactErrors = {};
    (Object.keys(allErrors) as Field[]).forEach((k) => {
      if (touched[k]) visible[k] = allErrors[k];
    });
    return visible;
  }, [allErrors, touched]);

  const set = useCallback(<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (status === "error") setStatus("idle");
  }, [status]);

  const blur = useCallback((key: Field) => setTouched((t) => ({ ...t, [key]: true })), []);

  const mailto = useMemo(() => buildMailto(to, values), [to, values]);

  const submit = useCallback(async (): Promise<Field | null> => {
    setTouched({ name: true, email: true, topic: true, message: true });
    const firstInvalid = (["name", "email", "topic", "message"] as Field[]).find((k) => allErrors[k]);
    if (firstInvalid) return firstInvalid;

    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setStatus("success");
        return null;
      }
      const data = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
      if (data.code === "NOT_CONFIGURED") {
        setStatus("fallback");
        return null;
      }
      setServerError(data.message ?? "The server didn't accept the message.");
      setStatus("error");
    } catch {
      setServerError("Couldn't reach the server. Check your connection.");
      setStatus("error");
    }
    return null;
  }, [allErrors, endpoint, values]);

  const reset = useCallback(() => {
    setValues(EMPTY);
    setTouched({});
    setStatus("idle");
    setServerError(null);
  }, []);

  return { values, errors, status, serverError, mailto, set, blur, submit, reset };
}
