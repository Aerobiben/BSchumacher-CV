import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, isValidSessionToken } from "@/lib/auth";
import { LOCALE_COOKIE, parseLocale, UI } from "@/lib/locale";
import { getResume } from "@/data/resume-data";
import { buildExportDocument } from "@/lib/export/content";
import { buildResumePdf } from "@/lib/export/pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function contentDisposition(filename: string): string {
  return `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function GET() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);
  const document = buildExportDocument(getResume(locale), UI[locale], locale);
  const filename = `${document.fileBaseName}.pdf`;

  try {
    const body = await buildResumePdf(document);
    return new NextResponse(Buffer.from(body), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": contentDisposition(filename),
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Export failed", { status: 500 });
  }
}
