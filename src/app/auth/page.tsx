import { cookies } from "next/headers";
import { parseLocale, UI, LOCALE_COOKIE } from "@/lib/locale";
import { AuthForm } from "@/components/auth-form";
import { safeNextPath } from "@/lib/utils";

export default function AuthPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);
  return (
    <AuthForm
      locale={locale}
      labels={UI[locale]}
      nextPath={safeNextPath(searchParams.next)}
    />
  );
}
