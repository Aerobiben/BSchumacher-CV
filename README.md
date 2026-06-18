# Ben Schumacher — CV

Eine minimalistische, druckfreundliche Bewerbungswebsite mit optionalem Passwortschutz und Dark Mode.

Gebaut mit Next.js 14, React, TypeScript, Tailwind CSS und shadcn/ui — deployed auf Vercel.

## Features

- **Eine Konfigurationsdatei**: Alle Inhalte werden in [`src/data/resume-data.ts`](./src/data/resume-data.ts) gepflegt.
- **Dark Mode** mit System-Erkennung und ohne Aufblitzen beim Laden.
- **Passwortschutz** über Middleware + serverseitige Auth-Route. Das Passwort wird ausschließlich als **SHA-256-Hash** geprüft — es liegt nirgendwo im Klartext vor.
- **Druck-/PDF-optimiertes Layout** sowie ein Command-Menü (⌘/Strg + J).
- Responsive für unterschiedliche Geräte.

## Entwicklung

```bash
yarn install
yarn dev
```

Die App läuft anschließend auf http://localhost:3000.

## Passwortschutz

Das Zugriffspasswort wird **niemals im Klartext** gespeichert — weder im Code
noch in einer `.env`-Datei. Stattdessen liegt in
[`src/app/api/auth/route.ts`](./src/app/api/auth/route.ts) nur der
**SHA-256-Hash** des Passworts. Bei der Anmeldung wird die Eingabe gehasht und
zeitkonstant mit diesem Hash verglichen (Schutz vor Timing-Angriffen).

Passwort ändern (Beispiel mit PowerShell):

```powershell
[System.BitConverter]::ToString([System.Security.Cryptography.SHA256]::Create().ComputeHash([System.Text.Encoding]::UTF8.GetBytes('NEUES-PASSWORT'))).Replace('-','').ToLower()
```

Den ausgegebenen Hash anschließend als `PASSWORD_HASH` in der Auth-Route
hinterlegen — oder optional über die Umgebungsvariable `CV_PASSWORD_HASH`
(ebenfalls nur der Hash, kein Klartext) setzen.

## Inhalte anpassen

Sämtliche Texte (Name, Kontakt, Berufserfahrung, Ausbildung, Skills, Projekte)
werden ausschließlich in [`src/data/resume-data.ts`](./src/data/resume-data.ts)
gepflegt. Leere Arrays blenden die jeweilige Sektion automatisch aus.

## Deployment auf Vercel

1. Repository auf Vercel importieren (Framework wird automatisch als **Next.js** erkannt).
2. Optional unter **Settings → Environment Variables** die Variable
   `CV_PASSWORD_HASH` (SHA-256-Hash, kein Klartext) setzen, falls das Passwort
   ohne Code-Änderung überschrieben werden soll.
3. Deployen — es ist keine weitere Konfiguration nötig.
