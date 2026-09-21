const encoder = new TextEncoder();

export const AUTH_COOKIE = "cv-auth-token";
export const SESSION_MAX_AGE_SECONDS = 24 * 60 * 60;
export const MAX_PASSWORD_LENGTH = 128;

export const PASSWORD_HASH =
  process.env.CV_PASSWORD_HASH ??
  "20f2896560cf6f2619fdff529f0b0b9765ba754f28726bd3fefb858d3e689687";

function sessionSecret(): string {
  return process.env.CV_SESSION_SECRET ?? `cv-session-v1:${PASSWORD_HASH}`;
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toHex(new Uint8Array(signature));
}

export async function createSessionToken(): Promise<string> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const nonce = toHex(crypto.getRandomValues(new Uint8Array(16)));
  const payload = `${expiresAt}.${nonce}`;
  const signature = await hmacHex(payload, sessionSecret());
  return `${payload}.${signature}`;
}

export async function isValidSessionToken(
  token: string | undefined,
): Promise<boolean> {
  if (!token) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [expiresAt, nonce, signature] = parts;
  if (!/^\d{13}$/.test(expiresAt) || !/^[0-9a-f]{32}$/.test(nonce)) {
    return false;
  }

  if (Date.now() > Number(expiresAt)) {
    return false;
  }

  const expected = await hmacHex(`${expiresAt}.${nonce}`, sessionSecret());
  return timingSafeEqual(signature, expected);
}
