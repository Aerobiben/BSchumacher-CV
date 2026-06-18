import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createHash, timingSafeEqual } from 'crypto';

// Node.js Runtime erzwingen (crypto ist im Edge-Runtime nicht verfügbar)
export const runtime = 'nodejs';

// ─────────────────────────────────────────────────────────────────────────────
//  Sicherheit: Das Passwort wird NIRGENDWO im Klartext gespeichert.
//  Stattdessen liegt nur der SHA-256-Hash vor. Da SHA-256 eine Einwegfunktion
//  ist, lässt sich das Passwort daraus nicht zurückrechnen.
//
//  Der Hash kann optional über die Umgebungsvariable CV_PASSWORD_HASH
//  überschrieben werden; ansonsten gilt der hier hinterlegte Standard-Hash.
// ─────────────────────────────────────────────────────────────────────────────
const PASSWORD_HASH =
  process.env.CV_PASSWORD_HASH ??
  '20f2896560cf6f2619fdff529f0b0b9765ba754f28726bd3fefb858d3e689687';

function sha256Hex(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

// Zeitkonstanter Vergleich, der nicht über die Länge des Inputs leakt.
// Da beide Hashes immer gleich lang (64 Hex-Zeichen) sind, ist der Vergleich
// vollständig zeitkonstant.
function safeCompare(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    // Eingabe hashen und gegen den gespeicherten Hash vergleichen.
    const isCorrect =
      typeof password === 'string' &&
      safeCompare(sha256Hex(password), PASSWORD_HASH);

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
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Fehler beim Verarbeiten' },
      { status: 400 }
    );
  }
}
