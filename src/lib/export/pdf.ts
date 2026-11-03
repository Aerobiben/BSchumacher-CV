import { readFile } from "fs/promises";
import path from "path";
import * as fontkit from "@pdf-lib/fontkit";
import {
  PDFDocument,
  PDFPage,
  PDFString,
  rgb,
  type PDFFont,
} from "pdf-lib";
import type { ExportDocument, ExportJob } from "@/lib/export/content";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN_X = 48;
const MARGIN_TOP = 46;
const MARGIN_BOTTOM = 40;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;
const FOOTER_RESERVE = 28;

const INK = rgb(15 / 255, 23 / 255, 42 / 255);
const MUTED = rgb(86 / 255, 98 / 255, 118 / 255);
const RULE = rgb(220 / 255, 214 / 255, 204 / 255);

type Fonts = {
  serif: PDFFont;
  serifSemi: PDFFont;
  serifItalic: PDFFont;
  sans: PDFFont;
  sansSemi: PDFFont;
};

type LinkTarget = {
  page: PDFPage;
  x: number;
  y: number;
  width: number;
  height: number;
  url: string;
};

const FONT_FILES = {
  serif: "SourceSerif4-Regular.ttf",
  serifSemi: "SourceSerif4-Semibold.ttf",
  serifItalic: "SourceSerif4-It.ttf",
  sans: "SourceSans3-Regular.ttf",
  sansSemi: "SourceSans3-Semibold.ttf",
} as const;

let fontBytesCache: Record<keyof typeof FONT_FILES, Uint8Array> | null = null;

async function loadFontBytes() {
  if (fontBytesCache) {
    return fontBytesCache;
  }

  const dir = path.join(process.cwd(), "src/lib/export/fonts");
  const read = (file: string) => readFile(path.join(dir, file));
  fontBytesCache = {
    serif: await read(FONT_FILES.serif),
    serifSemi: await read(FONT_FILES.serifSemi),
    serifItalic: await read(FONT_FILES.serifItalic),
    sans: await read(FONT_FILES.sans),
    sansSemi: await read(FONT_FILES.sansSemi),
  };
  return fontBytesCache;
}

