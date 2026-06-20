import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandMenu } from "@/components/command-menu";
import Image from "next/image";
import { Metadata } from "next";
import { Section } from "@/components/ui/section";
import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { RESUME_DATA } from "@/data/resume-data";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SOCIAL_ICONS = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
} as const;

export const metadata: Metadata = {
  title: `${RESUME_DATA.name} | ${RESUME_DATA.about}`,
  description: RESUME_DATA.summary,
};

export default function Page() {
  const authToken = cookies().get('cv-auth-token')?.value;

  if (!authToken) {
    redirect('/auth');
  }

  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <div className="fixed right-4 top-4 z-50 print:hidden">
        <ThemeToggle />
      </div>
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-background print:space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">{RESUME_DATA.name}</h1>
            <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground">
              {RESUME_DATA.about}
            </p>
            <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={RESUME_DATA.locationLink}
                target="_blank"
                rel="noreferrer"
              >
                <GlobeIcon className="h-3 w-3" />
                {RESUME_DATA.location}
              </a>
            </p>
            <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden">
              {RESUME_DATA.contact.email ? (
                <Button className="h-8 w-8" variant="outline" size="icon" asChild>
                  <a href={`mailto:${RESUME_DATA.contact.email}`}>
                    <MailIcon className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
              {RESUME_DATA.contact.tel ? (
                <Button className="h-8 w-8" variant="outline" size="icon" asChild>
                  <a href={`tel:${RESUME_DATA.contact.tel}`}>
                    <PhoneIcon className="h-4 w-4" />
                  </a>
                </Button>
              ) : null}
              {RESUME_DATA.contact.social.map((social) => {
                const Icon = SOCIAL_ICONS[social.icon];
                return (
                  <Button key={social.name} className="h-8 w-8" variant="outline" size="icon" asChild>
                    <a href={social.url} target="_blank" rel="noreferrer">
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

          <Avatar className="h-28 w-28">
            <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
            <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
          </Avatar>
        </div>

        <Section>
          <h2 className="text-xl font-bold">About</h2>
          <p className="text-pretty font-mono text-sm text-muted-foreground">
            {RESUME_DATA.summary}
          </p>
        </Section>

        {RESUME_DATA.work.length > 0 && (
          <Section>
            <h2 className="text-xl font-bold">Work Experience</h2>
            {RESUME_DATA.work.map((work) => (
              <Card key={`${work.company}-${work.start}`}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <div>
                      <h3 className="font-semibold leading-none">
                        <a className="hover:underline" href={work.link} target="_blank" rel="noreferrer">
                          {work.company}
                        </a>
                      </h3>
                      <p className="text-sm text-muted-foreground">{work.title}</p>
                    </div>
                    <div className="text-sm tabular-nums text-muted-foreground">
                      {work.start} - {work.end}
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
                <CardContent className="mt-2 text-xs text-muted-foreground">
                  {work.description}
                </CardContent>
              </Card>
            ))}
          </Section>
        )}

        {RESUME_DATA.education.length > 0 && (
          <Section>
            <h2 className="text-xl font-bold">Education</h2>
            {RESUME_DATA.education.map((education) => (
              <Card key={education.school}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="font-semibold leading-none">{education.school}</h3>
                    <div className="text-sm tabular-nums text-muted-foreground">
                      {education.start} - {education.end}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-2 text-xs text-muted-foreground">
                  {education.degree}
                </CardContent>
              </Card>
            ))}
          </Section>
        )}

        {RESUME_DATA.skills.length > 0 && (
          <Section>
            <h2 className="text-xl font-bold">Skills</h2>
            <div className="flex flex-wrap gap-1">
              {RESUME_DATA.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </Section>
        )}

        <Section>
          <h2 className="text-xl font-bold">Zertifikat</h2>
          <p className="text-pretty font-mono text-sm text-muted-foreground">
            ITIL 4 Foundation Zertifikat als Download.
          </p>
          <Button variant="secondary" asChild>
            <a href="/ITIL-Cert.png" download>
              ITIL 4 Foundation herunterladen
            </a>
          </Button>
        </Section>

        {RESUME_DATA.projects.length > 0 && (
          <Section>
            <h2 className="text-xl font-bold">Projects</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {RESUME_DATA.projects.map((project) => (
                <Card key={project.title} className="overflow-hidden border-white/10 bg-slate-950/80 shadow-lg shadow-slate-900/40">
                  {project.image ? (
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}
                  <CardHeader>
                    <h3 className="text-base font-semibold">{project.title}</h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Section>
        )}
      </section>

      <CommandMenu
        links={RESUME_DATA.contact.social.map((social) => ({
          url: social.url,
          title: social.name,
        }))}
      />
    </main>
  );
}
