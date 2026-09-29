"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { downloadResumeVCard } from "@/components/vcard-button";
import { LOCALE_COOKIE, type Locale, type UiLabels } from "@/lib/locale";
import type { ResumeSection } from "@/components/section-nav";

interface Props {
  locale: Locale;
  labels: Pick<
    UiLabels,
    | "commandPlaceholder"
    | "commandEmpty"
    | "commandActions"
    | "commandSections"
    | "commandLinks"
    | "commandPrint"
    | "commandVcard"
    | "commandLanguage"
    | "commandLogout"
    | "copyEmail"
    | "copyPhone"
  >;
  sections: ResumeSection[];
  links: { url: string; title: string }[];
  vcard: {
    name: string;
    headline: string;
    email?: string;
    tel?: string;
    location?: string;
    urls?: string[];
  };
}

export const CommandMenu = ({ locale, labels, sections, links, vcard }: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "j" || e.key === "k") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const close = () => setOpen(false);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={labels.commandPlaceholder} />
      <CommandList>
        <CommandEmpty>{labels.commandEmpty}</CommandEmpty>
        <CommandGroup heading={labels.commandSections}>
          {sections.map((section) => (
            <CommandItem
              key={section.id}
              onSelect={() => {
                close();
                document.getElementById(section.id)?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              <span>{section.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={labels.commandActions}>
          <CommandItem
            onSelect={() => {
              close();
              window.print();
            }}
          >
            <span>{labels.commandPrint}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              close();
              downloadResumeVCard(vcard);
            }}
          >
            <span>{labels.commandVcard}</span>
          </CommandItem>
          {vcard.email ? (
            <CommandItem
              onSelect={async () => {
                close();
                await navigator.clipboard.writeText(vcard.email ?? "");
              }}
            >
              <span>{labels.copyEmail}</span>
            </CommandItem>
          ) : null}
          {vcard.tel ? (
            <CommandItem
              onSelect={async () => {
                close();
                await navigator.clipboard.writeText(vcard.tel ?? "");
              }}
            >
              <span>{labels.copyPhone}</span>
            </CommandItem>
          ) : null}
          <CommandItem
            onSelect={() => {
              const next = locale === "de" ? "en" : "de";
              document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
              close();
              router.refresh();
            }}
          >
            <span>{labels.commandLanguage}</span>
          </CommandItem>
          <CommandItem
            onSelect={async () => {
              close();
              await fetch("/api/auth", { method: "DELETE" });
              window.location.href = "/auth";
            }}
          >
            <span>{labels.commandLogout}</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={labels.commandLinks}>
          {links.map(({ url, title }) => (
            <CommandItem
              key={url}
              onSelect={() => {
                close();
                window.open(url, "_blank", "noopener,noreferrer");
              }}
            >
              <span>{title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
