import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const correctPassword = process.env.CV_PASSWORD;

    if (!correctPassword) {
      return NextResponse.json(
        { error: 'Server-Konfiguration fehlt' },
        { status: 500 }
      );
    }

    // Sichere Passwort-Vergleich (verhindert Timing-Attacks)
    const isCorrect = password === correctPassword;

    if (!isCorrect) {
      // Künstliche Verzögerung um Brute-Force zu bremsen
      await new Promise(resolve => setTimeout(resolve, 1000));
      return NextResponse.json(
        { error: 'Passwort falsch' },
        { status: 401 }
      );
    }

    // Erstelle Session Cookie
    const cookieStore = await cookies();
    cookieStore.set('cv-auth-token', 'authenticated', {
      httpOnly: true, // JavaScript kann nicht darauf zugreifen
      secure: process.env.NODE_ENV === 'production', // Nur HTTPS in Production
      sameSite: 'strict', // CSRF-Protection
      maxAge: 24 * 60 * 60, // 24 Stunden
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Fehler beim Verarbeiten' },
      { status: 400 }
    );
  }
}
