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

// ─── Persönliche Daten ───────────────────────────────────────────────────────

export const RESUME_DATA = {
  name: "Ben Schumacher",
  initials: "BS", // Fallback für Avatar, falls Bild nicht lädt
  location: "Cologne, Germany,",
  locationLink: "https://www.google.com/maps/place/Cologne",
  about:
    "Nach erfolgreichem Abschluss meines Abiturs in 2023 habe ich nach beruflichen Perspektiven gesucht, die meinen Interessen und Fähigkeiten entsprechen. Dabei bin ich auf den Ausbildungsberuf des Fachinformatikers gestoßen.",
  summary:
    "Ich bin fasziniert von Software, Apps und Technologie, wie man mit Innovativen Lösungen das Leben von Menschen wie auch Unternehmen so viel einfacher und besser machen kann.Während meiner dreijährigen Teilnahme am Informatikkurs habe ich grundlegende Kenntnisse in Java und Python erworben.Ein Einblick in das Berufsfeld wäre für mich Gold wert!",
  avatarUrl: "https://avatars.githubusercontent.com/u/154968490?v=4",

  // ─── Kontakt ─────────────────────────────────────────────────────────────
  // email/tel leer lassen ("") → Button wird ausgeblendet

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
      // Neues Social-Medium hinzufügen:
      // { name: "X", url: "https://x.com/...", icon: "x" as const },
    ],
  },

  // ─── Berufserfahrung ─────────────────────────────────────────────────────
  // Neueste Stelle zuerst. Block kopieren zum Hinzufügen, Block löschen zum Entfernen.
  // badges: [] wenn keine Tags nötig (z.B. "Remote", "Vollzeit")
  // end: "ongoing" für aktuelle Stelle

  work: [
    {
      company: "Aerobis",
      link: "https://aerobis.com",
      badges: ["Remote"],
      title: "Social Media Manager",
      start: "2023",
      end: "ongoing",
      description:
        "Social Media Beiträge, Anlage und Pflege von Produkten, Fotografie und Optimierung, Optimierung des Shop-Systems",
    },
    {
      company: "Inverto GmbH",
      link: "https://www.inverto.de/",
      badges: [],
      title: "Azubi Fachinformatiker für Systemintegration",
      start: "2023",
      end: "ongoing",
      description:
        "Grundlagen der IT, Netzwerkadministration, Serveradministration, IT-Sicherheit, Hardware einrichtung, Support und Wartung von IT-Systemen",
    },
    {
      company: "M.Korfmacher",
      link: "https://www.mkorfmacher.de/",
      badges: [],
      title: "Praktikant",
      start: "2021",
      end: "2021",
      description:
        "Elektrotechnischer Service, Heizungs und Lüfter Service",
    },
  ],

  // ─── Ausbildung ──────────────────────────────────────────────────────────

  education: [
    {
      school: "Abtei-Gymnasium Brauweiler",
      degree: "Abitur",
      start: "2016",
      end: "2023",
    },
    // Weitere Ausbildung:
    // { school: "...", degree: "...", start: "...", end: "..." },
  ],

  // ─── Skills ──────────────────────────────────────────────────────────────
  // Ein Skill pro Zeile. Zeile löschen oder auskommentieren zum Entfernen.

  skills: [
    "Proxmox VE Umgebung",
    "Python(Grundlagen)",
    "Konfiguration und Installation von neuen Hardware Komponenten",
    "Microsoft 365 Administration",
    "IT Support mit internationalem Kundenkontakt",
    "ITIL 4 Foundation Zertifizierung",
    "Erfahrung mit diversen KI Tools",
    "Automatisierung von Prozessen",
    "Führerschein Klasse B",
  ],

  // ─── Projekte (optional) ─────────────────────────────────────────────────
  // Array leer lassen ([]) → Projekte-Sektion wird nicht angezeigt

  projects: [
    "Private Proxmox VE Umgebung mit mehreren virtuellen Maschinen und eigener Cloud erreichbar über Cloudflare Tunnel und eigener Domain",
    "Digitale Bewerbungswebsite",
  ],
} as const;
