# Hagen & Schlegel – Karriereseite / Ad-Funnel

Recruiting-Landingpage für die **Hagen & Schlegel GmbH & Co. KG** (Salem am Bodensee).
Aufbau 1:1 an der ALWA-Karriereseite orientiert, umgesetzt im eigenen CI
(Industrieblau) und für die aktuell offene Stelle:

- **CNC-Dreher mit Programmierkenntnissen (m/w/d)**

Vollständig mobil- und conversionoptimiert, mit vorgeschaltetem Bewerber-Funnel
(Vorfilterung) und Anbindung an Leadtable.

## Inhalt

- `index.html` – die komplette Seite (self-contained, keine Build-Schritte nötig)
- `creatives/` – fertige META-Ad-Creatives (PNG) + editierbare Quellen in `creatives/quellen/`
- `bilder/` – Werkstattfotos; `hero.jpg` ist als Hero-Bild gesetzt (Logo optional, siehe `bilder/HIER-BILDER-ABLEGEN.txt`)
- `META-ADS.md` – finale Creatives + Werbetexte + Kampagnen-Setup
- `supabase-bewerbungen.sql` – Storage-Bucket für den optionalen Lebenslauf-Upload
- `.nojekyll` – sorgt dafür, dass GitHub Pages die Dateien 1:1 ausliefert

## Der Funnel (4 Schritte, 3 Qualifizierungsfragen)

1. **Erfahrung** im Bereich Drehen/Zerspanung
2. **Programmierkenntnisse** an CNC-Steuerungen
3. **Technische Zeichnungen** – wie sicher werden sie gelesen
4. **Kontaktdaten** – Vor-/Nachname, Telefon, E-Mail; Lebenslauf optional

**Punkte-Vorfilterung:** Jede der drei Fragen vergibt Punkte (über das
`data-score`-Attribut der Antworten, max. **7**). Liegt die Summe **≤ `REJECT_MAX`**
(Standard **1**), wird die Bewerbung als „alles maximal schlecht" gewertet und
**freundlich abgelehnt** (kein Lead an Leadtable) – ausgelöst nach Frage 3, vor
dem Kontaktschritt. Wer echte Erfahrung oder eine Ausbildung mitbringt, kommt
immer durch. Schwelle in `index.html` über `REJECT_MAX` justierbar
(`0` = nur die absolut schlechteste Kombination wird abgelehnt).

