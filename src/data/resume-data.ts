/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  BEWERBUNGSDATEN — Alles anpassen in dieser einen Datei
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Texte können als String oder zweisprachig als { de, en } hinterlegt werden.
 *  Einträge hinzufügen:  Objekt in das Array kopieren und Werte anpassen
 *  Einträge löschen:      Ganzen Block (inkl. Komma) entfernen oder auskommentieren
 *  Sektion ausblenden:    Array leer lassen → Sektion wird nicht angezeigt
 *
 *  Verfügbare Social-Icons: "github" | "linkedin"
 *  (weitere Icons in src/components/icons/ anlegen und in page.tsx eintragen)
 */

import { t, type Locale, type LocalizedText } from "@/lib/locale";

export const RESUME_DATA = {
  name: "Ben Schumacher",
  initials: "BS",
  headline: {
    de: "Auszubildender Fachinformatiker für Systemintegration",
    en: "IT Specialist for System Integration (Apprentice)",
  },
  location: {
    de: "Köln, Deutschland",
    en: "Cologne, Germany",
  },
  locationLink: "https://www.google.com/maps/place/Cologne",
  about: {
    de: "21 Jahre · in Köln geboren und aufgewachsen",
    en: "Age 21 · born and raised in Cologne",
  },
  availability: {
    de: "Ausbildung bis 2027 · offen für Übernahme",
    en: "Apprenticeship until 2027 · open to a permanent role",
  },
  summary: {
    de: "Nach meinem Abitur 2023 habe ich gezielt nach einem Berufsfeld gesucht, das zu meinen Interessen und Fähigkeiten passt, und bin dabei auf die Ausbildung zum Fachinformatiker für Systemintegration gestoßen. Diese verfolge ich seit 2023 mit großem Engagement und werde sie voraussichtlich 2027 abschließen. Besonders reizt mich, wiederkehrende Abläufe zu automatisieren und IT-Werkzeuge so einzusetzen, dass Prozesse effizienter und die tägliche Arbeit einfacher werden. Automatisierung ist für mich mehr als ein Hobby – sie bestimmt meine berufliche Ausrichtung. Deshalb möchte ich auch nach der Ausbildung in einem Umfeld arbeiten, das Raum für diese Leidenschaft lässt.",
    en: "After finishing school in 2023 I looked for a field that matched my interests and strengths, and found it in an apprenticeship as an IT specialist for system integration. I have been pursuing that path since 2023 and expect to complete it in 2027. What draws me most is automating recurring work and using IT tools so that processes run more efficiently and day-to-day work gets easier. Automation is more than a side interest for me — it shapes how I want to work. After the apprenticeship I want to stay in an environment that leaves room for that focus.",
  },
  avatarUrl: "https://avatars.githubusercontent.com/u/154968490?v=4",
  updatedAt: "2026-09",

  contact: {
    email: "bschumis@outlook.com",
    tel: "+4915140307927",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/Aerobiben",
        icon: "github" as const,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/ben-schumacher-445493194",
        icon: "linkedin" as const,
      },
    ],
  },

  work: [
    {
      company: "Inverto GmbH",
      link: "https://www.inverto.de/",
      badges: [],
      title: {
        de: "Auszubildender Fachinformatiker für Systemintegration",
        en: "IT Specialist for System Integration (Apprentice)",
      },
      start: "2023",
      end: "ongoing",
      highlights: [
        {
          de: "IT-Grundlagen, Netzwerk- und Serveradministration sowie IT-Sicherheit",
          en: "IT fundamentals, network and server administration, and IT security",
        },
        {
          de: "Hardware-Einrichtung sowie Support und Wartung von IT-Systemen",
          en: "Hardware setup plus support and maintenance of IT systems",
        },
        {
          de: "Wiederkehrende Abläufe mit Automatisierung und IT-Werkzeugen effizienter machen",
          en: "Making recurring processes more efficient with automation and IT tools",
        },
      ],
    },
    {
      company: "Aerobis",
      link: "https://aerobis.com",
      badges: [{ de: "Remote", en: "Remote" }],
      title: {
        de: "Social Media Manager",
        en: "Social Media Manager",
      },
      start: "2023",
      end: "ongoing",
      highlights: [
        {
          de: "Erstellung von Social-Media-Beiträgen",
          en: "Creating social media posts",
        },
        {
          de: "Anlage und Pflege von Produkten sowie Produktfotografie",
          en: "Adding and maintaining products, including product photography",
        },
        {
          de: "Optimierung des Shop-Systems",
          en: "Improving the shop system",
        },
      ],
    },
    {
      company: "M. Korfmacher",
      link: "https://www.mkorfmacher.de/",
      badges: [],
      title: {
        de: "Praktikant",
        en: "Intern",
      },
      start: "2021",
      end: "2021",
      highlights: [
        {
          de: "Elektrotechnischer Service sowie Heizungs- und Lüftungsservice",
          en: "Electrical service as well as heating and ventilation work",
        },
      ],
    },
  ],

  education: [
    {
      school: "Georg-Simon-Ohm-Berufskolleg Köln",
      degree: {
        de: "Ausbildung zum Fachinformatiker für Systemintegration",
        en: "Apprenticeship as IT specialist for system integration",
      },
      start: "2024",
      end: "2027",
    },
    {
      school: "Abtei-Gymnasium Brauweiler",
      degree: {
        de: "Allgemeine Hochschulreife (Abitur)",
        en: "General university entrance qualification (Abitur)",
      },
      start: "2016",
      end: "2023",
    },
  ],

  skillGroups: [
    {
      title: { de: "Technik", en: "Technical" },
      items: [
        "Proxmox VE",
        { de: "Python (Grundlagen)", en: "Python (fundamentals)" },
        {
          de: "Hardware-Installation und -Konfiguration",
          en: "Hardware installation and configuration",
        },
        "Microsoft 365 Administration",
        {
          de: "IT-Support mit internationalem Kundenkontakt",
          en: "IT support with international customer contact",
        },
        "ITIL 4 Foundation",
        { de: "Prozessautomatisierung", en: "Process automation" },
        { de: "KI-Werkzeuge", en: "AI tools" },
      ],
    },
    {
      title: { de: "Sprachen", en: "Languages" },
      items: [
        { de: "Deutsch (Muttersprache)", en: "German (native)" },
        { de: "Englisch (fließend)", en: "English (fluent)" },
      ],
    },
    {
      title: { de: "Sonstiges", en: "Other" },
      items: [
        { de: "Führerschein Klasse B", en: "Driving licence class B" },
      ],
    },
  ],

  certificates: [
    {
      title: "ITIL 4 Foundation",
      file: "/media/ITIL-Cert.png",
      downloadName: "ITIL-4-Foundation.png",
    },
  ],

  projects: [
    {
      title: {
        de: "Private Proxmox-VE-Umgebung",
        en: "Private Proxmox VE environment",
      },
      description: {
        de: "Homelab mit mehreren virtuellen Maschinen und eigener Cloud, erreichbar über Cloudflare Tunnel und eine eigene Domain.",
        en: "Homelab with several virtual machines and a private cloud, reachable through a Cloudflare Tunnel and a custom domain.",
      },
      image: "/media/project-1.svg",
      tags: ["Proxmox VE", "Cloudflare Tunnel", "Linux"],
    },
    {
      title: {
        de: "Digitale Bewerbungswebsite",
        en: "Digital application website",
      },
      description: {
        de: "Passwortgeschützte Bewerbungsseite mit Download-Funktion und responsiver Darstellung für Personalverantwortliche.",
        en: "Password-protected application site with download options and a responsive layout for hiring managers.",
      },
      image: "/media/project-2.svg",
      link: "https://github.com/Aerobiben/BSchumacher-CV",
      tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      title: {
        de: "IT-Automatisierung und Support",
        en: "IT automation and support",
      },
      description: {
        de: "Automatisierung von Support-Workflows mit Python, Monitoring und systemnaher Konfiguration.",
        en: "Automation of support workflows with Python, monitoring, and systems-level configuration.",
      },
      image: "/media/project-3.svg",
      tags: ["Python", { de: "Automatisierung", en: "Automation" }, "Monitoring"],
    },
  ],
} as const satisfies {
  name: string;
  initials: string;
  headline: LocalizedText;
  location: LocalizedText;
  locationLink: string;
  about: LocalizedText;
  availability: LocalizedText;
  summary: LocalizedText;
  avatarUrl: string;
  updatedAt: string;
  contact: {
    email: string;
    tel: string;
    social: readonly { name: string; url: string; icon: "github" | "linkedin" }[];
  };
  work: readonly {
    company: string;
    link: string;
    badges: readonly LocalizedText[];
    title: LocalizedText;
    start: string;
    end: string;
    highlights: readonly LocalizedText[];
  }[];
  education: readonly {
    school: string;
    degree: LocalizedText;
    start: string;
    end: string;
  }[];
  skillGroups: readonly {
    title: LocalizedText;
    items: readonly LocalizedText[];
  }[];
  certificates: readonly {
    title: string;
    file: string;
    downloadName: string;
  }[];
  projects: readonly {
    title: LocalizedText;
    description: LocalizedText;
    image: string;
    link?: string;
    tags: readonly LocalizedText[];
  }[];
};

