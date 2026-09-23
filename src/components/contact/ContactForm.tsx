"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useRef } from "react";
import { useContactForm } from "@/hooks/useContactForm";
import { LIMITS, TOPICS } from "@/lib/contact";
import { EASE_EXPO } from "@/lib/motion";
import { cn } from "@/lib/cn";
import { Button, ButtonLink } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/icons";

const field =
  "w-full rounded-control border bg-transparent px-4 text-base text-fg placeholder:text-fg-lo transition-[border-color,box-shadow] duration-300 ease-expo " +
  "focus:outline-none focus:border-signal focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-signal)_25%,transparent)]";

export function ContactForm({ to }: { to: string }) {
  const { values, errors, status, serverError, mailto, set, blur, submit, reset } = useContactForm({ to });
  const uid = useId();
  const form = useRef<HTMLFormElement>(null);
  const id = (k: string) => `${uid}-${k}`;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = await submit();
    if (invalid) form.current?.querySelector<HTMLElement>(`[name="${invalid}"]`)?.focus();
  };

  const done = status === "success" || status === "fallback";
  const remaining = LIMITS.messageMax - values.message.length;

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {done ? (
          <motion.div
            key="done"
            role="status"
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_EXPO }}
            className="rounded-panel border border-line bg-bg-raised p-8 md:p-10"
          >
            <span className="grid size-12 place-items-center rounded-full bg-signal text-on-signal">
              <CheckIcon size={22} />
            </span>
            {status === "success" ? (
              <>
                <h2 className="text-title mt-6">Thanks, {values.name.trim().split(" ")[0]}. Message received.</h2>
                <p className="mt-3 text-fg-mid">I&apos;ll reply to {values.email.trim()} soon.</p>
              </>
            ) : (
              <>
                <h2 className="text-title mt-6">Your message is ready. One click to send.</h2>
                <p className="mt-3 text-fg-mid">
                  Email is the quickest way to reach me right now. Your email app will open with everything already filled in.
                </p>
                <ButtonLink href={mailto} className="mt-6">
                  Open in my email app
                </ButtonLink>
              </>
            )}
            <div className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
              <ButtonLink href="/work" variant="secondary">
                View projects
              </ButtonLink>
              <Button variant="ghost" onClick={reset} className="px-3">
                Write another
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={form}
            noValidate
            onSubmit={onSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.25 } }}
            className="space-y-7"
            aria-describedby={serverError ? id("server") : undefined}
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <Field label="Name" htmlFor={id("name")} error={errors.name} errorId={id("name-err")}>
                <input
                  id={id("name")}
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  onBlur={() => blur("name")}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? id("name-err") : undefined}
                  className={cn(field, "h-13", errors.name ? "border-fg" : "border-line-strong")}
                />
              </Field>
              <Field label="Email" htmlFor={id("email")} error={errors.email} errorId={id("email-err")}>
                <input
                  id={id("email")}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                  onBlur={() => blur("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? id("email-err") : undefined}
                  className={cn(field, "h-13", errors.email ? "border-fg" : "border-line-strong")}
                />
              </Field>
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-medium">What&apos;s this about?</legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => {
                  const on = values.topic === t;
                  return (
                    <label
                      key={t}
                      className={cn(
                        "relative inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-control border px-4 text-sm transition-[border-color,background-color] duration-300 ease-expo has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal",
                        on ? "border-signal bg-signal/12 text-fg" : "border-line-strong text-fg-mid hover:border-fg",
                      )}
                    >
                      <input
                        type="radio"
                        name="topic"
                        value={t}
                        checked={on}
                        onChange={() => set("topic", t)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "grid size-4 place-items-center rounded-full border transition-colors",
                          on ? "border-signal" : "border-line-strong",
                        )}
                      >
                        <span className={cn("size-2 rounded-full bg-signal transition-transform duration-300 ease-expo", on ? "scale-100" : "scale-0")} />
                      </span>
                      {t}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Field
              label="Message"
              htmlFor={id("message")}
              error={errors.message}
              errorId={id("message-err")}
              hint={remaining < 200 ? `${remaining} characters left` : "The role, the product, or the problem. A few lines is plenty."}
              hintId={id("message-hint")}
            >
              <textarea
                id={id("message")}
                name="message"
                rows={6}
                maxLength={LIMITS.messageMax + 200}
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
                onBlur={() => blur("message")}
                aria-invalid={!!errors.message}
                aria-describedby={cn(id("message-hint"), errors.message && id("message-err"))}
                className={cn(field, "resize-y py-3 leading-relaxed", errors.message ? "border-fg" : "border-line-strong")}
              />
            </Field>

            {/* Honeypot: hidden from people and assistive tech. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Company
                <input tabIndex={-1} autoComplete="off" name="company" value={values.company} onChange={(e) => set("company", e.target.value)} />
              </label>
            </div>

            {status === "error" && serverError && (
              <div id={id("server")} role="alert" className="rounded-panel border border-signal/60 bg-signal/10 p-5 text-sm">
                <p className="font-medium">{serverError} Your message is still here.</p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  <button type="submit" className="link-draw min-h-9 font-medium">
                    Try again
                  </button>
                  <a href={mailto} className="link-draw min-h-9 font-medium">
                    Send it by email instead
                  </a>
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Button type="submit" size="lg" disabled={status === "submitting"} aria-busy={status === "submitting"}>
                {status === "submitting" ? (
                  <>
                    <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-on-signal/30 border-t-on-signal" />
                    Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
              <p className="text-sm text-fg-lo">Or email {to} directly.</p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  errorId,
  hint,
  hintId,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  errorId: string;
  hint?: string;
  hintId?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      <div className="mt-2 min-h-5 text-sm">
        {error ? (
          <p id={errorId} className="flex items-start gap-2 text-fg">
            <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-signal" />
            {error}
          </p>
        ) : (
          hint && (
            <p id={hintId} className="text-fg-lo">
              {hint}
            </p>
          )
        )}
      </div>
    </div>
  );
}
