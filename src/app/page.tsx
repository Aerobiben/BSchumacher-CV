import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandMenu } from "@/components/command-menu";
import Image from "next/image";
import { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { DownloadIcon, GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { RESUME_DATA } from "@/data/resume-data";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE, isValidSessionToken } from "@/lib/auth";
import { formatDateRange, formatGermanPhone } from "@/lib/utils";

const SOCIAL_ICONS = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
} as const;

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} — ${RESUME_DATA.headline}`,
  description: RESUME_DATA.summary,
};

export default async function Page() {
  const authToken = cookies().get(AUTH_COOKIE)?.value;

  if (!(await isValidSessionToken(authToken))) {
    redirect("/auth");
  }

  const phoneDisplay = formatGermanPhone(RESUME_DATA.contact.tel);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_hsl(var(--muted))_0%,_transparent_55%)] print:hidden" />

      <div className="container mx-auto px-4 py-8 pb-24 print:max-w-none print:p-0 md:px-8 md:py-12 md:pb-24">
        <article className="mx-auto w-full max-w-3xl space-y-9 border border-border bg-card p-6 shadow-sm print:max-w-none print:space-y-6 print:border-0 print:bg-transparent print:p-0 print:shadow-none sm:p-10">
          <div className="flex justify-end print:hidden">
            <ThemeToggle />
          </div>

          <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="space-y-1.5">
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {RESUME_DATA.name}
                </h1>
                <p className="max-w-xl text-base leading-snug text-foreground/80">
                  {RESUME_DATA.headline}
                </p>
                <p className="text-sm text-muted-foreground">{RESUME_DATA.about}</p>
              </div>

              <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <li>
                  <a
                    className="inline-flex items-center gap-2 hover:text-foreground hover:underline"
                    href={RESUME_DATA.locationLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GlobeIcon className="h-3.5 w-3.5 shrink-0" />
                    {RESUME_DATA.location}
                  </a>
                </li>
                {RESUME_DATA.contact.email ? (
                  <li>
                    <a
                      className="inline-flex items-center gap-2 hover:text-foreground hover:underline"
                      href={`mailto:${RESUME_DATA.contact.email}`}
                    >
                      <MailIcon className="h-3.5 w-3.5 shrink-0" />
                      {RESUME_DATA.contact.email}
                    </a>
                  </li>
                ) : null}
                {RESUME_DATA.contact.tel ? (
                  <li>
                    <a
                      className="inline-flex items-center gap-2 hover:text-foreground hover:underline"
                      href={`tel:${RESUME_DATA.contact.tel}`}
                    >
                      <PhoneIcon className="h-3.5 w-3.5 shrink-0" />
                      {phoneDisplay}
                    </a>
                  </li>
                ) : null}
                {RESUME_DATA.contact.social.map((social) => {
                  const Icon = SOCIAL_ICONS[social.icon];
                  return (
                    <li key={social.name} className="print:block">
                      <a
                        className="inline-flex items-center gap-2 hover:text-foreground hover:underline"
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        {social.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Avatar className="h-24 w-24 shrink-0 rounded-full ring-1 ring-border sm:h-28 sm:w-28">
              <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
              <AvatarFallback className="rounded-full font-serif text-lg">
                {RESUME_DATA.initials}
              </AvatarFallback>
            </Avatar>
          </header>

          <Section>
            <h2 className="border-b border-border pb-2 font-serif text-xl font-semibold tracking-tight">
              Profil
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {RESUME_DATA.summary}
            </p>
          </Section>

          {RESUME_DATA.work.length > 0 && (
            <Section>
              <h2 className="border-b border-border pb-2 font-serif text-xl font-semibold tracking-tight">
                Berufserfahrung
              </h2>
              <div className="space-y-6">
                {RESUME_DATA.work.map((work) => (
                  <div
                    key={`${work.company}-${work.start}`}
                    className="grid gap-1 border-t border-border pt-5 first:border-t-0 first:pt-0"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4">
                      <h3 className="font-medium leading-snug">
                        <a
                          className="hover:underline"
                          href={work.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {work.company}
                        </a>
                      </h3>
                      <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
                        {formatDateRange(work.start, work.end)}
                      </p>
                    </div>
                    <p className="text-sm text-foreground/80">{work.title}</p>
                    {work.badges.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {work.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="font-sans text-xs font-medium">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {work.description}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {RESUME_DATA.education.length > 0 && (
            <Section>
              <h2 className="border-b border-border pb-2 font-serif text-xl font-semibold tracking-tight">
                Ausbildung
              </h2>
              <div className="space-y-5">
                {RESUME_DATA.education.map((education) => (
                  <div
                    key={education.school}
                    className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4"
                  >
                    <div>
                      <h3 className="font-medium leading-snug">{education.school}</h3>
                      <p className="text-sm text-muted-foreground">{education.degree}</p>
                    </div>
                    <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {formatDateRange(education.start, education.end)}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {RESUME_DATA.skillGroups.length > 0 && (
            <Section>
              <h2 className="border-b border-border pb-2 font-serif text-xl font-semibold tracking-tight">
                Kenntnisse
              </h2>
              <div className="space-y-4">
                {RESUME_DATA.skillGroups.map((group) => (
                  <div key={group.title}>
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {group.title}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="rounded-md px-2.5 py-1 font-sans text-xs font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section>
            <h2 className="border-b border-border pb-2 font-serif text-xl font-semibold tracking-tight">
              Zertifikat
            </h2>
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">ITIL 4 Foundation</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Zertifikat zum Download
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="/media/ITIL-Cert.png" download="ITIL-4-Foundation.png">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Herunterladen
                </a>
              </Button>
            </div>
          </Section>

          {RESUME_DATA.projects.length > 0 && (
            <Section className="print-force-new-page">
              <h2 className="border-b border-border pb-2 font-serif text-xl font-semibold tracking-tight">
                Projekte
              </h2>
              <div className="grid gap-5 sm:grid-cols-2">
                {RESUME_DATA.projects.map((project) => (
                  <Card
                    key={project.title}
                    className="overflow-hidden border-border bg-card shadow-none"
                  >
                    {project.image ? (
                      <div className="relative h-36 overflow-hidden bg-muted">
                        <Image
                          src={project.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                    ) : null}
                    <CardHeader className="p-4 pb-2">
                      <h3 className="text-base font-medium leading-snug">
                        {project.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 font-sans text-sm leading-relaxed">
                      {project.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          )}
        </article>
      </div>

      <CommandMenu
        links={RESUME_DATA.contact.social.map((social) => ({
          url: social.url,
          title: social.name,
        }))}
      />
    </main>
  );
}
