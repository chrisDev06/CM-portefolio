/**
 * Génère les mockups d'interface des modèles dans public/models/<id>/.
 *
 * Ce sont des maquettes, pas des captures : chaque fichier est destiné à être
 * remplacé par la capture réelle de la démo déployée (docs/ASSETS.md §4).
 * Lancer avec : node scripts/generate-model-mockups.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const W = 1600;
const H = 1000;
const MW = 390;
const MH = 844;

/* --- Palettes ------------------------------------------------------------- */

const SPECS = {
  "horizon-travel": {
    name: "Horizon Travel",
    bg: "#0B1220",
    panel: "#121B2E",
    line: "#1E2A42",
    ink: "#E8EDF7",
    muted: "#7E8CA8",
    accent: "#F2994A",
    accent2: "#E85D75",
    media: ["#1B2B4A", "#F2994A"],
    desktop: "webHero",
    mobile: "mobileWeb",
    features: ["webDetail", "webForm"],
    prices: ["1 890 €", "2 450 €", "3 200 €", "980 €"],
  },
  fitzone: {
    name: "FitZone",
    bg: "#0A0A0F",
    panel: "#14141D",
    line: "#232334",
    ink: "#F2F2F7",
    muted: "#8A8AA0",
    accent: "#C4F042",
    accent2: "#7C3AED",
    media: ["#1A1A28", "#C4F042"],
    desktop: "appShowcase",
    mobile: "appScreen",
    features: ["dashboard", "webDetail"],
    prices: ["68 %", "1 240", "42 min", "7 j"],
  },
  soundwave: {
    name: "SoundWave",
    bg: "#0C0C0E",
    panel: "#16161A",
    line: "#26262E",
    ink: "#F4F4F5",
    muted: "#8B8B96",
    accent: "#F5A524",
    accent2: "#D946EF",
    media: ["#1C1C22", "#F5A524"],
    desktop: "shopGrid",
    mobile: "mobileWeb",
    features: ["webDetail", "webForm"],
    prices: ["249 €", "389 €", "1 290 €", "79 €"],
  },
  greenenergy: {
    name: "GreenEnergy",
    bg: "#07120F",
    panel: "#0F1D19",
    line: "#1B2F28",
    ink: "#E9F5F0",
    muted: "#7B9A90",
    accent: "#34D399",
    accent2: "#A3E635",
    media: ["#12241E", "#34D399"],
    desktop: "dashboard",
    mobile: "mobileWeb",
    features: ["webDetail", "webForm"],
    prices: ["12,4 kW", "98 %", "34", "2,1 t"],
  },
};

/* --- Primitives ----------------------------------------------------------- */

const rect = (x, y, w, h, fill, rx = 0, opacity = 1) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"${
    opacity === 1 ? "" : ` opacity="${opacity}"`
  }/>`;

const bar = (s, x, y, w, h = 10, opacity = 0.55) =>
  rect(x, y, w, h, s.ink, h / 2, opacity);

const text = (s, x, y, content, size = 20, fill, weight = 500, anchor = "start") =>
  `<text x="${x}" y="${y}" font-family="Inter, system-ui, sans-serif" font-size="${size}" font-weight="${weight}" fill="${
    fill ?? s.ink
  }" text-anchor="${anchor}">${content}</text>`;

const circle = (cx, cy, r, fill, opacity = 1) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"${
    opacity === 1 ? "" : ` opacity="${opacity}"`
  }/>`;

const pill = (s, x, y, w, h, fill) => rect(x, y, w, h, fill, h / 2);

/** Zone photo : dégradé + halo, pour évoquer une image sans en inventer une. */
const media = (s, x, y, w, h, rx = 16, id = "m") => `
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#grad-${id})"/>
  <circle cx="${x + w * 0.72}" cy="${y + h * 0.3}" r="${h * 0.28}" fill="${
    s.accent
  }" opacity="0.28"/>
  <path d="M${x} ${y + h * 0.72} L${x + w * 0.28} ${y + h * 0.46} L${
    x + w * 0.52
  } ${y + h * 0.66} L${x + w * 0.78} ${y + h * 0.38} L${x + w} ${
    y + h * 0.58
  } L${x + w} ${y + h} L${x} ${y + h} Z" fill="${s.accent2}" opacity="0.22"/>
  <path d="M${x} ${y + h * 0.84} L${x + w * 0.34} ${y + h * 0.6} L${
    x + w * 0.62
  } ${y + h * 0.78} L${x + w} ${y + h * 0.66} L${x + w} ${y + h} L${x} ${
    y + h
  } Z" fill="${s.bg}" opacity="0.5"/>
