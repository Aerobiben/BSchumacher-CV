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
    >
      <PrinterIcon className="mr-1.5 h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
