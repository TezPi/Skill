"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Lock, WarningCircle } from "@phosphor-icons/react";

type Status = "idle" | "checking" | "invalid" | "unconfigured" | "error";

const MESSAGES: Partial<Record<Status, string>> = {
  invalid: "That password didn't work. Check it and try again.",
  unconfigured: "Password access isn't set up on this site yet. Contact me and I'll share the case study directly.",
  error: "Couldn't reach the server. Check your connection and try again.",
};

/** NDA gate. The password is verified server-side; success sets a signed, httpOnly cookie. */
export function ProtectedGate({ slug, name }: { slug: string; name: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [password, setPassword] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!password) return setStatus("invalid");
    setStatus("checking");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, password }),
      });
      if (res.ok) return router.refresh();
      setStatus(res.status === 503 ? "unconfigured" : res.status === 401 ? "invalid" : "error");
    } catch {
      setStatus("error");
    }
  };

  const message = MESSAGES[status];

  return (
    <section className="shell grid min-h-[72dvh] place-items-center py-20">
      <div className="w-full max-w-lg border-[2.5px] border-fg bg-bg p-7 shadow-[8px_8px_0_var(--fg)] md:p-10">
        <span aria-hidden="true" className="grid size-16 place-items-center border-[2.5px] border-fg bg-fg text-on-fg shadow-[5px_5px_0_var(--signal)]">
          <Lock size={30} weight="bold" />
        </span>
        <h1 className="mt-8 text-4xl font-black tracking-tight">{name}</h1>
        <p className="lede mt-3">This case study is under NDA. Enter the password I shared with you.</p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-2" noValidate>
          <label htmlFor="case-password" className="font-semibold">
            Password
          </label>
          <input
            id="case-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (status !== "checking") setStatus("idle");
            }}
            aria-invalid={status === "invalid"}
            aria-describedby={message ? "password-help password-error" : "password-help"}
            className="field-input"
          />
          <p id="password-help" className="text-sm text-muted">
            Checked on the server. Your browser only keeps an access cookie for this project.
          </p>
          {message ? (
            <p id="password-error" role="alert" className="flex items-start gap-2 text-sm font-semibold">
              <WarningCircle size={18} weight="fill" aria-hidden="true" className="mt-px shrink-0 text-signal" />
              {message}
            </p>
          ) : null}
          <button type="submit" className="btn mt-5 self-start" disabled={status === "checking"} aria-busy={status === "checking"}>
            {status === "checking" ? "Checking..." : "Unlock"}
          </button>
        </form>

        <p className="mt-8 border-t-2 border-fg/15 pt-6 text-sm">
          No password?{" "}
          <Link href={`/contact?topic=${slug}`} className="link-line font-bold">
            Contact
          </Link>
        </p>
      </div>
    </section>
  );
}
