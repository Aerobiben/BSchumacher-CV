/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  BEWERBUNGSDATEN — Alles anpassen in dieser einen Datei
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Einträge hinzufügen:  Objekt in das Array kopieren und Werte anpassen
 *  Einträge löschen:      Ganzen Block (inkl. Komma) entfernen oder auskommentieren
 *  Sektion ausblenden:    Array leer lassen → Sektion wird nicht angezeigt
 *
 *  Verfügbare Social-Icons: "github" | "linkedin"
 *  (weitere Icons in src/components/icons/ anlegen und in page.tsx eintragen)
 */

export const RESUME_DATA = {
  name: "Ben Schumacher",
  initials: "BS",
  headline: "Auszubildender Fachinformatiker für Systemintegration",
  location: "Köln, Deutschland",
  locationLink: "https://www.google.com/maps/place/Cologne",
  about:
    "21 Jahre · in Köln geboren und aufgewachsen",
  summary:
    "Nach meinem Abitur 2023 habe ich gezielt nach einem Berufsfeld gesucht, das zu meinen Interessen und Fähigkeiten passt, und bin dabei auf die Ausbildung zum Fachinformatiker für Systemintegration gestoßen. Diese verfolge ich seit 2023 mit großem Engagement und werde sie voraussichtlich 2027 abschließen. Besonders reizt mich, wiederkehrende Abläufe zu automatisieren und IT-Werkzeuge so einzusetzen, dass Prozesse effizienter und die tägliche Arbeit einfacher werden. Automatisierung ist für mich mehr als ein Hobby – sie bestimmt meine berufliche Ausrichtung. Deshalb möchte ich auch nach der Ausbildung in einem Umfeld arbeiten, das Raum für diese Leidenschaft lässt.",
  avatarUrl: "https://avatars.githubusercontent.com/u/154968490?v=4",

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
      title: "Auszubildender Fachinformatiker für Systemintegration",
      start: "2023",
      end: "ongoing",
      description:
        "IT-Grundlagen, Netzwerk- und Serveradministration, IT-Sicherheit, Hardware-Einrichtung sowie Support und Wartung von IT-Systemen.",
    },
    {
      company: "Aerobis",
      link: "https://aerobis.com",
      badges: ["Remote"],
      title: "Social Media Manager",
      start: "2023",
      end: "ongoing",
      description:
        "Erstellung von Social-Media-Beiträgen, Anlage und Pflege von Produkten, Produktfotografie sowie Optimierung des Shop-Systems.",
    },
    {
      company: "M. Korfmacher",
      link: "https://www.mkorfmacher.de/",
      badges: [],
      title: "Praktikant",
      start: "2021",
      end: "2021",
      description:
        "Elektrotechnischer Service sowie Heizungs- und Lüftungsservice.",
    },
  ],

  education: [
    {
      school: "Georg-Simon-Ohm-Berufskolleg Köln",
      degree: "Ausbildung zum Fachinformatiker für Systemintegration",
      start: "2024",
      end: "2027",
    },
    {
      school: "Abtei-Gymnasium Brauweiler",
      degree: "Allgemeine Hochschulreife (Abitur)",
      start: "2016",
      end: "2023",
    },
  ],

  skillGroups: [
    {
      title: "Technik",
      items: [
        "Proxmox VE",
        "Python (Grundlagen)",
        "Hardware-Installation und -Konfiguration",
        "Microsoft 365 Administration",
        "IT-Support mit internationalem Kundenkontakt",
        "ITIL 4 Foundation",
        "Prozessautomatisierung",
        "KI-Werkzeuge",
      ],
    },
    {
      title: "Sprachen",
      items: ["Deutsch (Muttersprache)", "Englisch (fließend)"],
    },
    {
      title: "Sonstiges",
      items: ["Führerschein Klasse B"],
    },
  ],

  projects: [
    {
      title: "Private Proxmox-VE-Umgebung",
      description:
        "Homelab mit mehreren virtuellen Maschinen und eigener Cloud, erreichbar über Cloudflare Tunnel und eine eigene Domain.",
      image: "/media/project-1.svg",
    },
    {
      title: "Digitale Bewerbungswebsite",
      description:
        "Passwortgeschützte Bewerbungsseite mit Download-Funktion und responsiver Darstellung für Personalverantwortliche.",
      image: "/media/project-2.svg",
    },
    {
      title: "IT-Automatisierung und Support",
      description:
        "Automatisierung von Support-Workflows mit Python, Monitoring und systemnaher Konfiguration.",
      image: "/media/project-3.svg",
    },
  ],
} as const;