`;

const defs = (s) => `
<defs>
  <linearGradient id="grad-m" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${s.media[0]}"/>
    <stop offset="100%" stop-color="${s.media[1]}" stop-opacity="0.55"/>
  </linearGradient>
  <linearGradient id="grad-cta" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${s.accent}"/>
    <stop offset="100%" stop-color="${s.accent2}"/>
  </linearGradient>
</defs>`;

/* --- Fragments communs ---------------------------------------------------- */

function topbar(s, width = W) {
  const navX = 360;
  return `
    ${rect(0, 0, width, 72, s.panel)}
    ${rect(0, 71, width, 1, s.line)}
    ${text(s, 48, 46, s.name, 24, s.ink, 700)}
    ${[0, 1, 2, 3]
      .map((i) => bar(s, navX + i * 110, 33, 72, 8, 0.35))
      .join("")}
    ${pill(s, width - 200, 22, 152, 30, "url(#grad-cta)")}
  `;
}

function sidebar(s, width = 236) {
  return `
    ${rect(0, 0, width, H, s.panel)}
    ${rect(width - 1, 0, 1, H, s.line)}
    ${text(s, 32, 56, s.name, 20, s.ink, 700)}
    ${[0, 1, 2, 3, 4, 5]
      .map(
        (i) => `
        ${
          i === 1
            ? rect(20, 108 + i * 52 - 16, width - 40, 40, s.accent, 10, 0.14)
            : ""
        }
        ${circle(44, 108 + i * 52, 6, i === 1 ? s.accent : s.muted, i === 1 ? 1 : 0.6)}
        ${bar(s, 66, 102 + i * 52, 104, 8, i === 1 ? 0.85 : 0.3)}`,
      )
      .join("")}
  `;
}

function footer(s, y) {
  return `
    ${rect(0, y, W, H - y, s.panel)}
    ${rect(0, y, W, 1, s.line)}
    ${text(s, 48, y + 54, s.name, 18, s.muted, 600)}
    ${[0, 1, 2]
      .map((i) => bar(s, 520 + i * 180, y + 42, 120, 8, 0.25))
      .join("")}
  `;
}

/* --- Layouts desktop ------------------------------------------------------ */

function webHero(s) {
  return `
    ${rect(0, 0, W, H, s.bg)}
    ${topbar(s)}
    ${media(s, 0, 72, W, 470, 0)}
    ${rect(0, 72, W, 470, s.bg, 0, 0.35)}
    ${bar(s, 96, 200, 620, 34, 0.92)}
    ${bar(s, 96, 252, 440, 34, 0.92)}
    ${bar(s, 96, 320, 520, 12, 0.4)}
    ${bar(s, 96, 344, 380, 12, 0.4)}
    ${pill(s, 96, 392, 210, 48, "url(#grad-cta)")}
    ${pill(s, 326, 392, 180, 48, s.ink)}
    ${rect(327, 393, 178, 46, s.bg, 23)}

    ${text(s, 96, 630, "—", 22, s.accent, 700)}
    ${bar(s, 130, 616, 200, 12, 0.45)}
    ${[0, 1, 2]
      .map((i) => {
        const x = 96 + i * 480;
        return `
        ${rect(x, 660, 440, 240, s.panel, 18)}
        ${media(s, x + 1, 661, 438, 130, 18)}
        ${bar(s, x + 24, 816, 200, 14, 0.8)}
        ${bar(s, x + 24, 846, 280, 10, 0.32)}
        ${text(s, x + 24, 884, s.prices[i], 18, s.accent, 700)}`;
      })
      .join("")}
    ${footer(s, 930)}
  `;
}

function shopGrid(s) {
  const cards = [];
  for (let i = 0; i < 6; i += 1) {
    const x = 300 + (i % 3) * 428;
    const y = 200 + Math.floor(i / 3) * 360;
    cards.push(`
      ${rect(x, y, 396, 320, s.panel, 16)}
      ${media(s, x + 1, y + 1, 394, 190, 16)}
      ${bar(s, x + 22, y + 220, 190, 12, 0.8)}
      ${bar(s, x + 22, y + 246, 130, 9, 0.3)}
      ${text(s, x + 22, y + 292, s.prices[i % 3], 20, s.accent, 700)}
      ${pill(s, x + 300, y + 272, 72, 30, s.accent)}`);
  }
  return `
    ${rect(0, 0, W, H, s.bg)}
    ${topbar(s)}
    ${pill(s, 360, 100, 520, 44, s.panel)}
    ${circle(392, 122, 7, s.muted, 0.7)}
    ${bar(s, 412, 117, 160, 9, 0.28)}
    ${rect(48, 180, 212, 620, s.panel, 16)}
    ${[0, 1, 2, 3]
      .map(
        (i) => `
        ${bar(s, 76, 220 + i * 140, 90, 10, 0.55)}
        ${[0, 1, 2]
          .map(
            (j) => `
          ${rect(76, 246 + i * 140 + j * 28, 14, 14, s.line, 4)}
          ${bar(s, 100, 250 + i * 140 + j * 28, 76, 8, 0.25)}`,
          )
          .join("")}`,
      )
      .join("")}
    ${cards.join("")}
  `;
}

function dashboard(s) {
  const points = [0.55, 0.42, 0.6, 0.35, 0.48, 0.26, 0.38, 0.18]
    .map((v, i) => `${300 + i * 118},${640 - (1 - v) * 130}`)
    .join(" ");
  return `
    ${rect(0, 0, W, H, s.bg)}
    ${sidebar(s)}
    ${rect(236, 0, W - 236, 72, s.panel)}
    ${rect(236, 71, W - 236, 1, s.line)}
    ${bar(s, 280, 32, 180, 12, 0.6)}
    ${circle(W - 72, 36, 18, s.line)}
    ${pill(s, W - 260, 22, 150, 30, s.accent, 0.9)}

    ${[0, 1, 2, 3]
      .map((i) => {
        const x = 284 + i * 316;
        return `
        ${rect(x, 112, 288, 132, s.panel, 16)}
        ${bar(s, x + 24, 142, 86, 8, 0.3)}
        ${text(s, x + 24, 198, s.prices[i % s.prices.length], 30, i === 0 ? s.accent : s.ink, 700)}
        ${rect(x + 200, 176, 64, 24, s.accent, 8, 0.16)}`;
      })
      .join("")}

    ${rect(284, 284, 920, 396, s.panel, 16)}
    ${bar(s, 316, 322, 150, 10, 0.5)}
    ${[0, 1, 2, 3].map((i) => rect(316, 400 + i * 80, 856, 1, s.line)).join("")}
    <polyline points="${points}" fill="none" stroke="${s.accent}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <polyline points="${points}" fill="none" stroke="${s.accent}" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity="0.12"/>
    ${[0, 1, 2, 3, 4, 5, 6]
      .map((i) =>
        rect(320 + i * 122, 700, 46, -[70, 120, 90, 150, 110, 170, 130][i], s.accent2, 6, 0.55),
      )
      .join("")}

    ${rect(1236, 284, 320, 396, s.panel, 16)}
    ${bar(s, 1268, 322, 120, 10, 0.5)}
    ${[0, 1, 2, 3, 4]
      .map(
        (i) => `
        ${circle(1282, 388 + i * 56, 10, i < 2 ? s.accent : s.line)}
        ${bar(s, 1306, 382 + i * 56, 140, 8, 0.35)}
        ${bar(s, 1306, 398 + i * 56, 90, 6, 0.18)}`,
      )
      .join("")}

    ${rect(284, 720, 1272, 220, s.panel, 16)}
    ${[0, 1, 2, 3]
      .map(
        (i) => `
        ${rect(316, 760 + i * 46, 1208, 1, s.line)}
        ${bar(s, 316, 776 + i * 46, 180, 9, 0.4)}
        ${bar(s, 640, 776 + i * 46, 120, 9, 0.22)}
        ${bar(s, 900, 776 + i * 46, 150, 9, 0.22)}
        ${pill(s, 1380, 770 + i * 46, 96, 22, i % 2 ? s.line : s.accent)}`,
      )
      .join("")}
  `;
}

function webDetail(s) {
  return `
    ${rect(0, 0, W, H, s.bg)}
    ${topbar(s)}
    ${bar(s, 96, 132, 260, 10, 0.25)}
    ${media(s, 96, 168, 900, 520, 20)}
    ${[0, 1, 2, 3]
      .map((i) => rect(96 + i * 120, 712, 104, 76, s.panel, 10))
      .join("")}
    ${rect(96, 712, 104, 76, s.accent, 10, 0.25)}

    ${rect(1060, 168, 444, 520, s.panel, 20)}
    ${bar(s, 1092, 216, 260, 20, 0.85)}
    ${bar(s, 1092, 250, 180, 20, 0.85)}
    ${text(s, 1092, 318, s.prices[0], 32, s.accent, 700)}
    ${[0, 1, 2, 3, 4]
      .map(
        (i) => `
        ${rect(1092, 356 + i * 44, 380, 1, s.line)}
        ${bar(s, 1092, 372 + i * 44, 140, 8, 0.3)}
        ${bar(s, 1330, 372 + i * 44, 84, 8, 0.5)}`,
      )
      .join("")}
    ${pill(s, 1092, 596, 380, 52, "url(#grad-cta)")}
    ${footer(s, 860)}
  `;
}

function webForm(s) {
  return `
    ${rect(0, 0, W, H, s.bg)}
    ${topbar(s)}
    ${bar(s, 96, 150, 420, 26, 0.9)}
    ${bar(s, 96, 196, 300, 10, 0.3)}

    ${rect(96, 248, 880, 560, s.panel, 20)}
    ${[0, 1, 2, 3]
      .map(
        (i) => `
        ${bar(s, 128, 296 + i * 120, 120, 8, 0.35)}
        ${rect(128, 316 + i * 120, i === 3 ? 816 : 392, 52, s.bg, 10)}
        ${rect(128, 316 + i * 120, i === 3 ? 816 : 392, 52, s.line, 10, 0.5)}
        ${i < 3 ? rect(552, 316 + i * 120, 392, 52, s.bg, 10) : ""}
        ${i < 3 ? rect(552, 316 + i * 120, 392, 52, s.line, 10, 0.5) : ""}`,
      )
      .join("")}
    ${pill(s, 128, 724, 240, 52, "url(#grad-cta)")}

    ${rect(1032, 248, 472, 400, s.panel, 20)}
    ${bar(s, 1064, 296, 160, 12, 0.6)}
    ${[0, 1, 2]
      .map(
        (i) => `
        ${media(s, 1064, 336 + i * 88, 72, 72, 10)}
        ${bar(s, 1156, 356 + i * 88, 180, 10, 0.5)}
        ${bar(s, 1156, 378 + i * 88, 110, 8, 0.25)}
        ${text(s, 1440, 372 + i * 88, s.prices[i], 16, s.accent, 700, "end")}`,
      )
      .join("")}
    ${rect(1064, 604, 408, 1, s.line)}
    ${footer(s, 880)}
  `;
}

/** Deux écrans d'application posés sur un fond, pour la vignette d'une app. */
function appShowcase(s) {
  const phone = (x, y, scale, variant) => `
    <g transform="translate(${x} ${y}) scale(${scale})">
      ${rect(-8, -8, MW + 16, MH + 16, s.panel, 56)}
      ${rect(0, 0, MW, MH, s.bg, 48)}
      ${appScreenInner(s, variant)}
    </g>`;
  return `
    ${rect(0, 0, W, H, s.bg)}
    ${circle(W * 0.5, H * 0.42, 340, s.accent, 0.12)}
    ${circle(W * 0.72, H * 0.6, 240, s.accent2, 0.12)}
    ${phone(430, 120, 0.78, 1)}
    ${phone(830, 60, 0.86, 0)}
  `;
}

/* --- Layouts mobile ------------------------------------------------------- */

function appScreenInner(s, variant = 0) {
  const ring = `
    <circle cx="195" cy="290" r="76" fill="none" stroke="${s.line}" stroke-width="14"/>
    <circle cx="195" cy="290" r="76" fill="none" stroke="${s.accent}" stroke-width="14"
      stroke-linecap="round" stroke-dasharray="478" stroke-dashoffset="153"
      transform="rotate(-90 195 290)"/>
    ${text(s, 195, 300, s.prices[0], 34, s.ink, 700, "middle")}`;

  const list = [0, 1, 2, 3]
    .map(
      (i) => `
      ${rect(24, 430 + i * 78, 342, 64, s.panel, 16)}
      ${rect(40, 444 + i * 78, 36, 36, s.accent, 10, i === 0 ? 0.9 : 0.2)}
      ${bar(s, 92, 452 + i * 78, 130, 9, 0.55)}
      ${bar(s, 92, 470 + i * 78, 84, 7, 0.22)}
      ${text(s, 348, 470 + i * 78, s.prices[(i % 2) + 1], 13, s.muted, 600, "end")}`,
    )
    .join("");

  const stats = [0, 1, 2]
    .map(
      (i) => `
      ${rect(24 + i * 116, 196, 100, 92, s.panel, 16)}
      ${text(s, 40 + i * 116, 244, s.prices[i], 20, i === 0 ? s.accent : s.ink, 700)}
      ${bar(s, 40 + i * 116, 258, 54, 7, 0.25)}`,
    )
    .join("");

  return `
    ${text(s, 24, 40, "9:41", 14, s.ink, 600)}
    ${rect(322, 28, 44, 12, s.ink, 4, 0.5)}
    ${circle(46, 92, 22, s.line)}
    ${bar(s, 80, 78, 120, 10, 0.6)}
    ${bar(s, 80, 98, 80, 8, 0.25)}
    ${variant === 0 ? stats + ring : stats + rect(24, 300, 342, 112, s.panel, 16) + media(s, 25, 301, 340, 110, 16)}
    ${list}
    ${rect(0, MH - 84, MW, 84, s.panel, 0)}
    ${rect(0, MH - 84, MW, 1, s.line)}
    ${[0, 1, 2, 3]
      .map(
        (i) => `
        ${rect(44 + i * 84, MH - 58, 26, 26, i === 0 ? s.accent : s.muted, 8, i === 0 ? 1 : 0.4)}`,
      )
      .join("")}
  `;
}

function appScreen(s) {
  return `${rect(0, 0, MW, MH, s.bg)}${appScreenInner(s, 0)}`;
}

function mobileWeb(s) {
  return `
    ${rect(0, 0, MW, MH, s.bg)}
    ${text(s, 24, 40, "9:41", 14, s.ink, 600)}
    ${rect(322, 28, 44, 12, s.ink, 4, 0.5)}
    ${rect(0, 60, MW, 56, s.panel)}
    ${rect(0, 115, MW, 1, s.line)}
    ${text(s, 24, 96, s.name, 17, s.ink, 700)}
    ${rect(330, 80, 24, 3, s.ink, 2, 0.6)}
    ${rect(330, 88, 24, 3, s.ink, 2, 0.6)}
    ${media(s, 0, 116, MW, 260, 0)}
    ${rect(0, 116, MW, 260, s.bg, 0, 0.3)}
    ${bar(s, 24, 200, 250, 22, 0.9)}
    ${bar(s, 24, 232, 180, 22, 0.9)}
    ${pill(s, 24, 290, 160, 44, "url(#grad-cta)")}
    ${[0, 1, 2]
      .map(
        (i) => `
        ${rect(24, 410 + i * 140, 342, 124, s.panel, 16)}
        ${media(s, 25, 411 + i * 140, 130, 122, 16)}
        ${bar(s, 172, 442 + i * 140, 150, 11, 0.7)}
        ${bar(s, 172, 466 + i * 140, 110, 8, 0.25)}
        ${text(s, 172, 508 + i * 140, s.prices[i], 16, s.accent, 700)}`,
      )
      .join("")}
    ${rect(0, MH - 70, MW, 70, s.panel)}
  `;
}

/* --- Assemblage ----------------------------------------------------------- */

const LAYOUTS = {
  webHero,
  webDetail,
  webForm,
  shopGrid,
  dashboard,
  appShowcase,
  appScreen,
  mobileWeb,
};

function svg(spec, layout, width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">${defs(
    spec,
  )}${LAYOUTS[layout](spec)}</svg>\n`;
}

async function main() {
  for (const [id, spec] of Object.entries(SPECS)) {
    const dir = join(ROOT, "public", "models", id);
    await mkdir(dir, { recursive: true });

    const files = [
      ["cover.svg", spec.desktop, W, H],
      ["desktop.svg", spec.desktop, W, H],
      ["mobile.svg", spec.mobile, MW, MH],
      [
        "feature-01.svg",
        spec.features[0],
        spec.features[0] === "appScreen" ? MW : W,
        spec.features[0] === "appScreen" ? MH : H,
      ],
      ["feature-02.svg", spec.features[1], W, H],
    ];

    for (const [file, layout, width, height] of files) {
      await writeFile(join(dir, file), svg(spec, layout, width, height), "utf8");
    }
    console.log(`✓ ${id} — ${files.length} fichiers`);
  }
}

main();
