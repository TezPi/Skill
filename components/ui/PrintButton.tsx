"use client";

import { Printer } from "@phosphor-icons/react";

export function PrintButton() {
  return (
    <button type="button" className="btn" onClick={() => window.print()}>
      <Printer size={18} weight="bold" aria-hidden="true" />
      Save as PDF
    </button>
  );
}
