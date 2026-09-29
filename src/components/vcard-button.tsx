"use client";

import { ContactIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildVCard, vCardFileName } from "@/lib/vcard";
import { cn } from "@/lib/utils";

export function downloadResumeVCard(input: {
  name: string;
  headline: string;
  email?: string;
  tel?: string;
  location?: string;
  urls?: string[];
}) {
  const contents = buildVCard(input);
  const blob = new Blob([contents], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = vCardFileName(input.name);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function VCardButton({
  name,
  headline,
  email,
  tel,
  location,
  urls,
  label,
  compact = false,
}: {
  name: string;
  headline: string;
  email?: string;
  tel?: string;
  location?: string;
  urls?: string[];
  label: string;
  compact?: boolean;
}) {
  return (
    <Button
      type="button"
      variant={compact ? "ghost" : "outline"}
      size="sm"
      className={cn(
        "print:hidden",
        compact && "h-8 px-2 text-xs text-muted-foreground",
      )}
      onClick={() =>
        downloadResumeVCard({ name, headline, email, tel, location, urls })
      }
    >
      <ContactIcon className={cn("h-3.5 w-3.5", compact ? "mr-1.5" : "mr-2")} />
      {label}
    </Button>
  );
}
