"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { CheckCircle, PaperPlaneTilt, WarningCircle } from "@phosphor-icons/react";
import { sendContactMessage, type ContactResult } from "@/lib/contact";
import { validateContact, type ContactErrors, type ContactPayload } from "@/lib/validation";
import { profile } from "@/content/profile";

type Status = "idle" | "submitting" | "success" | "error";
type Field = "name" | "email" | "message";

const FAILURE: Record<Exclude<ContactResult, { ok: true }>["reason"], string> = {
  validation: "A few fields need attention before this can send.",
  unavailable: "The contact form isn't connected yet, so your message wasn't sent.",
  network: "You seem to be offline. Your message is still here, try again when you're connected.",
  server: "Something went wrong on my side. Your message is still here, please try again.",
};

const TOPICS: Record<string, string> = {
  "private-project": "Hi, I'd like access to the private case study. ",
};

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-2 text-sm font-semibold">
      <WarningCircle size={18} weight="fill" aria-hidden="true" className="mt-px shrink-0 text-signal" />
      {message}
    </p>
  );
}

/** Label above, helper below, error below that. Validates on blur, then live once touched. */
export function ContactForm() {
  const params = useSearchParams();
  const [values, setValues] = useState<ContactPayload>(() => ({
    name: "",
    email: "",
    message: TOPICS[params.get("topic") ?? ""] ?? "",
    company: "",
  }));
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const errors = { ...validateContact(values), ...serverErrors };
  const show = (field: Field) => (touched[field] ? errors[field] : undefined);

  const update = (field: keyof ContactPayload) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    setServerErrors((e) => ({ ...e, [field]: undefined }));
  };
  const blur = (field: Field) => () => setTouched((t) => ({ ...t, [field]: true }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const clientErrors = validateContact(values);
    const first = (["name", "email", "message"] as Field[]).find((f) => clientErrors[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
      return;
    }
    setStatus("submitting");
    setFailure("");
    const result = await sendContactMessage(values);
    if (result.ok) return setStatus("success");
    if (result.reason === "validation") setServerErrors(result.fieldErrors);
    setFailure(FAILURE[result.reason]);
    setStatus("error");
  };

  if (status === "success") {
    return (
      <div role="status" className="border-[2.5px] border-fg bg-bg p-8 shadow-[8px_8px_0_var(--signal)] md:p-12">
        <CheckCircle size={48} weight="fill" aria-hidden="true" className="text-signal" />
        <h2 className="mt-6 text-4xl font-black tracking-tight">Thanks for reaching out.</h2>
        <p className="lede mt-3">I&apos;ll get back to you soon.</p>
        <div className="mt-10 flex flex-wrap gap-4 pb-1.5 pr-1.5">
          <Link href="/" className="btn">
            Back home
          </Link>
          <Link href="/work" className="btn btn-secondary">
            View work
          </Link>
        </div>
      </div>
    );
  }

  const busy = status === "submitting";

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="flex flex-col gap-7 border-[2.5px] border-fg bg-bg p-6 shadow-[8px_8px_0_var(--fg)] md:p-10">
      <div className="flex flex-col gap-2">
        <label htmlFor="contact-name" className="font-semibold">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={update("name")}
          onBlur={blur("name")}
          aria-invalid={Boolean(show("name"))}
          aria-describedby={show("name") ? "contact-name-error" : undefined}
          className="field-input"
        />
        <FieldError id="contact-name-error" message={show("name")} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-email" className="font-semibold">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={update("email")}
          onBlur={blur("email")}
          aria-invalid={Boolean(show("email"))}
          aria-describedby={["contact-email-help", show("email") && "contact-email-error"].filter(Boolean).join(" ")}
          className="field-input"
        />
        <p id="contact-email-help" className="text-sm text-muted">
          Only used to reply to you.
        </p>
        <FieldError id="contact-email-error" message={show("email")} />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="contact-message" className="font-semibold">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          value={values.message}
          onChange={update("message")}
          onBlur={blur("message")}
          aria-invalid={Boolean(show("message"))}
          aria-describedby={["contact-message-help", show("message") && "contact-message-error"].filter(Boolean).join(" ")}
          className="field-input"
        />
        <p id="contact-message-help" className="text-sm text-muted">
          What are you building, and what do you need from a designer?
        </p>
        <FieldError id="contact-message-error" message={show("message")} />
      </div>

      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={update("company")} />
      </div>

      {status === "error" && failure ? (
        <div role="alert" className="flex items-start gap-3 border-[2.5px] border-dashed border-signal bg-signal-soft p-4">
          <WarningCircle size={22} weight="fill" aria-hidden="true" className="mt-px shrink-0 text-signal" />
          <p className="font-semibold">
            {failure}
            {profile.email ? (
              <>
                {" "}
                You can also email{" "}
                <a href={`mailto:${profile.email}`} className="underline underline-offset-4">
                  {profile.email}
                </a>
                .
              </>
            ) : null}
          </p>
        </div>
      ) : null}

      <div className="pb-1.5 pr-1.5">
        <button type="submit" className="btn" disabled={busy} aria-busy={busy}>
          <PaperPlaneTilt size={18} weight="bold" aria-hidden="true" className={busy ? "animate-pulse" : undefined} />
          {busy ? "Sending..." : status === "error" ? "Try again" : "Send message"}
        </button>
      </div>
    </form>
  );
}
