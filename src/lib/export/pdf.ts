import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFPage,
} from "pdf-lib";
import type { ExportDocument } from "@/lib/export/content";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const INK = rgb(0.12, 0.12, 0.12);
const MUTED = rgb(0.38, 0.38, 0.38);
const RULE = rgb(0.78, 0.78, 0.78);
const FOOTER_Y = 32;

function toWinAnsi(text: string): string {
  const mapped = text
    .replace(/\u2013|\u2014|\u2212|\u2010|\u2011/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/[\u2018\u2019\u201A\u2032]/g, "'")
    .replace(/[\u201C\u201D\u201E\u2033]/g, '"')
    .replace(/\u00A0/g, " ")
    .replace(/\u2022/g, "-")
    .replace(/\u00AD/g, "")
    .replace(/\u2192|\u279C|\u2794/g, "->");

  let output = "";
  for (const character of mapped) {
    const code = character.charCodeAt(0);
    if (code === 0x20ac) {
      output += "EUR";
      continue;
    }
    if (code < 0x20) {
      continue;
    }
    if (code <= 0x7e || (code >= 0xa0 && code <= 0xff)) {
      output += character;
      continue;
    }
    output += "?";
  }
  return output;
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const normalized = toWinAnsi(text).replace(/\s+/g, " ").trim();
  if (!normalized) {
    return [];
  }

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  const pushLongWord = (word: string) => {
    let remaining = word;
    while (remaining) {
      let fit = remaining.length;
      while (
        fit > 1 &&
        font.widthOfTextAtSize(remaining.slice(0, fit), size) > maxWidth
      ) {
        fit -= 1;
      }
      lines.push(remaining.slice(0, fit));
      remaining = remaining.slice(fit);
    }
  };

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      current = next;
      continue;
    }
    if (current) {
      lines.push(current);
    }
    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
    } else {
      current = "";
      pushLongWord(word);
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

class PdfWriter {
  private page: PDFPage;
  private y: number;

  constructor(
    private readonly pdf: PDFDocument,
    private readonly regular: PDFFont,
    private readonly bold: PDFFont,
    private readonly italic: PDFFont,
  ) {
    this.page = this.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  private addPage() {
    this.page = this.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  ensure(height: number) {
    if (this.y - height < MARGIN + 18) {
      this.addPage();
    }
  }

  gap(size: number) {
    this.y -= size;
  }

  rule() {
    this.ensure(10);
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y },
      thickness: 0.6,
      color: RULE,
    });
    this.y -= 10;
  }

  text(
    value: string,
    options: {
      font?: PDFFont;
      size: number;
      color?: ReturnType<typeof rgb>;
      x?: number;
      width?: number;
      lineHeight?: number;
      align?: "left" | "right";
    },
  ) {
    const font = options.font ?? this.regular;
    const color = options.color ?? INK;
    const x = options.x ?? MARGIN;
    const width = options.width ?? CONTENT_WIDTH;
    const lineHeight = options.lineHeight ?? options.size * 1.35;
    const lines = wrapText(value, font, options.size, width);
    if (lines.length === 0) {
      return 0;
    }

    this.ensure(lines.length * lineHeight);
    for (const line of lines) {
      const lineWidth = font.widthOfTextAtSize(line, options.size);
      const drawX =
        options.align === "right" ? x + width - lineWidth : x;
      this.page.drawText(line, {
        x: drawX,
        y: this.y - options.size,
        size: options.size,
        font,
        color,
      });
      this.y -= lineHeight;
    }
    return lines.length * lineHeight;
  }

  splitLine(
    left: string,
    right: string,
    options: {
      leftFont: PDFFont;
      rightFont: PDFFont;
      leftSize: number;
      rightSize: number;
      leftColor?: ReturnType<typeof rgb>;
      rightColor?: ReturnType<typeof rgb>;
    },
  ) {
    const rightText = toWinAnsi(right);
    const rightWidth = options.rightFont.widthOfTextAtSize(
      rightText,
      options.rightSize,
    );
    const gap = 12;
    const leftWidth = Math.max(80, CONTENT_WIDTH - rightWidth - gap);
    const leftLines = wrapText(left, options.leftFont, options.leftSize, leftWidth);
    const lineHeight = Math.max(options.leftSize, options.rightSize) * 1.35;
    const blockHeight = Math.max(lineHeight, leftLines.length * lineHeight);

    this.ensure(blockHeight);
    const top = this.y;
    this.page.drawText(rightText, {
      x: PAGE_WIDTH - MARGIN - rightWidth,
      y: top - options.rightSize,
      size: options.rightSize,
      font: options.rightFont,
      color: options.rightColor ?? MUTED,
    });

    let y = top;
    for (const line of leftLines) {
      this.page.drawText(line, {
        x: MARGIN,
        y: y - options.leftSize,
        size: options.leftSize,
        font: options.leftFont,
        color: options.leftColor ?? INK,
      });
      y -= lineHeight;
    }
    this.y = Math.min(y, top - lineHeight);
  }

  section(title: string) {
    this.ensure(28);
    this.gap(6);
    this.text(title.toUpperCase(), {
      font: this.bold,
      size: 11,
      lineHeight: 14,
    });
    this.y += 4;
    this.rule();
  }
}

