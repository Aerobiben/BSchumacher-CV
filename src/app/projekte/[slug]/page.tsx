import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LOCALE_COOKIE, parseLocale, UI } from "@/lib/locale";
import { requireCvSession } from "@/lib/session";
import {
  getLocalizedProject,
  getLocalizedProjects,
  getProjectSlugs,
  getResume,
  RESUME_DATA,
} from "@/data/resume-data";
import { ProjectPage } from "@/components/project-page";

type Params = { slug: string };

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);
  const project = getLocalizedProject(params.slug, locale);
  if (!project) {
    return { title: RESUME_DATA.name };
  }
  return {
    title: `${project.title} — ${RESUME_DATA.name}`,
    description: project.description,
  };
}

export default async function ProjectRoute({ params }: { params: Params }) {
  await requireCvSession();

  const locale = parseLocale(cookies().get(LOCALE_COOKIE)?.value);
  const project = getLocalizedProject(params.slug, locale);
  if (!project) {
    notFound();
  }

  const allProjects = getLocalizedProjects(locale);
  const otherProjects = allProjects.filter((item) => item.slug !== project.slug);

  return (
    <ProjectPage
      project={project}
      otherProjects={otherProjects}
      allProjects={allProjects}
      resume={getResume(locale)}
      labels={UI[locale]}
      locale={locale}
    />
  );
}
