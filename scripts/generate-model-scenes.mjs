/**
 * Génère les décors des aperçus de modèles (accueil, « Sites prêts à lancer ») :
 * - horizon-travel/scene.webp : la photo du hero de la démo, un village des
 *   Cyclades au coucher du soleil ;
 * - fitzone/scene.webp : le socle rocheux, éclairé en violet, où posent les
 *   deux téléphones de l'application.
 *
 * Ce sont des illustrations, pas des photos : à remplacer par la vraie photo
 * de la démo (licence documentée, docs/ASSETS.md §4) quand elle existe.
 * Tout est tiré d'un générateur pseudo-aléatoire à graine fixe : relancer le
 * script redonne exactement les mêmes images.
 *
 * Lancer avec : npm run scenes
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Mulberry32 : petit, rapide, déterministe. */
function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const f = (n) => Math.round(n * 10) / 10;

function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Mélange deux couleurs hexadécimales : t = 0 → a, t = 1 → b. */
function mix(a, b, t) {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const c = [lerp(r1, r2, t), lerp(g1, g2, t), lerp(b1, b2, t)];
  return `#${c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

const poly = (points) =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join(" ") + " Z";

/* --- Horizon Travel : village des Cyclades au crépuscule ------------------- */

function santorini() {
  const W = 1920;
  const H = 1080;
  const HORIZON = 452;
  const rnd = random(20260928);

  /* Arête de la falaise, du haut à droite vers le bas au centre. */
  const RIDGE = [
    [W + 40, 236],
    [1850, 246],
    [1772, 276],
    [1690, 300],
    [1610, 334],
    [1530, 372],
    [1446, 420],
    [1362, 478],
    [1276, 546],
    [1192, 622],
    [1108, 706],
    [1024, 798],
    [940, 900],
    [856, 1010],
    [800, H + 40],
  ];

  /** x de l'arête pour une hauteur donnée (interpolation linéaire). */
  const ridgeX = (y) => {
    for (let i = 0; i < RIDGE.length - 1; i++) {
      const [x1, y1] = RIDGE[i];
      const [x2, y2] = RIDGE[i + 1];
      if (y >= y1 && y <= y2) return lerp(x1, x2, (y - y1) / (y2 - y1));
    }
    return y < RIDGE[0][1] ? W + 40 : 800;
  };

  /* Reflets du soleil sur l'eau : des traits courts, plus denses au large. */
  const glints = [];
  for (let i = 0; i < 260; i++) {
    const depth = rnd() ** 1.8;
    const y = HORIZON + 6 + depth * 560;
    const spread = lerp(90, 420, depth);
    const x = 1010 + (rnd() - 0.5) * 2 * spread - depth * 160;
    if (x > ridgeX(y) - 20) continue;
    const w = lerp(14, 90, depth) * (0.4 + rnd());
    const o = lerp(0.55, 0.12, depth) * (0.35 + rnd() * 0.65);
    const c = rnd() < 0.5 ? "#ffc38f" : "#ff9f8a";
    glints.push(
      `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(lerp(1.4, 3.2, depth))}" rx="1.5" fill="${c}" opacity="${f(o * 100) / 100}"/>`,
    );
  }

  /* Maisons : rangées du haut (loin, petites) vers le bas (près, grandes).
     Dessinées dans cet ordre, les plus proches recouvrent les plus lointaines. */
  const houses = [];
  const lights = [];
  const domes = [];
  let y = 250;
  while (y < H + 60) {
    const depth = clamp((y - 250) / (H - 250));
    const s = lerp(20, 104, depth ** 1.25);
    let x = ridgeX(y) + (rnd() - 0.2) * s * 0.6;
    while (x < W + s) {
      const w = s * lerp(0.7, 1.5, rnd());
      const h = s * lerp(0.5, 0.86, rnd());
      /* Terrasses : des bandes de maisons parallèles à la falaise, séparées
         de roche nue ; plus clairsemées vers le bas, près de l'eau. */
      const band = ((x - ridgeX(y)) / (s * 5.5) + rnd() * 0.25) % 1;
      const gap = band > lerp(0.82, 0.6, depth) || rnd() < lerp(0.08, 0.2, depth);
      if (gap) {
        x += w * lerp(0.5, 1.2, rnd());
        continue;
      }
      const yb = y + (rnd() - 0.5) * s * 0.18;
      const top = yb - h;
      /* Crépuscule : les toits du haut prennent encore le couchant (blanc
         chaud, reflets orangés), le bas de la falaise est déjà dans l'ombre
         mauve. Quelques façades ocre ou pêche, comme à Oia. */
      const sun = clamp(1 - depth / 0.68) * lerp(0.7, 1, rnd());
      const tint = rnd();
      const base =
        tint < 0.1 ? "#eab28c" : tint < 0.16 ? "#dc9a66" : tint < 0.2 ? "#cf929c" : "#f6e2d0";
      const dusk = mix("#6a5a7e", "#2e2440", depth);
      const lit = mix(dusk, mix(base, "#ffc298", 0.3), clamp(sun * 0.95 + 0.12));
      const shade = mix(lit, "#1a1326", 0.42);
      const roof = mix(lit, "#fff3e6", lerp(0.15, 0.55, sun));
      const faceW = w * lerp(0.62, 0.8, rnd());
      houses.push(
        `<rect x="${f(x)}" y="${f(top)}" width="${f(faceW)}" height="${f(h)}" fill="${lit}"/>`,
        `<rect x="${f(x + faceW)}" y="${f(top)}" width="${f(w - faceW)}" height="${f(h)}" fill="${shade}"/>`,
        `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="url(#ao)"/>`,
        `<rect x="${f(x - 1)}" y="${f(top - s * 0.035)}" width="${f(faceW + 2)}" height="${f(s * 0.05)}" fill="${roof}"/>`,
      );

      /* Fenêtres et portes : sombres, ou allumées d'une lumière chaude. */
      const openings = Math.floor(rnd() * 3.2);
      for (let k = 0; k < openings; k++) {
        const ow = s * lerp(0.09, 0.15, rnd());
        const oh = s * lerp(0.13, 0.24, rnd());
        const ox = x + s * 0.08 + rnd() * Math.max(0, faceW - ow - s * 0.16);
        const oy = top + h * lerp(0.25, 0.62, rnd());
        const on = rnd() < lerp(0.3, 0.62, depth);
        if (on) {
          lights.push({ x: ox + ow / 2, y: oy + oh / 2, r: s * 0.1 });
          houses.push(
            `<rect x="${f(ox)}" y="${f(oy)}" width="${f(ow)}" height="${f(oh)}" rx="${f(ow * 0.3)}" fill="#ffc46e"/>`,
          );
        } else {
          houses.push(
            `<rect x="${f(ox)}" y="${f(oy)}" width="${f(ow)}" height="${f(oh)}" rx="${f(ow * 0.3)}" fill="${mix("#3a2838", "#140d18", depth)}"/>`,
          );
        }
      }

      /* Quelques coupoles, surtout en haut : blanches ou bleu profond. */
      if (depth < 0.45 && rnd() < 0.07) {
        const r = faceW * lerp(0.26, 0.36, rnd());
        const cx = x + faceW / 2;
        const blue = rnd() < 0.55;
        domes.push(
          `<rect x="${f(cx - r * 0.72)}" y="${f(top - r * 0.5)}" width="${f(r * 1.44)}" height="${f(r * 0.55)}" fill="${lit}"/>`,
          `<path d="M${f(cx - r)} ${f(top - r * 0.45)} A ${f(r)} ${f(r * 1.05)} 0 0 1 ${f(cx + r)} ${f(top - r * 0.45)} Z" fill="${
            blue ? mix("#3d56a6", "#2a2f5e", depth) : mix("#f6e6dc", "#b9a3b6", depth)
          }"/>`,
          `<rect x="${f(cx - 1.2)}" y="${f(top - r * 1.62)}" width="2.4" height="${f(r * 0.6)}" fill="${lit}"/>`,
        );
      }

      x += w + s * lerp(0.02, 0.22, rnd());
    }
    y += s * 0.52;
  }

  /* Lampadaires et terrasses éclairées, semés le long de la falaise. */
  for (let i = 0; i < 90; i++) {
    const yy = lerp(270, H, rnd() ** 0.8);
    const xx = ridgeX(yy) + 10 + rnd() * (W - ridgeX(yy));
    const depth = clamp((yy - 250) / (H - 250));
    lights.push({ x: xx, y: yy, r: lerp(2, 6, depth) });
  }

  const glow = lights
    .map(
      (l) =>
        `<circle cx="${f(l.x)}" cy="${f(l.y)}" r="${f(l.r * 2.2)}" fill="#ff9a3c" opacity="0.5"/>`,
    )
    .join("");
  const cores = lights
    .map(
      (l) =>
        `<circle cx="${f(l.x)}" cy="${f(l.y)}" r="${f(Math.max(1, l.r * 0.3))}" fill="#ffe2a8"/>`,
    )
    .join("");

  /* La falaise : sous l'arête, jusqu'au coin bas droit. */
  const cliff = poly([...RIDGE, [W + 40, H + 40]]);

  /* Île au large : un profil en cloche, cassé de petites crêtes. */
  const isle = [[540, HORIZON + 3]];
  for (let x = 556; x <= 1166; x += 12) {
    const t = (x - 540) / 640;
    const bump = Math.sin(Math.PI * t) ** 1.5;
    const lean = t < 0.5 ? 1 : lerp(1, 0.7, (t - 0.5) / 0.5);
    isle.push([x, HORIZON - 88 * bump * lean - (rnd() - 0.5) * 7 * bump]);
  }
  isle.push([1180, HORIZON + 3]);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#120d2b"/>
      <stop offset="0.34" stop-color="#2a1b4c"/>
      <stop offset="0.58" stop-color="#5a2e62"/>
      <stop offset="0.76" stop-color="#a24c6b"/>
      <stop offset="0.9" stop-color="#e2785e"/>
      <stop offset="1" stop-color="#ffb674"/>
    </linearGradient>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#ffd7a0" stop-opacity="0.95"/>
      <stop offset="0.35" stop-color="#ff9f6e" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#ff7a6e" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#9a6479"/>
      <stop offset="0.12" stop-color="#6d4467"/>
      <stop offset="0.42" stop-color="#352449"/>
      <stop offset="1" stop-color="#110c1e"/>
    </linearGradient>
    <linearGradient id="isle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2b1b38"/>
      <stop offset="1" stop-color="#4a2f4f"/>
    </linearGradient>
    <linearGradient id="cliff" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2a1a26"/>
      <stop offset="0.6" stop-color="#170f19"/>
      <stop offset="1" stop-color="#0c0810"/>
    </linearGradient>
    <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1030" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#1a1030" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#0c0818" stop-opacity="0.66"/>
    </linearGradient>
    <!-- Le couchant lave le haut du village d'une lumière orangée. -->
    <radialGradient id="wash" cx="0.86" cy="0.2" r="0.42">
      <stop offset="0" stop-color="#ffb07a" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#ffb07a" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.55" cy="0.45" r="0.75">
      <stop offset="0.55" stop-color="#07050d" stop-opacity="0"/>
      <stop offset="1" stop-color="#07050d" stop-opacity="0.7"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="10"/>
    </filter>
    <filter id="haze" x="-20%" y="-50%" width="140%" height="200%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
    <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>
    <clipPath id="cliff-clip"><path d="${cliff}"/></clipPath>
    <linearGradient id="reflection" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffc58a" stop-opacity="0.6"/>
      <stop offset="0.45" stop-color="#ff9e7a" stop-opacity="0.22"/>
      <stop offset="1" stop-color="#ff9e7a" stop-opacity="0"/>
    </linearGradient>
    <!-- Occlusion : le pied de chaque maison s'assombrit. -->
    <linearGradient id="ao" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0.35" stop-color="#140c1c" stop-opacity="0"/>
      <stop offset="1" stop-color="#140c1c" stop-opacity="0.55"/>
    </linearGradient>
    <filter id="wide" x="-100%" y="-50%" width="300%" height="200%">
      <feGaussianBlur stdDeviation="28"/>
    </filter>
  </defs>

  <!-- Ciel -->
  <rect width="${W}" height="${HORIZON + 4}" fill="url(#sky)"/>
  <ellipse cx="1010" cy="${HORIZON}" rx="980" ry="330" fill="url(#sun)"/>
  <g filter="url(#soft)">
    <ellipse cx="1080" cy="170" rx="720" ry="26" fill="#1c1236" opacity="0.7"/>
    <ellipse cx="760" cy="238" rx="520" ry="18" fill="#2b1942" opacity="0.55"/>
  </g>
  <g filter="url(#haze)">
    <ellipse cx="1180" cy="286" rx="420" ry="7" fill="#ff9d86" opacity="0.5"/>
    <ellipse cx="820" cy="328" rx="360" ry="6" fill="#ffac8a" opacity="0.42"/>
    <ellipse cx="1320" cy="360" rx="300" ry="5" fill="#ffb98e" opacity="0.4"/>
    <ellipse cx="560" cy="376" rx="260" ry="4" fill="#ff9a86" opacity="0.3"/>
  </g>

  <!-- Mer -->
  <rect y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#sea)"/>
  <ellipse cx="1004" cy="${HORIZON + 170}" rx="74" ry="200" fill="url(#reflection)" filter="url(#wide)"/>
  ${glints.join("")}

  <!-- Îles au large -->
  <path d="${poly([
    [-20, HORIZON + 2],
    [-20, HORIZON - 14],
    [80, HORIZON - 19],
    [170, HORIZON - 16],
    [300, HORIZON - 9],
    [430, HORIZON + 2],
  ])}" fill="#3e2a4c" opacity="0.85"/>
  <path d="${poly(isle)}" fill="url(#isle)"/>
  <path d="${poly([
    [560, HORIZON + 3],
    [1170, HORIZON + 3],
    [1100, HORIZON + 26],
    [640, HORIZON + 22],
  ])}" fill="#2a1a36" opacity="0.45" filter="url(#haze)"/>

  <!-- Falaise et village -->
  <path d="${cliff}" fill="url(#cliff)"/>
  <g clip-path="url(#cliff-clip)">
    ${houses.join("")}
    ${domes.join("")}
    <rect width="${W}" height="${H}" fill="url(#wash)"/>
    <rect width="${W}" height="${H}" fill="url(#dusk)"/>
  </g>
  <g filter="url(#bloom)">${glow}</g>
  ${cores}

  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;
}

