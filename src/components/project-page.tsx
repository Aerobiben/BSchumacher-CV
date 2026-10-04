import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CommandMenu } from "@/components/command-menu";
import { LanguageToggle } from "@/components/language-toggle";
import { MobileContactBar } from "@/components/mobile-contact-bar";
import { PrintButton } from "@/components/print-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { VCardButton } from "@/components/vcard-button";
import type { LocalizedProject, Resume } from "@/data/resume-data";
import type { Locale, UiLabels } from "@/lib/locale";

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

export function ProjectPage({
  project,
  otherProjects,
  allProjects,
  resume,
  labels,
  locale,
}: {
  project: LocalizedProject;
  otherProjects: LocalizedProject[];
  allProjects: LocalizedProject[];
  resume: Resume;
  labels: UiLabels;
  locale: Locale;
}) {
  const vcard = {
    name: resume.name,
    headline: resume.headline,
    email: resume.contact.email,
    tel: resume.contact.tel,
    location: resume.location,
    urls: resume.contact.social.map((social) => social.url),
  };

  const sections = [
    { id: "overview", label: labels.projectOverview },
    { id: "highlights", label: labels.projectHighlights },
    ...(project.tags.length > 0
      ? [{ id: "stack", label: labels.projectStack }]
      : []),
    ...(otherProjects.length > 0
      ? [{ id: "more", label: labels.otherProjects }]
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
          className="mx-auto w-full max-w-3xl space-y-8 border border-border bg-card p-6 shadow-sm print:max-w-none print:space-y-6 print:border-0 print:bg-transparent print:p-0 print:shadow-none sm:p-10"
        >
          <div className="flex flex-col gap-3 print:hidden">
            <div
              className="flex flex-wrap items-center justify-between gap-2"
              aria-label={labels.documentActions}
            >
              <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                <Link href="/#projects">
                  <ArrowLeftIcon className="mr-1.5 h-3.5 w-3.5" />
                  {labels.backToResume}
                </Link>
              </Button>
              <div className="flex flex-wrap items-center justify-end gap-1">
                <VCardButton {...vcard} label={labels.saveContact} compact />
                <PrintButton label={labels.printPdf} />
                <LanguageToggle locale={locale} label={labels.language} />
                <ThemeToggle
                  lightLabel={labels.themeToLight}
                  darkLabel={labels.themeToDark}
                />
              </div>
            </div>
          </div>

          <header className="space-y-4">
            {project.image ? (
              <div className="relative h-48 overflow-hidden bg-muted sm:h-56">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                />
              </div>
            ) : null}
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {project.role}
            </p>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {project.title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            {project.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="font-sans text-xs font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <section className="space-y-3">
            <Heading id="overview">{labels.projectOverview}</Heading>
            <div className="space-y-3 text-pretty text-sm leading-relaxed text-muted-foreground">
              {project.overview.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>

          {project.highlights.length > 0 && (
            <section className="space-y-3">
              <Heading id="highlights">{labels.projectHighlights}</Heading>
              <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-muted-foreground">
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </section>
          )}

          {project.tags.length > 0 && (
            <section className="space-y-3">
              <Heading id="stack">{labels.projectStack}</Heading>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={`stack-${tag}`}
                    variant="secondary"
                    className="rounded-md px-2.5 py-1 font-sans text-xs font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {project.link ? (
            <section className="space-y-3">
              <Heading id="links">{labels.projectLinks}</Heading>
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm hover:underline"
              >
                {project.link.replace(/^https?:\/\//, "")}
                <ExternalLinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            </section>
          ) : null}

          {otherProjects.length > 0 && (
            <section className="space-y-4 print:hidden">
              <Heading id="more">{labels.otherProjects}</Heading>
              <div className="grid gap-4 sm:grid-cols-2">
                {otherProjects.map((item) => (
                  <Link key={item.slug} href={item.href} className="group block">
                    <Card className="h-full overflow-hidden border-border bg-card shadow-none transition-colors group-hover:border-foreground/25">
                      {item.image ? (
                        <div className="relative h-28 overflow-hidden bg-muted">
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        </div>
                      ) : null}
                      <CardHeader className="p-4 pb-2">
                        <h3 className="text-base font-medium leading-snug group-hover:underline">
                          {item.title}
                        </h3>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 font-sans text-sm leading-relaxed">
                        {item.description}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="border-t border-border pt-4 print:hidden">
            <Button variant="outline" size="sm" asChild>
              <Link href="/#projects">
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                {labels.backToResume}
              </Link>
            </Button>
          </div>
        </article>
      </div>

      <MobileContactBar {...vcard} labels={labels} />

      <CommandMenu
        locale={locale}
        labels={labels}
        sections={sections}
        vcard={vcard}
        projects={allProjects}
        links={[
          { url: "/#projects", title: labels.backToResume },
          ...resume.contact.social.map((social) => ({
            url: social.url,
            title: social.name,
          })),
        ]}
      />
    </main>
  );
}

export function ProjectCard({
  project,
  openLabel,
}: {
  project: Pick<
    LocalizedProject,
    "href" | "title" | "description" | "image" | "tags"
  >;
  openLabel: string;
}) {
  return (
    <Link href={project.href} className="group block break-inside-avoid">
      <Card className="h-full overflow-hidden border-border bg-card shadow-none transition-colors group-hover:border-foreground/25">
        {project.image ? (
          <div className="relative h-36 overflow-hidden bg-muted">
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ) : null}
        <CardHeader className="p-4 pb-2">
          <h3 className="text-base font-medium leading-snug group-hover:underline">
            {project.title}
          </h3>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0 font-sans text-sm leading-relaxed">
          <p>{project.description}</p>
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
          <p className="inline-flex items-center gap-1 text-xs font-medium text-foreground/80">
            {openLabel}
            <ArrowRightIcon className="h-3 w-3" />
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
