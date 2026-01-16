# Human Copy – Intervention (Landingpage B)

Minimalistische Landingpage (Variante B) für den A/B-Test. React + Vite + Tailwind.

## Lokal starten

```bash
npm install
npm run dev
```

Die App läuft standardmäßig auf `http://localhost:5173`.

## Build & Deploy

```bash
npm ci
npm run build
```

Der Deploy läuft automatisch über GitHub Actions (`.github/workflows/deploy.yml`) und veröffentlicht den `dist`-Ordner auf dem Branch `gh-pages`.

## GitHub Pages konfigurieren

1. Repo öffnen → **Settings** → **Pages**.
2. **Source**: `Deploy from a branch`.
3. **Branch**: `gh-pages` und `/ (root)` auswählen.
4. **Custom domain**: `intervention.human-copy.com`.
5. Speichern. GitHub erstellt/validiert die HTTPS-Config.

Die Datei `public/CNAME` sorgt dafür, dass beim Build die Custom Domain in den Deploy übernommen wird.

## DNS Setup (intervention.human-copy.com)

1. Beim DNS-Provider einen **CNAME** Record anlegen:
   - **Host/Name**: `intervention`
   - **Target**: `<USERNAME>.github.io`
2. Warten, bis die DNS-Änderung propagiert ist (typisch einige Minuten bis Stunden).
3. In GitHub Pages prüfen, ob die Domain validiert ist und HTTPS aktiv ist.

## Google Ads A/B-Test (50/50)

In Google Ads zwei Final URLs hinterlegen und den Traffic splitten:
- Variante A: bestehende Hauptseite (Repo A)
- Variante B: `https://intervention.human-copy.com/`

## GA4 (optional)

Das GA4-Snippet wird **nur** geladen, wenn `VITE_GA4_ID` gesetzt ist.

Lokal:

```bash
VITE_GA4_ID=G-XXXXXXXXXX npm run dev
```

In GitHub Actions:
1. Repo → **Settings** → **Secrets and variables** → **Actions**.
2. `VITE_GA4_ID` als **Repository Secret** oder **Variable** anlegen.
3. Das Vite Build nimmt die Variable automatisch in `index.html` auf.
