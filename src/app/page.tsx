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

const SOCIAL_ICONS = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
} as const;

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} | ${RESUME_DATA.about}`,
  description: RESUME_DATA.summary,
};

export default async function Page() {
  const authToken = cookies().get(AUTH_COOKIE)?.value;

  if (!(await isValidSessionToken(authToken))) {
    redirect("/auth");
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--accent))_0%,_transparent_42%)] opacity-70 print:hidden" />

      <div className="fixed right-4 top-4 z-50 print:hidden md:right-6 md:top-6">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8 print:max-w-none print:p-0 md:px-8 md:py-14">
        <article className="mx-auto w-full max-w-3xl space-y-10 rounded-3xl border border-border/80 bg-card/80 p-5 shadow-xl shadow-black/5 backdrop-blur-sm print:max-w-none print:space-y-6 print:rounded-none print:border-0 print:bg-transparent print:p-0 print:shadow-none sm:p-8 md:p-10">
          <header className="flex flex-col-reverse items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1 space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Lebenslauf
              </p>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                {RESUME_DATA.name}
              </h1>
              <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                {RESUME_DATA.about}
              </p>
              <p className="text-pretty font-mono text-xs text-muted-foreground">
                <a
                  className="inline-flex items-center gap-x-1.5 hover:underline"
                  href={RESUME_DATA.locationLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <GlobeIcon className="h-3 w-3" />
                  {RESUME_DATA.location}
                </a>
              </p>
              <div className="flex flex-wrap gap-2 pt-1 print:hidden">
                {RESUME_DATA.contact.email ? (
                  <Button className="h-9 w-9" variant="outline" size="icon" asChild>
                    <a
                      href={`mailto:${RESUME_DATA.contact.email}`}
                      aria-label="E-Mail"
                    >
                      <MailIcon className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
                {RESUME_DATA.contact.tel ? (
                  <Button className="h-9 w-9" variant="outline" size="icon" asChild>
                    <a href={`tel:${RESUME_DATA.contact.tel}`} aria-label="Telefon">
                      <PhoneIcon className="h-4 w-4" />
                    </a>
                  </Button>
                ) : null}
                {RESUME_DATA.contact.social.map((social) => {
                  const Icon = SOCIAL_ICONS[social.icon];
                  return (
                    <Button
                      key={social.name}
                      className="h-9 w-9"
                      variant="outline"
                      size="icon"
                      asChild
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={social.name}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  );
                })}
              </div>
              <div className="hidden flex-col gap-1 font-mono text-sm text-muted-foreground print:flex">
                {RESUME_DATA.contact.email ? (
                  <a href={`mailto:${RESUME_DATA.contact.email}`}>
                    <span className="underline">{RESUME_DATA.contact.email}</span>
                  </a>
                ) : null}
                {RESUME_DATA.contact.tel ? (
                  <a href={`tel:${RESUME_DATA.contact.tel}`}>
                    <span className="underline">{RESUME_DATA.contact.tel}</span>
                  </a>
                ) : null}
              </div>
            </div>

            <Avatar className="h-24 w-24 shrink-0 ring-2 ring-border ring-offset-2 ring-offset-background sm:h-28 sm:w-28">
              <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
              <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
            </Avatar>
          </header>

          <Section>
            <h2 className="border-b border-border pb-2 text-lg font-semibold tracking-tight">
              Über mich
            </h2>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {RESUME_DATA.summary}
            </p>
          </Section>

          {RESUME_DATA.work.length > 0 && (
            <Section>
              <h2 className="border-b border-border pb-2 text-lg font-semibold tracking-tight">
                Berufserfahrung
              </h2>
              <div className="relative space-y-6 border-l border-border pl-5">
                {RESUME_DATA.work.map((work) => (
                  <Card
                    key={`${work.company}-${work.start}`}
                    className="relative border-none bg-transparent shadow-none"
                  >
                    <span className="absolute -left-[1.45rem] top-1.5 h-2.5 w-2.5 rounded-full bg-foreground" />
                    <CardHeader>
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-x-4">
                        <div className="min-w-0">
                          <h3 className="font-semibold leading-snug">
                            <a
                              className="hover:underline"
                              href={work.link}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {work.company}
                            </a>
                          </h3>
                          <p className="text-sm text-muted-foreground">{work.title}</p>
                        </div>
                        <div className="shrink-0 text-sm tabular-nums text-muted-foreground">
                          {work.start} – {work.end === "ongoing" ? "heute" : work.end}
                        </div>
                      </div>
                      {work.badges.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {work.badges.map((badge) => (
                            <Badge key={badge} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="mt-2 text-sm leading-relaxed">
                      {work.description}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          )}

          {RESUME_DATA.education.length > 0 && (
            <Section>
              <h2 className="border-b border-border pb-2 text-lg font-semibold tracking-tight">
                Ausbildung
              </h2>
              <div className="grid gap-4">
                {RESUME_DATA.education.map((education) => (
                  <Card
                    key={education.school}
                    className="border-border/80 bg-muted/30"
                  >
                    <CardHeader className="p-4">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-x-4">
                        <div>
                          <h3 className="font-semibold leading-snug">
                            {education.school}
                          </h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {education.degree}
                          </p>
                        </div>
                        <div className="shrink-0 text-sm tabular-nums text-muted-foreground">
                          {education.start} – {education.end}
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </Section>
          )}

          {RESUME_DATA.skills.length > 0 && (
            <Section>
              <h2 className="border-b border-border pb-2 text-lg font-semibold tracking-tight">
                Kenntnisse
              </h2>
              <div className="flex flex-wrap gap-2">
                {RESUME_DATA.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-full px-3 py-1 text-xs font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </Section>
          )}

          <Section>
            <h2 className="border-b border-border pb-2 text-lg font-semibold tracking-tight">
              Zertifikat
            </h2>
            <Card className="border-border/80 bg-muted/30">
              <CardContent className="flex flex-col items-start gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">ITIL 4 Foundation</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Zertifikat als Download.
                  </p>
                </div>
                <Button variant="secondary" asChild>
                  <a href="/ITIL-Cert.png" download>
                    <DownloadIcon className="mr-2 h-4 w-4" />
                    Herunterladen
                  </a>
                </Button>
              </CardContent>
            </Card>
          </Section>

          {RESUME_DATA.projects.length > 0 && (
            <Section className="print-force-new-page">
              <h2 className="border-b border-border pb-2 text-lg font-semibold tracking-tight">
                Projekte
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {RESUME_DATA.projects.map((project) => (
                  <Card
                    key={project.title}
                    className="overflow-hidden border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md"
                  >
                    {project.image ? (
                      <div className="relative h-40 overflow-hidden bg-muted">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                      </div>
                    ) : null}
                    <CardHeader className="p-4 pb-2">
                      <h3 className="text-base font-semibold leading-snug">
                        {project.title}
                      </h3>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 text-sm leading-relaxed">
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
