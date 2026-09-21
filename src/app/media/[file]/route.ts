import { readFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE, isValidSessionToken } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED_FILES: Record<string, string> = {
  "project-1.svg": "image/svg+xml",
  "project-2.svg": "image/svg+xml",
  "project-3.svg": "image/svg+xml",
  "ITIL-Cert.png": "image/png",
};

export async function GET(
  _request: Request,
  context: { params: { file: string } },
) {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const file = context.params.file;
  const contentType = ALLOWED_FILES[file];
  if (!contentType) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const buffer = await readFile(path.join(process.cwd(), "content", file));
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
