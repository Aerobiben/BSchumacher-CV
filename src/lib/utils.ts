import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "@/lib/locale";

export function safeNextPath(value: string | undefined | null): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatGermanPhone(e164: string): string {
  if (!e164.startsWith("+49") || e164.length < 8) {
    return e164;
  }

  const national = e164.slice(3);
  if (national.startsWith("15") && national.length >= 6) {
    return `+49 ${national.slice(0, 3)} ${national.slice(3)}`;
  }

  return `+49 ${national}`;
}

const MONTHS = {
  de: [
    "Jan.",
    "Feb.",
    "März",
    "Apr.",
    "Mai",
    "Juni",
    "Juli",
    "Aug.",
    "Sep.",
    "Okt.",
    "Nov.",
    "Dez.",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
} as const;

function formatPeriodLabel(value: string, locale: Locale): string {
  const [year, month] = value.split("-");
  if (!month) {
    return year;
  }

  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11 || Number.isNaN(monthIndex)) {
    return year;
  }

  return `${MONTHS[locale][monthIndex]} ${year}`;
}

export function formatDateRange(
  start: string,
  end: string,
  locale: Locale,
): string {
  const formattedStart = formatPeriodLabel(start, locale);
  const formattedEnd =
    end === "ongoing"
      ? locale === "de"
        ? "heute"
        : "present"
      : formatPeriodLabel(end, locale);

  if (formattedEnd === formattedStart) {
    return formattedStart;
  }

  return `${formattedStart} – ${formattedEnd}`;
}

function parsePeriod(value: string, bound: "start" | "end"): Date {
  const [year, month] = value.split("-").map(Number);
  if (!month) {
    return bound === "start" ? new Date(year, 0, 1) : new Date(year, 11, 31);
  }
  return bound === "start"
    ? new Date(year, month - 1, 1)
    : new Date(year, month, 0);
}

function monthDiff(start: Date, end: Date): number {
  return (
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth())
  );
}

function formatUnit(
  locale: Locale,
  years: number,
  months: number,
): string | null {
  if (years <= 0 && months <= 0) {
    return null;
  }

  if (locale === "de") {
    if (years <= 0) {
      return months === 1 ? "1 Monat" : `${months} Monate`;
    }
    if (months <= 0) {
      return years === 1 ? "1 Jahr" : `${years} Jahre`;
    }
    return `${years} ${years === 1 ? "Jahr" : "Jahre"} ${months} ${
      months === 1 ? "Monat" : "Monate"
    }`;
  }

  if (years <= 0) {
    return months === 1 ? "1 mo" : `${months} mo`;
  }
  if (months <= 0) {
    return years === 1 ? "1 yr" : `${years} yrs`;
  }
  return `${years} yr${years === 1 ? "" : "s"} ${months} mo`;
}

export function formatTenure(
  start: string,
  end: string,
  locale: Locale,
): string | null {
  const yearOnly = !start.includes("-") && (end === "ongoing" || !end.includes("-"));

  if (yearOnly) {
    const startYear = Number(start);
    const endYear = end === "ongoing" ? new Date().getFullYear() : Number(end);
    const years = Math.max(0, endYear - startYear);
    if (years < 1) {
      return null;
    }
    return formatUnit(locale, years, 0);
  }

  const startDate = parsePeriod(start, "start");
  const endDate = end === "ongoing" ? new Date() : parsePeriod(end, "end");
  const totalMonths = Math.max(0, monthDiff(startDate, endDate) + 1);
  if (totalMonths < 2 && start === end) {
    return null;
  }

  return formatUnit(locale, Math.floor(totalMonths / 12), totalMonths % 12);
}

export function formatUpdatedAt(value: string, locale: Locale): string {
  const [year, month] = value.split("-");
  if (!month) {
    return year;
  }

  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11 || Number.isNaN(monthIndex)) {
    return year;
  }

  if (locale === "de") {
    return `${MONTHS.de[monthIndex]} ${year}`;
  }

  return `${MONTHS.en[monthIndex]} ${year}`;
}