function localizeList(items: readonly LocalizedText[], locale: Locale) {
  return items.map((item) => t(item, locale));
}

export function getResume(locale: Locale) {
  return {
    name: RESUME_DATA.name,
    initials: RESUME_DATA.initials,
    headline: t(RESUME_DATA.headline, locale),
    location: t(RESUME_DATA.location, locale),
    locationLink: RESUME_DATA.locationLink,
    about: t(RESUME_DATA.about, locale),
    availability: t(RESUME_DATA.availability, locale),
    summary: t(RESUME_DATA.summary, locale),
    avatarUrl: RESUME_DATA.avatarUrl,
    updatedAt: RESUME_DATA.updatedAt,
    contact: RESUME_DATA.contact,
    work: RESUME_DATA.work.map((work) => ({
      company: work.company,
      link: work.link,
      start: work.start,
      end: work.end,
      title: t(work.title, locale),
      badges: localizeList(work.badges, locale),
      highlights: localizeList(work.highlights, locale),
    })),
    education: RESUME_DATA.education.map((education) => ({
      school: education.school,
      start: education.start,
      end: education.end,
      degree: t(education.degree, locale),
    })),
    skillGroups: RESUME_DATA.skillGroups.map((group) => ({
      title: t(group.title, locale),
      items: localizeList(group.items, locale),
    })),
    certificates: RESUME_DATA.certificates.map((certificate) => ({
      title: certificate.title,
      file: certificate.file,
      downloadName: certificate.downloadName,
    })),
    projects: RESUME_DATA.projects.map((project) => ({
      title: t(project.title, locale),
      description: t(project.description, locale),
      image: project.image,
      link: "link" in project ? project.link : undefined,
      tags: localizeList(project.tags, locale),
    })),
  };
}

export type Resume = ReturnType<typeof getResume>;