export async function buildResumePdf(document: ExportDocument): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.setTitle(`${document.name} - ${document.fileBaseName.split("-").pop()}`);
  pdf.setAuthor(document.name);
  pdf.setCreator("Ben Schumacher CV");

  const regular = await pdf.embedFont(StandardFonts.TimesRoman);
  const bold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const italic = await pdf.embedFont(StandardFonts.TimesRomanItalic);
  const writer = new PdfWriter(pdf, regular, bold, italic);

  writer.text(document.name, {
    font: bold,
    size: 22,
    lineHeight: 26,
  });
  writer.gap(2);
  writer.text(document.headline, {
    font: italic,
    size: 11.5,
    lineHeight: 15,
  });
  writer.text(document.about, {
    size: 10,
    color: MUTED,
    lineHeight: 13,
  });
  if (document.availability) {
    writer.text(document.availability, {
      size: 10,
      color: MUTED,
      lineHeight: 13,
    });
  }
  writer.gap(4);
  for (const line of document.contactLines) {
    writer.text(line, {
      size: 10,
      lineHeight: 13,
    });
  }
  writer.gap(8);
  writer.rule();

  if (document.summary) {
    writer.section(document.profileTitle);
    writer.text(document.summary, {
      size: 10.5,
      lineHeight: 14.5,
    });
  }

  if (document.jobs.length > 0) {
    writer.section(document.experienceTitle);
    document.jobs.forEach((job, index) => {
      if (index > 0) {
        writer.gap(10);
      }
      writer.splitLine(job.company, job.dates, {
        leftFont: bold,
        rightFont: regular,
        leftSize: 11,
        rightSize: 9.5,
      });
      writer.text(job.title, {
        font: italic,
        size: 10.5,
        lineHeight: 14,
      });
      if (job.badges.length > 0) {
        writer.text(job.badges.join(" · "), {
          size: 9.5,
          color: MUTED,
          lineHeight: 13,
        });
      }
      for (const highlight of job.highlights) {
        writer.text(`•  ${highlight}`, {
          size: 10,
          lineHeight: 13.5,
          x: MARGIN + 8,
          width: CONTENT_WIDTH - 8,
        });
      }
    });
  }

  if (document.education.length > 0) {
    writer.section(document.educationTitle);
    document.education.forEach((item, index) => {
      if (index > 0) {
        writer.gap(8);
      }
      writer.splitLine(item.school, item.dates, {
        leftFont: bold,
        rightFont: regular,
        leftSize: 11,
        rightSize: 9.5,
      });
      writer.text(item.degree, {
        size: 10.5,
        color: MUTED,
        lineHeight: 14,
      });
    });
  }

  if (document.skillGroups.length > 0) {
    writer.section(document.skillsTitle);
    for (const group of document.skillGroups) {
      writer.text(`${group.title}: ${group.items}`, {
        size: 10.5,
        lineHeight: 14.5,
      });
    }
  }

  if (document.certificates.length > 0) {
    writer.section(document.certificatesTitle);
    for (const title of document.certificates) {
      writer.text(title, {
        size: 10.5,
        lineHeight: 14.5,
      });
    }
  }

  writer.gap(16);
  writer.rule();
  writer.text(`${document.updated}  ·  ${document.references}`, {
    size: 9,
    color: MUTED,
    lineHeight: 12,
  });

  const pages = pdf.getPages();
  pages.forEach((page, index) => {
    const label = `${index + 1} / ${pages.length}`;
    const width = regular.widthOfTextAtSize(label, 8);
    page.drawText(label, {
      x: PAGE_WIDTH - MARGIN - width,
      y: FOOTER_Y,
      size: 8,
      font: regular,
      color: MUTED,
    });
  });

  return pdf.save();
}
