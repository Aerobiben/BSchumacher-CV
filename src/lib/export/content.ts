import type { Resume } from "@/data/resume-data";
import type { Locale, UiLabels } from "@/lib/locale";
import {
  formatDateRange,
  formatGermanPhone,
  formatTenure,
  formatUpdatedAt,
} from "@/lib/utils";

export type ExportJob = {
  company: string;
  link?: string;
  title: string;
  dates: string;
  badges: string[];
  highlights: string[];
};

export type ExportEducation = {
  school: string;
  degree: string;
  dates: string;
};

export type ExportSkillGroup = {
  title: string;
  items: string;
};

export type ExportSocial = {
  name: string;
  url: string;
  display: string;
};

export type ExportDocument = {
  locale: Locale;
  fileBaseName: string;
  name: string;
  headline: string;
  about: string;
  availability?: string;
  location: string;
  locationLink?: string;
  email?: string;
  phone?: string;
  social: ExportSocial[];
  profileTitle: string;
  summary: string;
  experienceTitle: string;
  jobs: ExportJob[];
  educationTitle: string;
  education: ExportEducation[];
  skillsTitle: string;
  skillGroups: ExportSkillGroup[];
  certificatesTitle: string;
  certificates: string[];
  updated: string;
  references: string;
};

export function exportFileBaseName(name: string, locale: Locale): string {
  const slug = name.trim().replace(/\s+/g, "-");
  return locale === "de" ? `${slug}-Lebenslauf` : `${slug}-Resume`;
}

export function buildExportDocument(
  resume: Resume,
  labels: UiLabels,
  locale: Locale,
): ExportDocument {
  return {
    locale,
    fileBaseName: exportFileBaseName(resume.name, locale),
    name: resume.name,
    headline: resume.headline,
    about: resume.about,
    availability: resume.availability || undefined,
    location: resume.location,
    locationLink: resume.locationLink,
    email: resume.contact.email || undefined,
    phone: resume.contact.tel
      ? formatGermanPhone(resume.contact.tel)
      : undefined,
    social: resume.contact.social.map((social) => ({
      name: social.name,
      url: social.url,
      display: social.url.replace(/^https?:\/\/(www\.)?/, ""),
    })),
    profileTitle: labels.profile,
    summary: resume.summary,
    experienceTitle: labels.experience,
    jobs: resume.work.map((work) => {
      const tenure = formatTenure(work.start, work.end, locale);
      const range = formatDateRange(work.start, work.end, locale);
      return {
        company: work.company,
        link: work.link,
        title: work.title,
        dates: tenure ? `${range} · ${tenure}` : range,
        badges: work.badges,
        highlights: work.highlights,
      };
    }),
    educationTitle: labels.education,
    education: resume.education.map((item) => ({
      school: item.school,
      degree: item.degree,
      dates: formatDateRange(item.start, item.end, locale),
    })),
    skillsTitle: labels.skills,
    skillGroups: resume.skillGroups.map((group) => ({
      title: group.title,
      items: group.items.join("  ·  "),
    })),
    certificatesTitle: labels.certificates,
    certificates: resume.certificates.map((certificate) => certificate.title),
    updated: `${labels.updated} ${formatUpdatedAt(resume.updatedAt, locale)}`,
    references: labels.references,
  };
}
