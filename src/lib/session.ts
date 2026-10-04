import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, isValidSessionToken } from "@/lib/auth";
import { safeNextPath } from "@/lib/utils";

export async function requireCvSession(nextPath = "/") {
  const authToken = cookies().get(AUTH_COOKIE)?.value;
  if (!(await isValidSessionToken(authToken))) {
    const next = safeNextPath(nextPath);
    redirect(next === "/" ? "/auth" : `/auth?next=${encodeURIComponent(next)}`);
  }
}
