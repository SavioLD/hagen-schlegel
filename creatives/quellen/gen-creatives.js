/* Generates META ad creative HTML files for Hagen & Schlegel – CNC-Dreher.
   Real workshop photo background + brand gradient overlay for text legibility.
   System fonts only. One HTML per file, sized exactly to the canvas so headless
   Chromium can screenshot it 1:1. */
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || '.';
const PHOTODIR = process.argv[3] || '/home/user/hagen-schlegel';

const BRAND = {
  ink900: '#0b2f57', ink800: '#0d3a66', blue: '#0f5aa0', blue2: '#1f7cc0',
  accent: '#f28c1e', line: 'rgba(255,255,255,.18)'
};

function checkIcon(color) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M20 6 9 17l-5-5"/></svg>`;
}
function arrowIcon(color) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:1em;height:1em"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`;
}

function creativeHTML({ w, h, eyebrow, title, titleAccent, sub, chips, cta, bullets, bg, bgpos }) {
  const u = w / 1080;
  const px = n => (n * u).toFixed(1) + 'px';
  const pad = px(80);
  const tall = h >= 1500;
  const showBullets = tall && bullets && bullets.length;
  const bgUrl = 'file://' + encodeURI(path.resolve(PHOTODIR, bg)).replace(/#/g, '%23');
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px;overflow:hidden}
  .stage{position:relative;width:${w}px;height:${h}px;background:${BRAND.ink900};
    font-family:'Liberation Sans','DejaVu Sans',Arial,sans-serif;color:#fff;-webkit-font-smoothing:antialiased}
  .photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${bgpos || 'center'}}
  .ov1{position:absolute;inset:0;background:linear-gradient(180deg,rgba(9,34,58,.58) 0%,rgba(9,34,58,.28) 32%,rgba(7,26,46,.92) 100%)}
  .ov2{position:absolute;inset:0;background:linear-gradient(102deg,rgba(9,34,58,.92) 0%,rgba(9,34,58,.55) 46%,rgba(9,34,58,.08) 100%)}
  .accentbar{position:absolute;left:0;top:0;bottom:0;width:${px(10)};background:${BRAND.accent}}
  .fg{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:${pad}}
  .logo{font-weight:bold;letter-spacing:${px(1.5)};font-size:${px(30)};color:#fff;text-shadow:0 ${px(1)} ${px(10)} rgba(0,0,0,.5)}
  .logo b{color:${BRAND.accent}}
  .logo-sub{font-size:${px(15)};letter-spacing:${px(2)};text-transform:uppercase;color:#bcd6f0;font-weight:bold;margin-top:${px(4)}}
  .mid{display:flex;flex-direction:column;gap:${px(20)}}
  .eyebrow{display:inline-flex;align-items:center;gap:${px(12)};align-self:flex-start;background:rgba(9,34,58,.55);
    border:1px solid ${BRAND.line};border-radius:999px;padding:${px(12)} ${px(22)};font-size:${px(20)};font-weight:bold;
    letter-spacing:${px(2)};text-transform:uppercase;color:#e8f2fc}
  .eyebrow .dot{width:${px(12)};height:${px(12)};border-radius:50%;background:${BRAND.accent};box-shadow:0 0 0 ${px(5)} rgba(242,140,30,.30)}
  h1{font-size:${px(86)};line-height:.98;font-weight:bold;letter-spacing:${px(-2)};
    text-shadow:0 ${px(3)} ${px(26)} rgba(3,14,28,.7);-webkit-text-stroke:${px(0.6)} #fff}
  h1 .acc{color:${BRAND.accent};-webkit-text-stroke:${px(0.6)} ${BRAND.accent}}
  .sub{font-size:${px(30)};line-height:1.3;font-weight:bold;color:#eaf3fc;max-width:${px(800)};text-shadow:0 ${px(2)} ${px(16)} rgba(3,14,28,.75)}
  .bullets{display:flex;flex-direction:column;gap:${px(14)};margin-top:${px(4)}}
  .bullets .b{display:flex;align-items:center;gap:${px(14)};font-size:${px(28)};font-weight:bold;color:#eaf3fc;text-shadow:0 ${px(2)} ${px(12)} rgba(3,14,28,.8)}
  .bullets .b .ic{color:${BRAND.accent};font-size:${px(30)};display:inline-flex;flex:0 0 auto}
  .chips{display:flex;flex-wrap:wrap;gap:${px(12)};margin-top:${px(6)}}
  .chip{display:inline-flex;align-items:center;gap:${px(10)};background:rgba(9,34,58,.55);border:1px solid ${BRAND.line};
    border-radius:${px(12)};padding:${px(14)} ${px(20)};font-size:${px(24)};font-weight:bold;color:#fff}
  .chip .ic{color:${BRAND.accent};font-size:${px(26)};display:inline-flex}
  .cta{display:inline-flex;align-items:center;justify-content:center;gap:${px(14)};align-self:flex-start;background:#fff;
    color:${BRAND.ink900};font-weight:bold;font-size:${px(32)};margin-top:${px(10)};padding:${px(24)} ${px(44)};
    border-radius:${px(16)};letter-spacing:${px(.3)};box-shadow:0 ${px(14)} ${px(38)} rgba(0,0,0,.45)}
  .cta .ic{color:${BRAND.blue};font-size:${px(30)};display:inline-flex}
  .foot{display:flex;align-items:center;gap:${px(16)};font-size:${px(21)};font-weight:bold;color:#cfe0f2;text-shadow:0 ${px(1)} ${px(10)} rgba(0,0,0,.6)}
  .foot .sep{width:${px(6)};height:${px(6)};border-radius:50%;background:#7fb0d6;flex:0 0 auto}
  </style></head><body>
  <div class="stage">
    <img class="photo" src="${bgUrl}" alt="">
    <div class="ov1"></div><div class="ov2"></div><div class="accentbar"></div>
    <div class="fg">
      <div>
        <div class="logo">HAGEN <b>&amp;</b> SCHLEGEL</div>
        <div class="logo-sub">Präzision aus Salem · seit 1969</div>
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

// bg = photo path (relative to PHOTODIR); bgpos = object-position
const jobs = [
  { name: 'creative-cnc-dreher-4x5',        concept: 'role',     w: 1080, h: 1350, bg: 'bilder/34e87377-d4a6-4b28-b464-275f5ea16f77.JPG', bgpos: 'center' },
  { name: 'creative-cnc-dreher-1x1',        concept: 'role',     w: 1080, h: 1080, bg: 'bilder/34e87377-d4a6-4b28-b464-275f5ea16f77.JPG', bgpos: '65% center' },
  { name: 'creative-cnc-dreher-story-9x16', concept: 'role',     w: 1080, h: 1920, bg: 'a16ed5c4-b1e7-4944-8003-6ffebface49a.JPG',        bgpos: 'right center' },
  { name: 'creative-grosse-teile-4x5',      concept: 'bigparts', w: 1080, h: 1350, bg: 'Drehen.JPG',                                       bgpos: 'center' },
  { name: 'creative-benefits-4x5',          concept: 'benefit',  w: 1080, h: 1350, bg: '443de754-5288-4868-9ec9-55374f75f54d.JPG',        bgpos: 'center' },
];

fs.mkdirSync(OUT, { recursive: true });
for (const j of jobs) {
  const c = concepts[j.concept];
  fs.writeFileSync(path.join(OUT, j.name + '.html'), creativeHTML({ w: j.w, h: j.h, ...c, bg: j.bg, bgpos: j.bgpos }));
}
console.log('Wrote', jobs.length, 'creative HTML files to', OUT);
