import { NextRequest, NextResponse } from 'next/server';

const publicPaths = ['/auth', '/api/auth'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (publicPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get('cv-auth-token');

  if (!authToken) {
    const authUrl = request.nextUrl.clone();
    authUrl.pathname = '/auth';
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
