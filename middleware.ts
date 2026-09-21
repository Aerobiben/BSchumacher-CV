import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, isValidSessionToken } from "@/lib/auth";

const publicExactPaths = new Set(["/auth", "/api/auth"]);

const securityHeaders: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "X-DNS-Prefetch-Control": "off",
};

function withSecurityHeaders(response: NextResponse) {
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublic =
    publicExactPaths.has(pathname) || pathname.startsWith("/api/auth/");

  if (isPublic) {
    return withSecurityHeaders(NextResponse.next());
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;
  if (!(await isValidSessionToken(token))) {
    const authUrl = request.nextUrl.clone();
    authUrl.pathname = "/auth";
    authUrl.search = "";
    return withSecurityHeaders(NextResponse.redirect(authUrl));
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ["/((?!_next/static|favicon.ico).*)"],
};