async function embedFont(pdf: PDFDocument, bytes: Uint8Array) {
  try {
    return await pdf.embedFont(bytes, { subset: true });
  } catch {
    return await pdf.embedFont(bytes, { subset: false });
  }
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
): string[] {
  const normalized = text.replace(/\s+/g, " ").trim();
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

function addLink(
  pdf: PDFDocument,
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  url: string,
) {
  const annot = pdf.context.obj({
    Type: "Annot",
    Subtype: "Link",
    Rect: [x, y, x + width, y + height],
    Border: [0, 0, 0],
    A: {
      Type: "Action",
      S: "URI",
      URI: PDFString.of(url),
    },
  });
  page.node.addAnnot(pdf.context.register(annot));
}

class PdfWriter {
  private page: PDFPage;
  private y: number;
  private pageIndex = 0;
  private readonly links: LinkTarget[] = [];

  constructor(
    private readonly pdf: PDFDocument,
    private readonly fonts: Fonts,
    private readonly runningTitle: string,
  ) {
    this.page = this.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN_TOP;
  }

  private addPage() {
    this.page = this.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.pageIndex += 1;
    this.y = PAGE_HEIGHT - MARGIN_TOP;
    if (this.pageIndex > 0 && this.runningTitle) {
      this.page.drawText(this.runningTitle, {
        x: MARGIN_X,
        y: PAGE_HEIGHT - 28,
        size: 8,
        font: this.fonts.serif,
        color: MUTED,
      });
      this.page.drawLine({
        start: { x: MARGIN_X, y: PAGE_HEIGHT - 34 },
        end: { x: PAGE_WIDTH - MARGIN_X, y: PAGE_HEIGHT - 34 },
        thickness: 0.4,
        color: RULE,
      });
      this.y = PAGE_HEIGHT - 48;
    }
  }

  ensure(height: number) {
    if (this.y - height < MARGIN_BOTTOM + FOOTER_RESERVE) {
      this.addPage();
    }
  }

  gap(size: number) {
    this.y -= size;
  }

  rule() {
    this.ensure(10);
    this.page.drawLine({
      start: { x: MARGIN_X, y: this.y },
      end: { x: PAGE_WIDTH - MARGIN_X, y: this.y },
      thickness: 0.7,
      color: RULE,
    });
    this.y -= 12;
  }

  private drawLine(
    text: string,
    options: {
      font: PDFFont;
      size: number;
      color: ReturnType<typeof rgb>;
      x: number;
      width?: number;
      align?: "left" | "right";
      url?: string;
      justify?: boolean;
    },
  ) {
    const { font, size, color, x } = options;
    const width = options.width ?? CONTENT_WIDTH;
    let drawX = x;
    if (options.align === "right") {
      drawX = x + width - font.widthOfTextAtSize(text, size);
    }

    const baseline = this.y - size;
    if (options.justify && options.align !== "right") {
      const words = text.split(" ");
      if (words.length > 1) {
        const natural = font.widthOfTextAtSize(text, size);
        const extra = Math.max(0, width - natural);
        const gap = extra / (words.length - 1);
        let cursor = x;
        for (const word of words) {
          this.page.drawText(word, {
            x: cursor,
            y: baseline,
            size,
            font,
            color,
          });
          cursor += font.widthOfTextAtSize(word, size) + font.widthOfTextAtSize(" ", size) + gap;
        }
        this.y -= size * 1.38;
        return;
      }
    }

    this.page.drawText(text, {
      x: drawX,
      y: baseline,
      size,
      font,
      color,
    });

    if (options.url) {
      const textWidth = font.widthOfTextAtSize(text, size);
      this.links.push({
        page: this.page,
        x: drawX,
        y: baseline - 1,
        width: textWidth,
        height: size + 3,
        url: options.url,
      });
    }

    this.y -= size * 1.38;
  }

  text(
    value: string,
    options: {
      font?: PDFFont;
      size: number;
      color?: ReturnType<typeof rgb>;
      x?: number;
      width?: number;
      align?: "left" | "right";
      url?: string;
      justify?: boolean;
      lineHeight?: number;
    },
  ): number {
    const font = options.font ?? this.fonts.sans;
    const color = options.color ?? INK;
    const x = options.x ?? MARGIN_X;
    const width = options.width ?? CONTENT_WIDTH;
    const lines = wrapText(value, font, options.size, width);
    if (lines.length === 0) {
      return 0;
    }

    const lineHeight = options.lineHeight ?? options.size * 1.38;
    this.ensure(lines.length * lineHeight);
    const startY = this.y;
    lines.forEach((line, index) => {
      const isLast = index === lines.length - 1;
      this.drawLine(line, {
        font,
        size: options.size,
        color,
        x,
        width,
        align: options.align,
        url: isLast || lines.length === 1 ? options.url : undefined,
        justify: Boolean(options.justify) && !isLast,
      });
      if (options.lineHeight) {
        this.y += options.size * 1.38 - options.lineHeight;
      }
    });
    return startY - this.y;
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
      url?: string;
    },
  ) {
    const rightWidth = options.rightFont.widthOfTextAtSize(
      right,
      options.rightSize,
    );
    const gap = 14;
    const leftWidth = Math.max(90, CONTENT_WIDTH - rightWidth - gap);
    const leftLines = wrapText(left, options.leftFont, options.leftSize, leftWidth);
    const leftLeading = options.leftSize * 1.32;
    const blockHeight = Math.max(
      options.rightSize * 1.32,
      leftLines.length * leftLeading,
    );
    this.ensure(blockHeight);

    const top = this.y;
    let y = top;
    leftLines.forEach((line, index) => {
      const baseline = y - options.leftSize;
      this.page.drawText(line, {
        x: MARGIN_X,
        y: baseline,
        size: options.leftSize,
        font: options.leftFont,
        color: options.leftColor ?? INK,
      });
      if (options.url && index === 0) {
        this.links.push({
          page: this.page,
          x: MARGIN_X,
          y: baseline - 1,
          width: options.leftFont.widthOfTextAtSize(line, options.leftSize),
          height: options.leftSize + 3,
          url: options.url,
        });
      }
      y -= leftLeading;
    });
    this.page.drawText(right, {
      x: PAGE_WIDTH - MARGIN_X - rightWidth,
      y: top - options.rightSize,
      size: options.rightSize,
      font: options.rightFont,
      color: options.rightColor ?? MUTED,
    });
    this.y = Math.min(y, top - options.rightSize * 1.32);
  }

  section(title: string) {
    this.ensure(46);
    this.gap(10);
    this.text(title.toUpperCase(), {
      font: this.fonts.serifSemi,
      size: 9.5,
      lineHeight: 12,
    });
    this.y += 6;
    this.rule();
  }

  header(document: ExportDocument) {
    const leftWidth = CONTENT_WIDTH * 0.62;
    const rightWidth = CONTENT_WIDTH - leftWidth - 18;
    const rightX = MARGIN_X + leftWidth + 18;
    const top = this.y;

    this.text(document.name, {
      font: this.fonts.serifSemi,
      size: 22,
      width: leftWidth,
      lineHeight: 26,
    });
    this.gap(1);
    this.text(document.headline, {
      font: this.fonts.serifItalic,
      size: 10.5,
      width: leftWidth,
      lineHeight: 14,
    });
    this.text(document.about, {
      font: this.fonts.sans,
      size: 9.25,
      color: MUTED,
      width: leftWidth,
      lineHeight: 12.5,
    });
    if (document.availability) {
      this.text(document.availability, {
        font: this.fonts.sans,
        size: 9.25,
        color: MUTED,
        width: leftWidth,
        lineHeight: 12.5,
      });
    }
    const leftBottom = this.y;

    this.y = top;
    const contact: { text: string; url?: string }[] = [
      { text: document.location, url: document.locationLink },
    ];
    if (document.email) {
      contact.push({ text: document.email, url: `mailto:${document.email}` });
    }
    if (document.phone) {
      const tel = document.phone.replace(/\s+/g, "");
      contact.push({ text: document.phone, url: `tel:${tel}` });
    }
    for (const social of document.social) {
      contact.push({ text: social.name, url: social.url });
    }

    for (const item of contact) {
      this.text(item.text, {
        font: this.fonts.sans,
        size: 9.25,
        x: rightX,
        width: rightWidth,
        align: "right",
        url: item.url,
        lineHeight: 13,
      });
    }
    const rightBottom = this.y;

    this.y = Math.min(leftBottom, rightBottom) - 8;
    this.rule();
  }

  job(job: ExportJob) {
    const highlightLines = job.highlights.flatMap((highlight) =>
      wrapText(
        highlight,
        this.fonts.sans,
        9.4,
        CONTENT_WIDTH - 14,
      ),
    );
    const estimated =
      28 +
      (job.badges.length > 0 ? 14 : 0) +
      highlightLines.length * 13 +
      8;
    this.ensure(estimated);

    this.splitLine(job.company, job.dates, {
      leftFont: this.fonts.sansSemi,
      rightFont: this.fonts.sans,
      leftSize: 10.5,
      rightSize: 9,
      url: job.link,
    });
    this.text(job.title, {
      font: this.fonts.serifItalic,
      size: 10,
      lineHeight: 13.5,
    });
    if (job.badges.length > 0) {
      this.text(job.badges.join("  ·  "), {
        font: this.fonts.sans,
        size: 8.75,
        color: MUTED,
        lineHeight: 12,
      });
    }
    for (const highlight of job.highlights) {
      const bulletX = MARGIN_X + 2;
      const textX = MARGIN_X + 12;
      const lines = wrapText(highlight, this.fonts.sans, 9.4, CONTENT_WIDTH - 12);
      this.ensure(lines.length * 12.8);
      const bulletBaseline = this.y - 9.4;
      this.page.drawText("•", {
        x: bulletX,
        y: bulletBaseline,
        size: 9.4,
        font: this.fonts.sans,
        color: INK,
      });
      this.text(highlight, {
        font: this.fonts.sans,
        size: 9.4,
        x: textX,
        width: CONTENT_WIDTH - 12,
        lineHeight: 12.8,
      });
    }
  }

  skills(groups: { title: string; items: string }[]) {
    const labelWidth = 78;
    for (const group of groups) {
      const lines = wrapText(
        group.items,
        this.fonts.sans,
        9.4,
        CONTENT_WIDTH - labelWidth,
      );
      this.ensure(Math.max(14, lines.length * 12.8));
      const top = this.y;
      this.page.drawText(group.title.toUpperCase(), {
        x: MARGIN_X,
        y: top - 9,
        size: 8,
        font: this.fonts.sansSemi,
        color: MUTED,
      });
      this.y = top;
      this.text(group.items, {
        font: this.fonts.sans,
        size: 9.4,
        x: MARGIN_X + labelWidth,
        width: CONTENT_WIDTH - labelWidth,
        lineHeight: 12.8,
      });
    }
  }

  finish(pdf: PDFDocument, document: ExportDocument) {
    this.gap(10);
    this.rule();
    this.text(`${document.updated}  ·  ${document.references}`, {
      font: this.fonts.sans,
      size: 8.25,
      color: MUTED,
      lineHeight: 11,
    });

    const pages = pdf.getPages();
    if (pages.length > 1) {
      pages.forEach((page, index) => {
        const label = `${index + 1} / ${pages.length}`;
        const width = this.fonts.sans.widthOfTextAtSize(label, 8);
        page.drawText(label, {
          x: PAGE_WIDTH - MARGIN_X - width,
          y: 22,
          size: 8,
          font: this.fonts.sans,
          color: MUTED,
        });
      });
    }

    for (const link of this.links) {
      addLink(
        pdf,
        link.page,
        link.x,
        link.y,
        link.width,
        link.height,
        link.url,
      );
    }
  }
}

