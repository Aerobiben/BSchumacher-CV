import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, isValidSessionToken } from "@/lib/auth";

export async function requireCvSession() {
  const authToken = cookies().get(AUTH_COOKIE)?.value;
  if (!(await isValidSessionToken(authToken))) {
    redirect("/auth");
  }
}
