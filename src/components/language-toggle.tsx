"use client";

import { LOCALE_COOKIE, type Locale } from "@/lib/locale";
import { cn } from "@/lib/utils";

export function LanguageToggle({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const setLocale = (next: Locale) => {
    if (next === locale) {
      return;
    }
    document.cookie = `${LOCALE_COOKIE}=${next}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <div
      className="inline-flex h-8 items-center rounded-md border border-border bg-background p-0.5 text-xs font-medium print:hidden"
      role="group"
      aria-label={label}
    >
      {(["de", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          aria-pressed={locale === option}
          className={cn(
            "rounded px-2 py-1 uppercase tracking-wide transition",
            locale === option
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
