"use client";

import { ContactIcon, MailIcon, PhoneIcon } from "lucide-react";
import { downloadResumeVCard } from "@/components/vcard-button";
import type { UiLabels } from "@/lib/locale";

export function MobileContactBar({
  name,
  headline,
  email,
  tel,
  location,
  urls,
  labels,
}: {
  name: string;
  headline: string;
  email?: string;
  tel?: string;
  location?: string;
  urls?: string[];
  labels: Pick<
    UiLabels,
    "contactBar" | "call" | "email" | "saveContact"
  >;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 p-2 backdrop-blur sm:hidden print:hidden">
      <nav
        aria-label={labels.contactBar}
        className="mx-auto grid max-w-3xl grid-cols-3 gap-1"
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
        <button
          type="button"
          className="flex flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[11px] font-medium text-foreground hover:bg-secondary"
          onClick={() =>
            downloadResumeVCard({ name, headline, email, tel, location, urls })
          }
        >
          <ContactIcon className="h-4 w-4" />
          {labels.saveContact}
        </button>
      </nav>
    </div>
  );
}
