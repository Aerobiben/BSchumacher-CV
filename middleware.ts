import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Passwort-API-Route nicht schützen
  if (request.nextUrl.pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // Überprüfe ob der User authentifiziert ist
  const authToken = request.cookies.get('cv-auth-token');

  // Wenn kein Token und nicht auf der Auth-Page -> zu Auth-Page umleiten
  if (!authToken && request.nextUrl.pathname !== '/auth') {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // Wenn Token vorhanden und auf Auth-Page -> zu Homepage umleiten
  if (authToken && request.nextUrl.pathname === '/auth') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