An Leadtable gehen zusätzlich `zeichnungen` und `qualifikation_score` (z. B.
„5 / 7") mit, damit die Bewerberqualität sofort sichtbar ist.

Ein Seiten-Neuladen startet den Funnel frisch (kein dauerhaftes Sperren).

## Leadtable-Anbindung ✅ aktiv

Der Generic-Webhook der Ziel-Kachel ist in `index.html` (Variable `WEBHOOK_URL`)
hinterlegt – Bewerbungen landen direkt in dieser Tabelle:

- Portal: <https://portal.lead-table.com/customer/6a8ec58036bf6549f19284bd/table/6a8ec5a92e3577f5c52e6d53/leads>
- customerID: `6a8ec58036bf6549f19284bd`
- tableID: `6a8ec5a92e3577f5c52e6d53`
- Endpoint: `https://api-v2.lead-table.com/api/webhook/generic/<TOKEN>`

Übergebene Felder: `vorname, nachname, email, telefon, stelle, erfahrung,
programmierung, zeichnungen, qualifikation_score, lebenslauf, datenschutz,
quelle, seite`. (Der Anzeigename wird in Leadtable aus `vorname` + `nachname`
gebildet – ein separates `name`-Feld wird bewusst NICHT gesendet, sonst
erscheint der Name doppelt.)

> Sollte der Token je erneuert werden, einfach die `WEBHOOK_URL` in `index.html`
> ersetzen (im Portal unter Tabelle → Einstellungen/Integrationen → Webhook).

## Lebenslauf-Upload

Der optionale Datei-Upload nutzt den bestehenden Ländle-Digital-Supabase-Bucket
`bewerbungen` (Projekt `kxqdybjkcrowqdcpvlqa`) – derselbe wie bei den anderen
Karriereseiten. Ist der Bucket vorhanden, ist nichts weiter zu tun. Nur bei
einem neuen Supabase-Projekt einmal `supabase-bewerbungen.sql` ausführen.

## Bilder / Logo

`bilder/hero.jpg` ist gesetzt (echtes Werkstattfoto, zwei Kollegen an der
Drehmaschine). Zum Tauschen einfach eine andere Querformat-Datei als
`bilder/hero.jpg` ablegen. Logo optional als `bilder/logo.svg` (farbig) und
`bilder/logo-weiss.svg` (weiß). Details in `bilder/HIER-BILDER-ABLEGEN.txt`.

> Hinweis: In `bilder/` und im Repo-Root liegen zusätzlich die per Upload
> hinzugefügten Original-Fotos (UUID-Dateinamen). Sie stören nicht, können bei
> Bedarf aber aufgeräumt werden – für die Seite genügt `bilder/hero.jpg`.

## META-Ad-Creatives

Fertige Motive im Ordner `creatives/` (Format je Platzierung):

| Datei | Format | Platzierung | Hook |
|---|---|---|---|
| `creative-cnc-dreher-4x5.png` | 1080×1350 | Feed 4:5 | „CNC-Dreher gesucht." |
| `creative-cnc-dreher-1x1.png` | 1080×1080 | Feed 1:1 | „CNC-Dreher gesucht." |
| `creative-cnc-dreher-story-9x16.png` | 1080×1920 | Story/Reels 9:16 | „CNC-Dreher gesucht." |
| `creative-grosse-teile-4x5.png` | 1080×1350 | Feed 4:5 (A/B) | „Bock auf große Teile?" |
| `creative-benefits-4x5.png` | 1080×1350 | Feed 4:5 (A/B) | „Unbefristet. Fair bezahlt." |

Alle Creatives nutzen **echte Werkstattfotos** mit Marken-Farbverlauf. Drei
Hook-Varianten für A/B-Tests. Fotos, Text & Farben lassen sich in
`creatives/quellen/gen-creatives.js` anpassen und mit headless Chromium neu
rendern (`node gen-creatives.js <ausgabeordner> <foto-ordner>` → PNG je HTML).

Die vollständigen **Werbetexte** (Primärtext/Überschrift/Beschreibung je Motiv)
und das Kampagnen-Setup stehen in `META-ADS.md`.

## Deep-Link für die Ad

Die Anzeige verlinkt direkt auf die Seite; der Funnel startet oben. Alle
CTA-Buttons scrollen zum Bewerbungsformular (`#bewerbung`).

## Live schalten

Die Seite ist self-contained und läuft an jedem Pfad – als
`…/kunden/hagen-schlegel/` innerhalb dieses Repos oder 1:1 kopiert im Root eines
eigenen Repos (analog `alwa-gmbh` → `https://<user>.github.io/hagen-schlegel/`).

---

### Hinweise / offene Punkte

- **CI-Farbe:** Als Corporate-Farbe wurde ein Industrieblau gewählt (angelehnt an
  Maschinenpark & Arbeitskleidung). Liegt ein exakter Hex-/Logo-Wert von
  Hagen & Schlegel vor, in `index.html` unter `:root` (`--brand*`) anpassen.
- **Benefits:** Im Briefing kam die Benefit-Liste leer an. Kommuniziert werden
  aktuell branchenübliche, glaubwürdige Vorteile (faire/pünktliche Bezahlung,
  unbefristet, moderner Maschinenpark, Weiterbildung, familiäres Team, Standort
  Bodensee). Bitte final bestätigen/ergänzen.
