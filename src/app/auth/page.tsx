import { cookies } from "next/headers";
import { parseLocale, UI, LOCALE_COOKIE } from "@/lib/locale";
import { AuthForm } from "@/components/auth-form";

export default function AuthPage() {
  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);
  return <AuthForm locale={locale} labels={UI[locale]} />;
}
