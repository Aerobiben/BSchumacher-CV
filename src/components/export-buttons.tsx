"use client";

import { FileDownIcon, FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function exportResume(format: "pdf" | "docx") {
  const link = document.createElement("a");
  link.href = `/api/export/${format}`;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function ExportButtons({
  pdfLabel,
  wordLabel,
  pdfAria,
  wordAria,
}: {
  pdfLabel: string;
  wordLabel: string;
  pdfAria: string;
  wordAria: string;
}) {
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs text-muted-foreground print:hidden"
        onClick={() => exportResume("pdf")}
        aria-label={pdfAria}
      >
        <FileDownIcon className="h-3.5 w-3.5 sm:mr-1.5" />
        <span className="hidden sm:inline">{pdfLabel}</span>
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs text-muted-foreground print:hidden"
        onClick={() => exportResume("docx")}
        aria-label={wordAria}
      >
        <FileTextIcon className="h-3.5 w-3.5 sm:mr-1.5" />
        <span className="hidden sm:inline">{wordLabel}</span>
      </Button>
    </>
  );
}
