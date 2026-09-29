"use client";

import { PrinterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ label }: { label: string }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 text-xs text-muted-foreground print:hidden"
      onClick={() => window.print()}
      aria-label={label}
    >
      <PrinterIcon className="h-3.5 w-3.5 sm:mr-1.5" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
