function escapeVCard(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

function nameParts(fullName: string): { family: string; given: string } {
  const parts = fullName.trim().split(/\s+/);
  const given = parts.slice(0, -1).join(" ") || fullName;
  const family = parts.length > 1 ? parts[parts.length - 1] : "";
  return { family, given };
}

export function buildVCard(input: {
  name: string;
  headline: string;
  email?: string;
  tel?: string;
  location?: string;
  urls?: string[];
}): string {
  const { family, given } = nameParts(input.name);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCard(input.name)}`,
    `N:${escapeVCard(family)};${escapeVCard(given)};;;`,
    `TITLE:${escapeVCard(input.headline)}`,
  ];

  if (input.tel) {
    lines.push(`TEL;TYPE=CELL,VOICE:${input.tel}`);
  }
  if (input.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${input.email}`);
  }
  if (input.location) {
    lines.push(`ADR;TYPE=HOME:;;${escapeVCard(input.location)};;;;`);
  }
  for (const url of input.urls ?? []) {
    lines.push(`URL:${url}`);
  }

  lines.push("END:VCARD");
  return `${lines.join("\r\n")}\r\n`;
}

export function vCardFileName(name: string): string {
  return `${name.replace(/\s+/g, "-")}.vcf`;
}
