/* Generates META ad creative HTML files for Hagen & Schlegel – CNC-Dreher.
   Self-contained (system fonts only, no external fetch). One HTML per file,
   sized exactly to the canvas so headless Chromium can screenshot it 1:1. */
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || '.';

const BRAND = {
  ink900: '#0b2f57', ink800: '#0d3a66', blue: '#0f5aa0', blue2: '#1f7cc0',
  accent: '#f28c1e', soft: '#e7f0fa', line: 'rgba(255,255,255,.16)'
};

// SVG decorative "lathe chuck / gear ring" motif + blueprint grid + spark.
function decoSvg(w, h) {
  const cx = w * 0.80, cy = h * 0.30, R = w * 0.42;
  const teeth = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r1 = R * 0.86, r2 = R * 0.98;
    teeth.push(`<line x1="${cx + Math.cos(a) * r1}" y1="${cy + Math.sin(a) * r1}" x2="${cx + Math.cos(a) * r2}" y2="${cy + Math.sin(a) * r2}" stroke="rgba(255,255,255,.10)" stroke-width="6"/>`);
  }
  return `
  <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg" style="position:absolute;inset:0">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${BRAND.ink900}"/>
        <stop offset="0.5" stop-color="${BRAND.ink800}"/>
        <stop offset="1" stop-color="#12558c"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.8" cy="0.28" r="0.7">
        <stop offset="0" stop-color="${BRAND.blue2}" stop-opacity="0.55"/>
        <stop offset="1" stop-color="${BRAND.blue2}" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse">
        <path d="M46 0H0V46" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect width="${w}" height="${h}" fill="url(#grid)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    <g>
      ${teeth.join('')}
      <circle cx="${cx}" cy="${cy}" r="${R * 0.86}" stroke="rgba(255,255,255,.10)" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy}" r="${R * 0.60}" stroke="rgba(255,255,255,.09)" stroke-width="2"/>
      <circle cx="${cx}" cy="${cy}" r="${R * 0.30}" stroke="rgba(255,255,255,.12)" stroke-width="3"/>
      <circle cx="${cx}" cy="${cy}" r="${R * 0.10}" fill="rgba(255,255,255,.06)"/>
      <!-- chuck jaws -->
      ${[0, 120, 240].map(d => {
        const a = d * Math.PI / 180;
        const rr = R * 0.30;
        const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
        return `<rect x="${x - 26}" y="${y - 26}" width="52" height="52" rx="8" transform="rotate(${d} ${x} ${y})" fill="rgba(255,255,255,.07)" stroke="rgba(255,255,255,.14)" stroke-width="2"/>`;
      }).join('')}
    </g>
  </svg>`;
}

function checkIcon(color) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M20 6 9 17l-5-5"/></svg>`;
}
function arrowIcon(color) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
}

