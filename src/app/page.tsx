import { Metadata } from "next";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, parseLocale, t, UI } from "@/lib/locale";
import { getResume, RESUME_DATA } from "@/data/resume-data";
import { ResumePage } from "@/components/resume-page";
import { requireCvSession } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);
  return {
    title: `${RESUME_DATA.name} — ${t(RESUME_DATA.headline, locale)}`,
    description: t(RESUME_DATA.summary, locale),
  };
}

export default async function Page() {
  await requireCvSession();

  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);

  return (
    <ResumePage
      resume={getResume(locale)}
      labels={UI[locale]}
      locale={locale}
    />
  );
}
