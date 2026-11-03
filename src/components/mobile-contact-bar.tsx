"use client";

import { MailIcon, PhoneIcon } from "lucide-react";
import type { UiLabels } from "@/lib/locale";

export function MobileContactBar({
  email,
  tel,
  labels,
}: {
  email?: string;
  tel?: string;
  labels: Pick<UiLabels, "contactBar" | "call" | "email">;
}) {
  if (!tel && !email) {
    return null;
  }

  const columns = tel && email ? "grid-cols-2" : "grid-cols-1";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-2 backdrop-blur sm:hidden print:hidden">
      <nav
        aria-label={labels.contactBar}
        className={`mx-auto grid max-w-3xl gap-1 ${columns}`}
      >
        {tel ? (
          <a
            href={`tel:${tel}`}
            className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-foreground hover:bg-secondary"
          >
            <PhoneIcon className="h-4 w-4" />
            {labels.call}
          </a>
        ) : null}
        {email ? (
          <a
            href={`mailto:${email}`}
            className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-foreground hover:bg-secondary"
          >
            <MailIcon className="h-4 w-4" />
            {labels.email}
          </a>
        ) : null}
      </nav>
    </div>
  );
}
