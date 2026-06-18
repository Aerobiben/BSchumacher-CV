# Ben Schumacher — CV

Eine minimalistische, druckfreundliche Bewerbungswebsite mit optionalem Passwortschutz und Dark Mode.

Gebaut mit Next.js 14, React, TypeScript, Tailwind CSS und shadcn/ui — deployed auf Vercel.

## Features

- **Eine Konfigurationsdatei**: Alle Inhalte werden in [`src/data/resume-data.ts`](./src/data/resume-data.ts) gepflegt.
- **Dark Mode** mit System-Erkennung und ohne Aufblitzen beim Laden.
- **Passwortschutz** über Middleware + serverseitige Auth-Route.
- **Druck-/PDF-optimiertes Layout** sowie ein Command-Menü (⌘/Strg + J).
- Responsive für unterschiedliche Geräte.

## Entwicklung

```bash
yarn install
yarn dev
```

Die App läuft anschließend auf http://localhost:3000.

## Umgebungsvariablen

Lege eine `.env.local` an (siehe [`.env.example`](./.env.example)):

```bash
CV_PASSWORD=dein-passwort
```

- `CV_PASSWORD` ist das Passwort für den Zugriff auf die Seite.
- Wird die Variable nicht gesetzt, antwortet die Auth-Route mit HTTP 500.

## Inhalte anpassen

Sämtliche Texte (Name, Kontakt, Berufserfahrung, Ausbildung, Skills, Projekte)
werden ausschließlich in [`src/data/resume-data.ts`](./src/data/resume-data.ts)
gepflegt. Leere Arrays blenden die jeweilige Sektion automatisch aus.

## Deployment auf Vercel

1. Repository auf Vercel importieren (Framework wird automatisch als **Next.js** erkannt).
2. Unter **Settings → Environment Variables** die Variable `CV_PASSWORD` setzen
   (für alle Environments: Production, Preview, Development).
3. Deployen — es ist keine weitere Konfiguration nötig.
