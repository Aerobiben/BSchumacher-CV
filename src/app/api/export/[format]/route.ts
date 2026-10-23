import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, isValidSessionToken } from "@/lib/auth";
import { LOCALE_COOKIE, parseLocale, UI } from "@/lib/locale";
import { getResume } from "@/data/resume-data";
import { buildExportDocument } from "@/lib/export/content";
import { buildResumePdf } from "@/lib/export/pdf";
import { buildResumeDocx } from "@/lib/export/docx";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseFormat(value: string): "pdf" | "docx" | null {
  if (value === "pdf") {
    return "pdf";
  }
  if (value === "docx" || value === "word") {
    return "docx";
  }
  return null;
}

function contentDisposition(filename: string): string {
  return `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function GET(
  _request: Request,
  context: { params: { format: string } },
) {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const format = parseFormat(context.params.format);
  if (!format) {
    return new NextResponse("Not found", { status: 404 });
  }

  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);
  const document = buildExportDocument(getResume(locale), UI[locale], locale);
  const filename = `${document.fileBaseName}.${format}`;

  try {
    const body =
      format === "pdf"
        ? await buildResumePdf(document)
        : await buildResumeDocx(document);

    return new NextResponse(Buffer.from(body), {
      headers: {
        "Content-Type":
          format === "pdf"
            ? "application/pdf"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": contentDisposition(filename),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Export failed", { status: 500 });
  }
}
