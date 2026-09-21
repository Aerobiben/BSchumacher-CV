"use client";

import { useState, useEffect } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Command } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  links: { url: string; title: string }[];
}

export const CommandMenu = ({ links }: Props) => {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen: boolean) => !prevOpen);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <p className="fixed bottom-4 left-1/2 z-40 hidden -translate-x-1/2 rounded-full border bg-background/90 px-4 py-1.5 text-center text-sm text-muted-foreground shadow-sm backdrop-blur print:hidden xl:block">
        <kbd className="pointer-events-none mr-1 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>J
        </kbd>
        Befehlsmenü öffnen
      </p>
      <Button
        onClick={() => setOpen((prevOpen: boolean) => !prevOpen)}
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 flex rounded-full shadow-2xl print:hidden xl:hidden"
      >
        <Command className="h-6 w-6" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Befehl suchen …" />
        <CommandList>
          <CommandEmpty>Keine Treffer.</CommandEmpty>
          <CommandGroup heading="Aktionen">
            <CommandItem
              onSelect={() => {
                setOpen(false);
                window.print();
              }}
            >
              <span>Drucken</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Links">
            {links.map(({ url, title }) => (
              <CommandItem
                key={url}
                onSelect={() => {
                  setOpen(false);
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                <span>{title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
};
