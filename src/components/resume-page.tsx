import type { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandMenu } from "@/components/command-menu";
import Image from "next/image";
import {
  CalendarDaysIcon,
  DownloadIcon,
  ExternalLinkIcon,
  GlobeIcon,
  MailIcon,
  PhoneIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { PrintButton } from "@/components/print-button";
import { LanguageToggle } from "@/components/language-toggle";
import { CopyButton } from "@/components/copy-button";
import { VCardButton } from "@/components/vcard-button";
import { SectionNav, type ResumeSection } from "@/components/section-nav";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { Section } from "@/components/ui/section";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import type { Resume } from "@/data/resume-data";
import type { Locale, UiLabels } from "@/lib/locale";
import {
  formatDateRange,
  formatGermanPhone,
  formatTenure,
  formatUpdatedAt,
} from "@/lib/utils";

const SOCIAL_ICONS = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
} as const;

function Heading({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 border-b border-border pb-2 font-serif text-xl font-semibold tracking-tight"
    >
      {children}
    </h2>
  );
}

export function ResumePage({
  resume,
  labels,
  locale,
}: {
  resume: Resume;
  labels: UiLabels;
  locale: Locale;
}) {
  const phoneDisplay = formatGermanPhone(resume.contact.tel);
  const socialUrls = resume.contact.social.map((social) => social.url);
  const vcard = {
    name: resume.name,
    headline: resume.headline,
    email: resume.contact.email,
    tel: resume.contact.tel,
    location: resume.location,
    urls: socialUrls,
  };

  const sections: ResumeSection[] = [
    { id: "profile", label: labels.profile },
    ...(resume.work.length > 0
      ? [{ id: "experience", label: labels.experience }]
      : []),
    ...(resume.education.length > 0
      ? [{ id: "education", label: labels.education }]
      : []),
    ...(resume.skillGroups.length > 0
      ? [{ id: "skills", label: labels.skills }]
      : []),
    ...(resume.certificates.length > 0
      ? [{ id: "certificates", label: labels.certificates }]
      : []),
    ...(resume.projects.length > 0
      ? [{ id: "projects", label: labels.projects }]
      : []),
  ];

  return (
    <main className="relative min-h-screen overflow-x-hidden pb-24 sm:pb-0">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm print:hidden"
      >
        {labels.skipToContent}
      </a>

      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_hsl(var(--muted))_0%,_transparent_55%)] print:hidden" />

      <div className="container mx-auto px-4 py-8 print:max-w-none print:p-0 md:px-8 md:py-12">
        <article
          id="content"
          className="mx-auto w-full max-w-3xl space-y-9 border border-border bg-card p-6 shadow-sm print:max-w-none print:space-y-6 print:border-0 print:bg-transparent print:p-0 print:shadow-none sm:p-10"
        >
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <SectionNav sections={sections} label={labels.sectionNav} />
            <div
              className="flex flex-wrap items-center justify-end gap-1"
              aria-label={labels.documentActions}
            >
              <VCardButton {...vcard} label={labels.saveContact} compact />
              <PrintButton label={labels.printPdf} />
              <LanguageToggle locale={locale} label={labels.language} />
              <ThemeToggle
                lightLabel={labels.themeToLight}
                darkLabel={labels.themeToDark}
              />
            </div>
          </div>

          <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="space-y-1.5">
                <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  {resume.name}
                </h1>
                <p className="max-w-xl text-base leading-snug text-foreground/80">
                  {resume.headline}
                </p>
                <p className="text-sm text-muted-foreground">{resume.about}</p>
              </div>

              <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <li>
                  <a
                    className="inline-flex items-center gap-2 hover:text-foreground hover:underline"
                    href={resume.locationLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GlobeIcon className="h-3.5 w-3.5 shrink-0" />
                    {resume.location}
                  </a>
                </li>
                {resume.availability ? (
                  <li className="inline-flex items-center gap-2">
                    <CalendarDaysIcon className="h-3.5 w-3.5 shrink-0" />
                    {resume.availability}
                  </li>
                ) : null}
                {resume.contact.email ? (
                  <li className="flex items-center gap-0.5">
                    <a
                      className="inline-flex items-center gap-2 hover:text-foreground hover:underline"
                      href={`mailto:${resume.contact.email}`}
                    >
                      <MailIcon className="h-3.5 w-3.5 shrink-0" />
                      {resume.contact.email}
                    </a>
                    <CopyButton
                      value={resume.contact.email}
                      label={labels.copyEmail}
                      copiedLabel={labels.copied}
                    />
                  </li>
                ) : null}
                {resume.contact.tel ? (
                  <li className="flex items-center gap-0.5">
                    <a
                      className="inline-flex items-center gap-2 hover:text-foreground hover:underline"
                      href={`tel:${resume.contact.tel}`}
                    >
                      <PhoneIcon className="h-3.5 w-3.5 shrink-0" />
                      {phoneDisplay}
                    </a>
                    <CopyButton
                      value={resume.contact.tel}
                      label={labels.copyPhone}
                      copiedLabel={labels.copied}
                    />
                  </li>
                ) : null}
                {resume.contact.social.map((social) => {
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
                        <span className="hidden print:inline">
                          {" "}
                          ({social.url.replace(/^https?:\/\//, "")})
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            <Avatar className="h-24 w-24 shrink-0 rounded-full ring-1 ring-border sm:h-28 sm:w-28">
              <AvatarImage alt={resume.name} src={resume.avatarUrl} />
              <AvatarFallback className="rounded-full font-serif text-lg">
                {resume.initials}
              </AvatarFallback>
            </Avatar>
          </header>

          <Section>
            <Heading id="profile">{labels.profile}</Heading>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              {resume.summary}
            </p>
          </Section>

          {resume.work.length > 0 && (
            <Section>
              <Heading id="experience">{labels.experience}</Heading>
              <div className="space-y-6 border-l border-border pl-4">
                {resume.work.map((work) => {
                  const tenure = formatTenure(work.start, work.end, locale);
                  return (
                    <div
                      key={`${work.company}-${work.start}`}
                      className="relative grid gap-1 break-inside-avoid"
                    >
                      <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border border-border bg-card" />
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
                          {formatDateRange(work.start, work.end, locale)}
                          {tenure ? ` · ${tenure}` : ""}
                        </p>
                      </div>
                      <p className="text-sm text-foreground/80">{work.title}</p>
                      {work.badges.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {work.badges.map((badge) => (
                            <Badge
                              key={badge}
                              variant="secondary"
                              className="font-sans text-xs font-medium"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {work.highlights.length > 0 && (
                        <ul className="mt-1.5 list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                          {work.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {resume.education.length > 0 && (
            <Section>
              <Heading id="education">{labels.education}</Heading>
              <div className="space-y-5 border-l border-border pl-4">
                {resume.education.map((education) => (
                  <div
                    key={education.school}
                    className="relative flex flex-col gap-1 break-inside-avoid sm:flex-row sm:items-baseline sm:justify-between sm:gap-x-4"
                  >
                    <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border border-border bg-card" />
                    <div>
                      <h3 className="font-medium leading-snug">
                        {education.school}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {education.degree}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm tabular-nums text-muted-foreground">
                      {formatDateRange(education.start, education.end, locale)}
                    </p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {resume.skillGroups.length > 0 && (
            <Section>
              <Heading id="skills">{labels.skills}</Heading>
              <div className="space-y-4">
                {resume.skillGroups.map((group) => (
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

          {resume.certificates.length > 0 && (
            <Section>
              <Heading id="certificates">{labels.certificates}</Heading>
              <div className="space-y-4">
                {resume.certificates.map((certificate) => (
                  <div
                    key={certificate.title}
                    className="flex flex-col items-start gap-3 break-inside-avoid sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium">{certificate.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {labels.certificateFile}
                      </p>
                    </div>
                    <div className="flex gap-2 print:hidden">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={certificate.file}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {labels.view}
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={certificate.file}
                          download={certificate.downloadName}
                        >
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          {labels.download}
                        </a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {resume.projects.length > 0 && (
            <Section>
              <Heading id="projects">{labels.projects}</Heading>
              <div className="grid gap-5 sm:grid-cols-2">
                {resume.projects.map((project) => (
                  <Card
                    key={project.title}
                    className="overflow-hidden border-border bg-card shadow-none break-inside-avoid"
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
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 hover:underline"
                          >
                            {project.title}
                            <ExternalLinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          </a>
                        ) : (
                          project.title
                        )}
                      </h3>
                    </CardHeader>
                    <CardContent className="space-y-3 p-4 pt-0 font-sans text-sm leading-relaxed">
                      <p>{project.description}</p>
                      {project.link ? (
                        <p className="hidden text-xs text-muted-foreground print:block">
                          {project.link.replace(/^https?:\/\//, "")}
                        </p>
                      ) : null}
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {project.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="font-sans text-[11px] font-medium"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Section>
          )}

          <footer className="flex flex-col gap-1 border-t border-border pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>
              {labels.updated} {formatUpdatedAt(resume.updatedAt, locale)}
            </p>
            <p>{labels.references}</p>
          </footer>
        </article>
      </div>

      <MobileContactBar {...vcard} labels={labels} />

      <CommandMenu
        locale={locale}
        labels={labels}
        sections={sections}
        vcard={vcard}
        links={resume.contact.social.map((social) => ({
          url: social.url,
          title: social.name,
        }))}
      />
    </main>
  );
}
