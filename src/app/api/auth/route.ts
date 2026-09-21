import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "crypto";
import {
  AUTH_COOKIE,
  MAX_PASSWORD_LENGTH,
  PASSWORD_HASH,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
} from "@/lib/auth";
import { getAuthLock, recordFailedAuthAttempt } from "@/lib/rate-limit";

export const runtime = "nodejs";

function sha256Hex(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function safeCompareHex(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return timingSafeEqual(bufferA, bufferB);
}

function clientKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.ip || "unknown";
  return ip;
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  const lock = getAuthLock(key);
  if (lock.locked) {
    return NextResponse.json(
      { error: "Zu viele Versuche. Bitte später erneut versuchen." },
      {
        status: 429,
        headers: { "Retry-After": String(lock.retryAfterSeconds) },
      },
    );
  }

  try {
    const body = await request.json();
    const password = body?.password;

    if (typeof password !== "string" || password.length === 0 || password.length > MAX_PASSWORD_LENGTH) {
      recordFailedAuthAttempt(key);
      return NextResponse.json({ error: "Passwort falsch" }, { status: 401 });
    }

    const isCorrect = safeCompareHex(sha256Hex(password), PASSWORD_HASH);

    if (!isCorrect) {
      recordFailedAuthAttempt(key);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return NextResponse.json({ error: "Passwort falsch" }, { status: 401 });
    }

    const token = await createSessionToken();
    cookies().set(AUTH_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Fehler beim Verarbeiten" },
      { status: 400 },
    );
  }
}
