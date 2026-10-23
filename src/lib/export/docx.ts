import {
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Tab,
  TabStopType,
  TextRun,
  convertMillimetersToTwip,
} from "docx";
import type { ExportDocument } from "@/lib/export/content";

const PAGE_WIDTH = convertMillimetersToTwip(210);
const MARGIN = convertMillimetersToTwip(19);
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const INK = "1F1F1F";
const MUTED = "616161";

const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const ruleBorder = {
  style: BorderStyle.SINGLE,
  size: 6,
  color: "C7C7C7",
  space: 6,
};

function run(
  text: string,
  options: {
    bold?: boolean;
    italics?: boolean;
    size?: number;
    color?: string;
    font?: string;
  } = {},
) {
  return new TextRun({
    text,
    bold: options.bold,
    italics: options.italics,
    size: options.size ?? 21,
    color: options.color ?? INK,
    font: options.font ?? "Times New Roman",
  });
}

function spacer(twips = 120) {
  return new Paragraph({
    spacing: { after: twips, line: 240 },
    children: [run("")],
  });
}

function heading(text: string) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 80 },
    border: {
      top: noBorder,
      left: noBorder,
      right: noBorder,
      bottom: ruleBorder,
    },
    children: [
      run(text.toUpperCase(), {
        bold: true,
        size: 22,
      }),
    ],
  });
}

function splitLine(left: string, right: string, leftBold = true) {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
    spacing: { after: 40 },
    children: [
      run(left, { bold: leftBold, size: 22 }),
      new TextRun({ children: [new Tab()] }),
      run(right, { size: 19, color: MUTED }),
    ],
  });
}

export async function buildResumeDocx(
  document: ExportDocument,
): Promise<Uint8Array> {
  const children: Paragraph[] = [
    new Paragraph({
      spacing: { after: 40 },
      children: [run(document.name, { bold: true, size: 44 })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [run(document.headline, { italics: true, size: 23 })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [run(document.about, { size: 20, color: MUTED })],
    }),
  ];

  if (document.availability) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [run(document.availability, { size: 20, color: MUTED })],
      }),
    );
  }

  for (const [index, line] of document.contactLines.entries()) {
    children.push(
      new Paragraph({
        spacing: {
          after: index === document.contactLines.length - 1 ? 160 : 20,
        },
        children: [run(line, { size: 20 })],
      }),
    );
  }

  if (document.summary) {
    children.push(heading(document.profileTitle));
    children.push(
      new Paragraph({
        spacing: { after: 80, line: 276 },
        children: [run(document.summary, { size: 21 })],
      }),
    );
  }

  if (document.jobs.length > 0) {
    children.push(heading(document.experienceTitle));
    document.jobs.forEach((job, index) => {
      if (index > 0) {
        children.push(spacer(80));
      }
      children.push(splitLine(job.company, job.dates));
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [run(job.title, { italics: true, size: 21 })],
        }),
      );
      if (job.badges.length > 0) {
        children.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [run(job.badges.join(" · "), { size: 19, color: MUTED })],
          }),
        );
      }
      for (const highlight of job.highlights) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 40, line: 276 },
            children: [run(highlight, { size: 20 })],
          }),
        );
      }
    });
  }

  if (document.education.length > 0) {
    children.push(heading(document.educationTitle));
    document.education.forEach((item, index) => {
      if (index > 0) {
        children.push(spacer(60));
      }
      children.push(splitLine(item.school, item.dates));
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [run(item.degree, { size: 21, color: MUTED })],
        }),
      );
    });
  }

  if (document.skillGroups.length > 0) {
    children.push(heading(document.skillsTitle));
    for (const group of document.skillGroups) {
      children.push(
        new Paragraph({
          spacing: { after: 80 },
          children: [
            run(`${group.title}: `, { bold: true, size: 21 }),
            run(group.items, { size: 21 }),
          ],
        }),
      );
    }
  }

  if (document.certificates.length > 0) {
    children.push(heading(document.certificatesTitle));
    for (const title of document.certificates) {
      children.push(
        new Paragraph({
          spacing: { after: 60 },
          children: [run(title, { size: 21 })],
        }),
      );
    }
  }

  children.push(
    new Paragraph({
      spacing: { before: 280 },
      border: {
        top: ruleBorder,
        left: noBorder,
        right: noBorder,
        bottom: noBorder,
      },
      children: [
        run(`${document.updated}  ·  ${document.references}`, {
          size: 18,
          color: MUTED,
        }),
      ],
    }),
  );

  const doc = new Document({
    creator: document.name,
    title: document.fileBaseName,
    description: document.headline,
    theme: {
      fonts: {
        headings: "Times New Roman",
        body: "Times New Roman",
      },
    },
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 21,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: PAGE_WIDTH,
              height: convertMillimetersToTwip(297),
            },
            margin: {
              top: MARGIN,
              right: MARGIN,
              bottom: MARGIN,
              left: MARGIN,
            },
          },
        },
        children,
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  return new Uint8Array(buffer);
}
