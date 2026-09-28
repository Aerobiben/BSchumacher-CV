import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function formatDateRange(start: string, end: string): string {
  const formattedEnd = end === "ongoing" ? "heute" : end;
  return `${start} – ${formattedEnd}`;
}