/* --- FitZone : socle rocheux, lumière violette ----------------------------- */

function rocks() {
  const W = 1600;
  const H = 1184;
  /** Dessus du socle : les téléphones y posent, à ~88 % de la hauteur. */
  const LEDGE = 1010;
  const rnd = random(4101);
  const clips = [];
  let uid = 0;

  /** Rocher : contour anguleux (peu de sommets), face supérieure éclairée,
      liseré fin sur le dessus — la lumière vient d'en haut.
      `blur` : profondeur de champ ; `dim` : éloignement (0 → 1). */
  const boulder = ({ cx, cy, rx, ry, n = 11, rough = 0.2, blur = 0, dim = 0, rim = true }) => {
    const id = `rock-${uid++}`;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2 + (rnd() - 0.5) * 0.35;
      const k = 1 + (rnd() - 0.5) * 2 * rough;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    const outline = poly(pts);
    clips.push(`<clipPath id="${id}"><path d="${outline}"/></clipPath>`);

    /* Dessus : l'arc supérieur du contour, doublé plus bas en ligne brisée. */
    const top = [
      ...pts.slice(Math.round(n * 0.72)),
      ...pts.slice(0, Math.round(n * 0.28) + 1),
    ];
    const under = top
      .map(([x, y]) => [x + (rnd() - 0.5) * rx * 0.12, y + ry * lerp(0.16, 0.34, rnd())])
      .reverse();
    const cracks = [];
    for (let i = 0; i < 4; i++) {
      const [x, y] = top[Math.floor(rnd() * top.length)];
      cracks.push(
        `M${f(x)} ${f(y)} L${f(x + (rnd() - 0.5) * rx * 0.5)} ${f(y + ry * lerp(0.3, 0.8, rnd()))}`,
      );
    }
    const line = top.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join(" ");

    const body = `
      <path d="${outline}" fill="url(#stone)" opacity="${f(lerp(1, 0.85, dim) * 100) / 100}"/>
      <g clip-path="url(#${id})">
        <path d="${poly([...top, ...under])}" fill="${mix("#4d4090", "#28214c", dim)}" opacity="0.78"/>
        <path d="${cracks.join(" ")}" fill="none" stroke="#07050d" stroke-width="3" opacity="0.7"/>
        ${rim ? `<path d="${line}" fill="none" stroke="${mix("#b69cfb", "#5d4c9c", dim)}" stroke-width="12" opacity="0.34" filter="url(#rim)"/>` : ""}
      </g>
      ${rim ? `<path d="${line}" fill="none" stroke="${mix("#ddd2ff", "#7563b8", dim)}" stroke-width="2.4" stroke-linejoin="round" opacity="${f(lerp(0.92, 0.5, dim) * 100) / 100}"/>` : ""}`;
    return blur ? `<g filter="url(#dof-${blur})">${body}</g>` : body;
  };

  /* Bord supérieur du socle : presque plat, cassé de petites arêtes. */
  const ledge = [[-20, LEDGE + 60]];
  for (let x = 0; x <= W; x += 40) {
    const t = x / W;
    const arch = LEDGE + 44 * (2 * t - 1) ** 2;
    ledge.push([x, arch + (rnd() - 0.5) * 12]);
  }
  ledge.push([W + 20, LEDGE + 60]);

  /* Grain de la roche : de petits éclats clairs, plus denses sur le socle. */
  const specks = [];
  for (let i = 0; i < 520; i++) {
    const x = rnd() * W;
    const y = lerp(LEDGE, H, rnd() ** 0.7);
    specks.push(
      `<circle cx="${f(x)}" cy="${f(y)}" r="${f(lerp(0.8, 2.6, rnd()))}" fill="${
        rnd() < 0.5 ? "#7b66b8" : "#3b3060"
      }" opacity="${f(lerp(0.15, 0.55, rnd()) * 100) / 100}"/>`,
    );
  }

  /* Poussière en suspension dans la lumière. */
  const dust = [];
  for (let i = 0; i < 46; i++) {
    const x = rnd() * W;
    const y = lerp(120, LEDGE - 20, rnd());
    dust.push(
      `<circle cx="${f(x)}" cy="${f(y)}" r="${f(lerp(1.2, 4.5, rnd() ** 2))}" fill="${
        rnd() < 0.6 ? "#b69cfb" : "#e9a8ff"
      }" opacity="${f(lerp(0.12, 0.5, rnd()) * 100) / 100}"/>`,
    );
  }

  /* Trois plans : rochers flous au fond, rochers latéraux posés sur le sol
     (leur pied passe derrière le socle), premier plan sans liseré. */
  const back = [
    boulder({ cx: 50, cy: 520, rx: 270, ry: 360, blur: 2, dim: 0.5 }),
    boulder({ cx: 1570, cy: 570, rx: 250, ry: 330, blur: 2, dim: 0.5 }),
    boulder({ cx: 380, cy: 820, rx: 150, ry: 180, n: 9, blur: 6, dim: 0.7 }),
    boulder({ cx: 1250, cy: 860, rx: 130, ry: 150, n: 9, blur: 6, dim: 0.75 }),
  ].join("");
  const middle = [
    boulder({ cx: 100, cy: 980, rx: 300, ry: 270, blur: 2, dim: 0.1 }),
    boulder({ cx: 1510, cy: 1000, rx: 280, ry: 250, blur: 2, dim: 0.1 }),
  ].join("");
  const front = [
    boulder({ cx: -60, cy: 1250, rx: 330, ry: 200, rough: 0.12, blur: 6, dim: 0.4, rim: false }),
    boulder({ cx: 1680, cy: 1240, rx: 340, ry: 190, rough: 0.12, blur: 6, dim: 0.4, rim: false }),
  ].join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b0816"/>
      <stop offset="0.55" stop-color="#171031"/>
      <stop offset="1" stop-color="#0b0815"/>
    </linearGradient>
    <radialGradient id="light" cx="0.5" cy="0.68" r="0.55">
      <stop offset="0" stop-color="#8a5cff" stop-opacity="0.62"/>
      <stop offset="0.45" stop-color="#5b2fd0" stop-opacity="0.26"/>
      <stop offset="1" stop-color="#2a1570" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="beam" cx="0.5" cy="0" r="0.8">
      <stop offset="0" stop-color="#a78bfa" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#a78bfa" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ledge" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#2d2450"/>
      <stop offset="0.08" stop-color="#1f1938"/>
      <stop offset="0.4" stop-color="#141026"/>
      <stop offset="1" stop-color="#0a0814"/>
    </linearGradient>
    <radialGradient id="pool" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#b794ff" stop-opacity="0.9"/>
      <stop offset="0.4" stop-color="#8b5cf6" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#6d28d9" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.72">
      <stop offset="0.6" stop-color="#06040c" stop-opacity="0"/>
      <stop offset="1" stop-color="#06040c" stop-opacity="0.75"/>
    </radialGradient>
    <linearGradient id="stone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#352b62"/>
      <stop offset="0.32" stop-color="#1d1738"/>
      <stop offset="1" stop-color="#0b0916"/>
    </linearGradient>
    <filter id="rim" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="18"/>
    </filter>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5"/>
    </filter>
    <filter id="dof-2" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="2"/>
    </filter>
    <filter id="dof-6" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>
    ${clips.join("")}
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#light)"/>
  <rect width="${W}" height="${H}" fill="url(#beam)"/>

  <!-- Arrière-plan : rochers flous, à gauche et à droite -->
  ${back}
  <g filter="url(#blur)">${dust.join("")}</g>
  ${middle}

  <!-- Socle : la dalle où posent les téléphones -->
  <path d="${poly([...ledge, [W + 20, H + 20], [-20, H + 20]])}" fill="url(#ledge)"/>
  <ellipse cx="800" cy="${LEDGE + 4}" rx="560" ry="42" fill="url(#pool)" filter="url(#soft)"/>
  <path d="${ledge.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join(" ")}" fill="none" stroke="#b69cfb" stroke-width="2.5" opacity="0.75" filter="url(#rim)"/>
  <path d="M140 1100 L380 1076 L520 1092 M980 1094 L1180 1072 L1360 1098 M300 1160 L560 1136 M1060 1170 L1300 1150" fill="none" stroke="#080611" stroke-width="3" opacity="0.8"/>
  ${specks.join("")}
  ${front}

  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;
}

/* --- Sortie ---------------------------------------------------------------- */

const SCENES = {
  "horizon-travel": santorini,
  fitzone: rocks,
};

for (const [id, draw] of Object.entries(SCENES)) {
  const dir = join(ROOT, "public", "models", id);
  await mkdir(dir, { recursive: true });
  const file = join(dir, "scene.webp");
  const webp = await sharp(Buffer.from(draw())).webp({ quality: 88 }).toBuffer();
  await writeFile(file, webp);
  console.log(`${id}/scene.webp — ${Math.round(webp.length / 1024)} Ko`);
}
