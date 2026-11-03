"use client";

import { FileDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function exportResumePdf() {
  const link = document.createElement("a");
  link.href = "/api/export";
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function ExportButtons({
  pdfLabel,
  pdfAria,
}: {
  pdfLabel: string;
  pdfAria: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-xs text-muted-foreground print:hidden"
      onClick={() => exportResumePdf()}
      aria-label={pdfAria}
    >
      <FileDownIcon className="mr-1.5 h-3.5 w-3.5" />
      <span>{pdfLabel}</span>
    </Button>
  );
}
