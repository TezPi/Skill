"use client";

import { Button } from "@/components/ui/Button";
import { PrintIcon } from "@/components/ui/icons";

export function PrintButton() {
  return (
    <Button onClick={() => window.print()} className="gap-2">
      <PrintIcon size={16} /> Print or save as PDF
    </Button>
  );
}