function creativeHTML({ w, h, eyebrow, title, titleAccent, sub, chips, cta, bullets }) {
  const u = w / 1080;               // scale unit
  const px = n => (n * u).toFixed(1) + 'px';
  const pad = px(84);
  const tall = h >= 1500;           // 9:16 story
  const showBullets = tall && bullets && bullets.length;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px;overflow:hidden}
  .stage{position:relative;width:${w}px;height:${h}px;background:${BRAND.ink900};
    font-family:'Liberation Sans','DejaVu Sans',Arial,sans-serif;color:#fff;
    -webkit-font-smoothing:antialiased}
  .fg{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;
    padding:${pad}}
  .top{display:flex;align-items:center;gap:${px(14)}}
  .logo{font-weight:bold;letter-spacing:${px(1.5)};font-size:${px(30)};color:#fff}
  .logo b{color:${BRAND.accent}}
  .logo-sub{font-size:${px(15)};letter-spacing:${px(2)};text-transform:uppercase;color:#a9d0ee;font-weight:bold;margin-top:${px(4)}}
  .eyebrow{display:inline-flex;align-items:center;gap:${px(12)};align-self:flex-start;
    background:rgba(255,255,255,.08);border:1px solid ${BRAND.line};border-radius:999px;
    padding:${px(12)} ${px(22)};font-size:${px(20)};font-weight:bold;letter-spacing:${px(2)};
    text-transform:uppercase;color:#cfe4f7}
  .eyebrow .dot{width:${px(12)};height:${px(12)};border-radius:50%;background:${BRAND.accent};
    box-shadow:0 0 0 ${px(5)} rgba(242,140,30,.28)}
  .mid{display:flex;flex-direction:column;gap:${px(20)}}
  h1{font-size:${px(84)};line-height:.98;font-weight:bold;letter-spacing:${px(-2)};
    text-shadow:0 ${px(2)} ${px(24)} rgba(4,20,38,.55);-webkit-text-stroke:${px(0.6)} #fff}
  h1 .acc{color:${BRAND.accent};-webkit-text-stroke:${px(0.6)} ${BRAND.accent}}
  .sub{font-size:${px(30)};line-height:1.3;font-weight:bold;color:#e2eefb;max-width:${px(780)}}
  .bullets{display:flex;flex-direction:column;gap:${px(14)};margin-top:${px(4)}}
  .bullets .b{display:flex;align-items:center;gap:${px(14)};font-size:${px(28)};font-weight:bold;color:#eaf3fc}
  .bullets .b .ic{color:${BRAND.accent};font-size:${px(30)};display:inline-flex;flex:0 0 auto}
  .chips{display:flex;flex-wrap:wrap;gap:${px(12)};margin-top:${px(6)}}
  .chip{display:inline-flex;align-items:center;gap:${px(10)};background:rgba(255,255,255,.10);
    border:1px solid ${BRAND.line};border-radius:${px(12)};padding:${px(14)} ${px(20)};
    font-size:${px(24)};font-weight:bold;color:#fff}
  .chip .ic{color:${BRAND.accent};font-size:${px(26)};display:inline-flex}
  .cta{display:inline-flex;align-items:center;justify-content:center;gap:${px(14)};align-self:flex-start;
    background:#fff;color:${BRAND.ink900};font-weight:bold;font-size:${px(32)};margin-top:${px(10)};
    padding:${px(24)} ${px(44)};border-radius:${px(16)};letter-spacing:${px(.3)};
    box-shadow:0 ${px(14)} ${px(36)} rgba(0,0,0,.28)}
  .cta .ic{color:${BRAND.blue};font-size:${px(30)};display:inline-flex}
  .foot{display:flex;align-items:center;gap:${px(16)};font-size:${px(21)};font-weight:bold;color:#bcd6f0}
  .foot .sep{width:${px(6)};height:${px(6)};border-radius:50%;background:#7fb0d6;flex:0 0 auto}
  </style></head><body>
  <div class="stage">
    ${decoSvg(w, h)}
    <div class="fg">
      <div class="top">
        <div>
          <div class="logo">HAGEN <b>&amp;</b> SCHLEGEL</div>
          <div class="logo-sub">Präzision aus Salem · seit 1969</div>
        </div>
      </div>
      <div class="mid">
        <span class="eyebrow"><span class="dot"></span>${eyebrow}</span>
        <h1>${title}${titleAccent ? `<br><span class="acc">${titleAccent}</span>` : ''}</h1>
        <div class="sub">${sub}</div>
        ${showBullets ? `<div class="bullets">${bullets.map(b => `<div class="b"><span class="ic">${checkIcon(BRAND.accent)}</span>${b}</div>`).join('')}</div>` : ''}
        <div class="chips">${chips.map(c => `<span class="chip"><span class="ic">${checkIcon(BRAND.accent)}</span>${c}</span>`).join('')}</div>
        <span class="cta">${cta}<span class="ic">${arrowIcon(BRAND.blue)}</span></span>
      </div>
      <div class="foot">Salem am Bodensee<span class="sep"></span>Vollzeit · unbefristet<span class="sep"></span>hagen-salem.de</div>
    </div>
  </div></body></html>`;
}

const CHIPS = ['Unbefristet', 'Faire Bezahlung', 'Moderne Maschinen'];

const concepts = {
  role: {
    eyebrow: 'M/W/D · Vollzeit · Unbefristet',
    title: 'CNC-Dreher', titleAccent: 'gesucht.',
    sub: 'Mit Programmier­kenntnissen. Werde Teil unseres Teams in Salem und dreh an Bauteilen bis Ø&nbsp;2100&nbsp;mm.',
    chips: CHIPS, cta: 'In 60 Sek. bewerben',
    bullets: ['Eigene CNC-Programme schreiben', 'Große &amp; schwere Präzisionsteile', 'Familienbetrieb seit 1969']
  },
  bigparts: {
    eyebrow: 'Zerspanung XXL · Bodensee',
    title: 'Bock auf', titleAccent: 'große Teile?',
    sub: 'Wir drehen bis Ø&nbsp;2100&nbsp;mm und 5&nbsp;t. Für unsere CNC-Drehmaschinen suchen wir dich: CNC-Dreher (m/w/d).',
    chips: ['Bis Ø 2100 mm', 'Bis 5 t', 'Seit 1969'], cta: 'Jetzt bewerben',
    bullets: ['Rüsten, Programmieren, Drehen', 'Moderner Maschinenpark', 'Unbefristet &amp; fair bezahlt']
  },
  benefit: {
    eyebrow: 'Dein neuer Job am Bodensee',
    title: 'Unbefristet.', titleAccent: 'Fair bezahlt.',
    sub: 'CNC-Dreher mit Programmier­kenntnissen (m/w/d) – moderner Maschinenpark, familiäres Team, sofortiger Einstieg.',
    chips: ['Ohne Anschreiben', 'Lebenslauf optional', 'Antwort persönlich'], cta: 'In 60 Sek. bewerben',
    bullets: ['Faire, pünktliche Bezahlung', 'Moderne CNC-Drehmaschinen', 'Kurze Wege, echtes Team']
  }
};

const jobs = [
  { name: 'creative-cnc-dreher-4x5',          concept: 'role',     w: 1080, h: 1350 },
  { name: 'creative-cnc-dreher-1x1',          concept: 'role',     w: 1080, h: 1080 },
  { name: 'creative-cnc-dreher-story-9x16',   concept: 'role',     w: 1080, h: 1920 },
  { name: 'creative-grosse-teile-4x5',        concept: 'bigparts', w: 1080, h: 1350 },
  { name: 'creative-benefits-4x5',            concept: 'benefit',  w: 1080, h: 1350 },
];

fs.mkdirSync(OUT, { recursive: true });
const manifest = [];
for (const j of jobs) {
  const c = concepts[j.concept];
  const html = creativeHTML({ w: j.w, h: j.h, ...c });
  const f = path.join(OUT, j.name + '.html');
  fs.writeFileSync(f, html);
  manifest.push({ file: f, png: path.join(OUT, j.name + '.png'), w: j.w, h: j.h });
}
fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Wrote', manifest.length, 'creative HTML files to', OUT);