export async function buildResumePdf(document: ExportDocument): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`${document.name} – ${document.locale === "de" ? "Lebenslauf" : "Resume"}`);
  pdf.setAuthor(document.name);
  pdf.setSubject(document.headline);
  pdf.setCreator("Ben Schumacher CV");
  pdf.setProducer("Ben Schumacher CV");
  pdf.setLanguage(document.locale === "de" ? "de-DE" : "en-US");

  const bytes = await loadFontBytes();
  const fonts: Fonts = {
    serif: await embedFont(pdf, bytes.serif),
    serifSemi: await embedFont(pdf, bytes.serifSemi),
    serifItalic: await embedFont(pdf, bytes.serifItalic),
    sans: await embedFont(pdf, bytes.sans),
    sansSemi: await embedFont(pdf, bytes.sansSemi),
  };

  const writer = new PdfWriter(
    pdf,
    fonts,
    `${document.name}  ·  ${document.locale === "de" ? "Lebenslauf" : "Resume"}`,
  );

  writer.header(document);

  if (document.summary) {
    writer.section(document.profileTitle);
    writer.text(document.summary, {
      font: fonts.sans,
      size: 9.6,
      lineHeight: 13.2,
    });
  }

  if (document.jobs.length > 0) {
    writer.section(document.experienceTitle);
    document.jobs.forEach((job, index) => {
      if (index > 0) {
        writer.gap(9);
      }
      writer.job(job);
    });
  }

  if (document.education.length > 0) {
    writer.section(document.educationTitle);
    document.education.forEach((item, index) => {
      if (index > 0) {
        writer.gap(7);
      }
      writer.splitLine(item.school, item.dates, {
        leftFont: fonts.sansSemi,
        rightFont: fonts.sans,
        leftSize: 10.5,
        rightSize: 9,
      });
      writer.text(item.degree, {
        font: fonts.sans,
        size: 9.5,
        color: MUTED,
        lineHeight: 13,
      });
    });
  }

  if (document.skillGroups.length > 0) {
    writer.section(document.skillsTitle);
    writer.skills(document.skillGroups);
  }

  if (document.certificates.length > 0) {
    writer.section(document.certificatesTitle);
    for (const title of document.certificates) {
      writer.text(title, {
        font: fonts.sans,
        size: 9.6,
        lineHeight: 13,
      });
    }
  }

  writer.finish(pdf, document);
  return pdf.save({ useObjectStreams: true });
}
