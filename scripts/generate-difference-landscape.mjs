/**
 * Génère le paysage de la section « Notre différence » (accueil) : deux
 * chaînes de roches sombres, éclairées en violet par le faisceau central,
 * et un sol brillant où elles se reflètent. Au centre, la place du faisceau
 * et de sa flaque de lumière, dessinés en CSS (src/components/difference.tsx).
 *
 * Le ciel est transparent : l'image se pose sur le fond de la section.
 * Tout est tiré d'un générateur pseudo-aléatoire à graine fixe : relancer le
 * script redonne exactement la même image.
 *
 * node scripts/generate-difference-landscape.mjs [--preview <fichier.png>]
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "sections");
const NAME = "difference-landscape";

/* Repère en px CSS : 3000 × 400, le faisceau au centre. Doit suivre
   .landscape et --horizon (5,5rem = 88 px) dans difference.module.css. */
const W = 3000;
const H = 400;
const CX = W / 2;
const HORIZON = H - 88;
/* Les crêtes sont dessinées dans un repère de 320 de haut, sol à GROUND :
   ridge() les descend de DY, pour garder leur hauteur au-dessus du sol. */
const GROUND = 232;
const DY = H - 320;
/** Largeurs produites : 1× mobile (affiché en 1500), 1× et 1,5× ailleurs. */
const WIDTHS = [1500, 3000, 4500];

/* Palette : les tokens de globals.css, figés ici puisque l'image est cuite. */
const CANVAS = "#08080c";
const VIOLET = "#7c3aed";
const VIOLET_BRIGHT = "#b69cfb";
const INDIGO = "#6366f1";

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

const f = (n) => Math.round(n * 10) / 10;
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

/**
 * Crête rocheuse : les points de contrôle donnent la silhouette, le
 * déplacement du point milieu (récursif) casse la ligne en arêtes vives.
 */
function ridge(points, rnd, { rough = 0.5, depth = 7, decay = 0.6 } = {}) {
  const control = points.map(([x, y]) => [x, y + DY]);
  const out = [control[0]];
  const split = (a, b, level, amp) => {
    if (level === 0) {
      out.push(b);
      return;
    }
    const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + (rnd() - 0.5) * amp];
    split(a, m, level - 1, amp * decay);
    split(m, b, level - 1, amp * decay);
  };
  for (let i = 0; i < control.length - 1; i++) {
    const a = control[i];
    const b = control[i + 1];
    split(a, b, depth, Math.hypot(b[0] - a[0], b[1] - a[1]) * rough);
  }
  return out;
}

const line = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join(" ");

/** Silhouette fermée : la crête, puis le pied sous l'horizon. */
const shape = (pts, base = HORIZON + 2) =>
  `${line(pts)} L${f(pts.at(-1)[0])} ${base} L${f(pts[0][0])} ${base} Z`;

/**
 * Liseré de lumière : chaque segment de la crête s'allume selon qu'il fait
 * face au faisceau. Regroupé par paliers d'intensité (peu d'éléments SVG).
 */
function rim(pts, { light, strength = 1, falloff = 900 }) {
  const buckets = new Map();
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[i + 1];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    // Normale sortante (vers le ciel), repère SVG : y vers le bas.
    const nx = (y2 - y1) / len;
    const ny = -(x2 - x1) / len;
    // Lumière venue du faisceau : du centre, un peu en hauteur.
    const lx = CX - (x1 + x2) / 2;
    const ly = light;
    const ll = Math.hypot(lx, ly) || 1;
    const facing = clamp((nx * lx + ny * ly) / ll);
    const near = clamp(1 - Math.abs(CX - (x1 + x2) / 2) / falloff, 0.15, 1);
    const k = Math.round(clamp(facing ** 1.4 * near * strength) * 12);
    if (k === 0) continue;
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k).push(`M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}`);
  }
  return [...buckets.entries()]
    .map(([k, d]) => ({ opacity: k / 12, d: d.join(" ") }))
    .sort((a, b) => a.opacity - b.opacity);
}

function build() {
  const rnd = random(20260928);

  /* Silhouettes : px CSS, y vers le bas, sol à GROUND (repère de dessin).
     Gauche : hautes crêtes au loin, qui descendent vers le centre.
     Droite : le sol libre sur ~150 px, puis une falaise haute. */
  const farLeft = ridge(
    [[-20, 176], [260, 150], [520, 168], [760, 146], [980, 186], [1180, 214], [1300, GROUND]],
    rnd,
    { rough: 0.3, depth: 6 },
  );
  const farRight = ridge(
    [[1720, GROUND], [1880, 206], [2080, 172], [2330, 150], [2600, 166], [2820, 140], [3020, 160]],
    rnd,
    { rough: 0.3, depth: 6 },
  );
  /* Grandes pentes, comme des blocs de roche : peu de points de contrôle,
     un relief qui s'éteint vite (decay bas) pour garder des arêtes nettes
     sans l'effet « nuage » d'un bruit trop fin. */
  const rock = { rough: 0.32, depth: 6, decay: 0.48 };
  const left = ridge(
    [
      [-20, 162],
      [140, 152],
      [300, 164],
      [420, 150],
      [543, 150],
      [640, 156],
      [743, 164],
      [830, 180],
      [900, 206],
      [970, 222],
      [1120, GROUND],
    ],
    rnd,
    rock,
  );
  const center = ridge(
    [[1050, GROUND], [1140, 206], [1210, 180], [1262, 186], [1330, 212], [1400, GROUND]],
    rnd,
    rock,
  );
  /* Droite : un épaulement bas, puis la paroi monte d'un coup vers le bord
     de l'écran (~360 px au-dessus du sol), comme dans la maquette. */
  const right = ridge(
    [
      [1650, GROUND],
      [1750, 200],
      [1832, 162],
      [1870, 90],
      [1910, 20],
      [1960, -30],
      [2030, -44],
      [2120, -22],
      [2230, 18],
      [2360, 50],
      [2500, 78],
      [2660, 96],
      [2820, 112],
      [3020, 122],
    ],
    rnd,
    rock,
  );
  /* Premier plan : des blocs bas, au ras du sol, aux deux extrémités. */
  const nearLeft = ridge(
    [[-20, 188], [150, 178], [300, 198], [440, 214], [560, GROUND]],
    rnd,
    rock,
  );
  const nearRight = ridge(
    [[2360, GROUND], [2500, 210], [2660, 192], [2840, 198], [3020, 186]],
    rnd,
    rock,
  );

  /* side : d'où vient la lumière (le faisceau est au centre). */
  const layers = [
    { pts: farLeft, fill: "url(#far)", rim: 0.3, falloff: 1400, relief: "far", side: "l" },
    { pts: farRight, fill: "url(#far)", rim: 0.3, falloff: 1400, relief: "far", side: "r" },
    { pts: left, fill: "url(#rock)", rim: 1, falloff: 2000, relief: "mid", side: "l" },
    { pts: right, fill: "url(#rock)", rim: 1, falloff: 2000, relief: "mid", side: "r" },
    { pts: center, fill: "url(#rock)", rim: 0.9, falloff: 700, relief: "mid", side: "l" },
    { pts: nearLeft, fill: "url(#near)", rim: 0.35, falloff: 1500, relief: "near", side: "l" },
    { pts: nearRight, fill: "url(#near)", rim: 0.35, falloff: 1500, relief: "near", side: "r" },
  ];

  const mountains = layers.map(
    ({ pts, fill, rim: strength, falloff, relief, side }, i) => {
      const far = relief === "far";
      const lit = rim(pts, { light: -260, strength, falloff });
      const edges = lit
        .map(
          ({ opacity, d }) =>
            `<path d="${d}" stroke="${VIOLET_BRIGHT}" stroke-opacity="${f(opacity * (far ? 0.3 : 0.55) * 100) / 100}" stroke-width="1"/>`,
        )
        .join("");
      const glow = lit
        .filter(({ opacity }) => opacity > 0.3)
        .map(
          ({ opacity, d }) =>
            `<path d="${d}" stroke="${VIOLET}" stroke-opacity="${f(opacity * 0.3 * 100) / 100}" stroke-width="5"/>`,
        )
        .join("");
      const glintOpacity = { far: 0.3, mid: 1, near: 0.45 }[relief];
      return `
    <g id="m${i}">
      <path d="${shape(pts)}" fill="${fill}" filter="url(#relief-${relief}-${side})"/>
      <g mask="url(#near-beam)" opacity="${glintOpacity}">
        <path d="${shape(pts)}" fill="#000" filter="url(#glint-${relief}-${side})"/>
      </g>
      <g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <g filter="url(#bloom)">${glow}</g>
        ${edges}
      </g>
    </g>`;
    },
  );
  const farPlanes = mountains.filter((_, i) => layers[i].relief === "far").join("");
  const nearPlanes = mountains.filter((_, i) => layers[i].relief !== "far").join("");

  /* Relief : hauteur = silhouette floutée (les pentes) + bruit (la roche).
     Deux éclairages depuis le faisceau : un diffus blanc qui module la teinte
     de base (ombres et faces claires), un spéculaire violet qui fait briller
     les facettes tournées vers la lumière. */
  /* La hauteur doit rester sous 1 : au-delà, librsvg la sature, le relief
     s'aplatit et le spéculaire éclaire toute la masse d'un gris uniforme.
     Deux filtres sur la même hauteur (même graine) : l'ombrage, sombre, et
     les reflets violets, posés à part pour être concentrés près du faisceau. */
  const height = ({ blur, noise, seed }) => `
      <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="slope"/>
      <feTurbulence type="fractalNoise" baseFrequency="0.016 0.045" numOctaves="5" seed="${seed}" result="grain"/>
      <feComposite in="grain" in2="slope" operator="arithmetic" k1="0" k2="${noise}" k3="${f((1 - noise) * 100) / 100}" k4="0" result="height"/>`;
  /* sRGB : en linearRGB sur 8 bits, les tons très sombres se quantifient
     (le vert tombe à 0 et la roche vire au magenta). */
  const shadeFilter = (id, o) => `
    <filter id="${id}" x="-2%" y="-10%" width="104%" height="120%" color-interpolation-filters="sRGB">${height(o)}
      <feDiffuseLighting in="height" surfaceScale="${o.depth}" diffuseConstant="1" lighting-color="#fff" result="diffuse">
        <feDistantLight azimuth="${o.azimuth}" elevation="30"/>
      </feDiffuseLighting>
      <feComposite in="SourceGraphic" in2="diffuse" operator="arithmetic" k1="${o.shade}" k2="0" k3="0" k4="0"/>
    </filter>`;
  const glintFilter = (id, o) => `
    <filter id="${id}" x="-2%" y="-10%" width="104%" height="120%" color-interpolation-filters="sRGB">${height(o)}
      <feSpecularLighting in="height" surfaceScale="${o.depth}" specularConstant="1" specularExponent="34" lighting-color="${VIOLET_BRIGHT}" result="spec">
        <feDistantLight azimuth="${o.azimuth}" elevation="20"/>
      </feSpecularLighting>
      <feComposite in="spec" in2="SourceAlpha" operator="in"/>
    </filter>`;
  const reliefs = [
    ["far", { blur: 8, noise: 0.3, depth: 12, shade: 1.8 }],
    ["mid", { blur: 7, noise: 0.4, depth: 20, shade: 1.7 }],
    ["near", { blur: 6, noise: 0.4, depth: 18, shade: 1.5 }],
  ]
    .flatMap(([name, o], k) =>
      [
        ["l", 320, 3 + k],
        ["r", 220, 7 + k],
      ].flatMap(([side, azimuth, seed]) => [
        shadeFilter(`relief-${name}-${side}`, { ...o, azimuth, seed }),
        glintFilter(`glint-${name}-${side}`, { ...o, azimuth, seed }),
      ]),
    )
    .join("");

  /* Rides du sol : fines, plus serrées vers l'horizon. */
  const ripples = [];
  for (let i = 0; i < 18; i++) {
    const t = (i + rnd() * 0.6) / 18;
    const y = HORIZON + 4 + t ** 1.7 * (H - HORIZON - 4);
    const x = rnd() * W;
    const w = 80 + rnd() * 320;
    const o = (1 - t) * 0.05 + 0.01;
    ripples.push(
      `<rect x="${f(x - w / 2)}" y="${f(y)}" width="${f(w)}" height="1" fill="${VIOLET_BRIGHT}" opacity="${f(o * 100) / 100}"/>`,
    );
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#201d3d"/>
      <stop offset="0.45" stop-color="#131126"/>
      <stop offset="1" stop-color="#0a0914"/>
    </linearGradient>
    <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1a1837"/>
      <stop offset="1" stop-color="#110f24"/>
    </linearGradient>
    <linearGradient id="near" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c0a17"/>
      <stop offset="1" stop-color="#050409"/>
    </linearGradient>
    <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#100e20"/>
      <stop offset="0.35" stop-color="#0a0914"/>
      <stop offset="1" stop-color="${CANVAS}"/>
    </linearGradient>
    <!-- Lumière du faisceau sur le sol, étalée vers l'horizon. -->
    <radialGradient id="spill" cx="0.5" cy="0" r="0.5" gradientTransform="translate(0.5 0) scale(0.5 1) translate(-0.5 0)">
      <stop offset="0" stop-color="${VIOLET}" stop-opacity="0.5"/>
      <stop offset="0.4" stop-color="${VIOLET}" stop-opacity="0.16"/>
      <stop offset="1" stop-color="${VIOLET}" stop-opacity="0"/>
    </radialGradient>
    <!-- Brume violette posée sur l'horizon. -->
    <radialGradient id="haze" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${VIOLET}" stop-opacity="0.22"/>
      <stop offset="0.6" stop-color="${INDIGO}" stop-opacity="0.06"/>
      <stop offset="1" stop-color="${INDIGO}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade-down" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fff" stop-opacity="0.75"/>
      <stop offset="0.55" stop-color="#fff" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="fade-x" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/>
      <stop offset="0.1" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.9" stop-color="#fff" stop-opacity="1"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <mask id="reflect-mask" maskUnits="userSpaceOnUse" x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}">
      <rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#fade-down)"/>
    </mask>
    <mask id="edges" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <rect width="${W}" height="${H}" fill="url(#fade-x)"/>
    </mask>
    <!-- Reflets de la roche : vifs près du faisceau, discrets au loin. -->
    <linearGradient id="beam-falloff" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0.08"/>
      <stop offset="0.25" stop-color="#fff" stop-opacity="0.2"/>
      <stop offset="0.4" stop-color="#fff" stop-opacity="0.55"/>
      <stop offset="0.5" stop-color="#fff" stop-opacity="1"/>
      <stop offset="0.6" stop-color="#fff" stop-opacity="0.55"/>
      <stop offset="0.75" stop-color="#fff" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0.08"/>
    </linearGradient>
    <mask id="near-beam" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <rect width="${W}" height="${H}" fill="url(#beam-falloff)"/>
    </mask>
    ${reliefs}
    <filter id="bloom" x="-5%" y="-50%" width="110%" height="200%">
      <feGaussianBlur stdDeviation="4"/>
    </filter>
    <filter id="soft" x="-5%" y="-50%" width="110%" height="200%">
      <feGaussianBlur stdDeviation="2.2"/>
    </filter>
    <!-- Brume basse entre les plans : les pieds des roches s'y perdent. -->
    <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${INDIGO}" stop-opacity="0"/>
      <stop offset="0.7" stop-color="${VIOLET}" stop-opacity="0.1"/>
      <stop offset="1" stop-color="${VIOLET}" stop-opacity="0.16"/>
    </linearGradient>
  </defs>

  <g mask="url(#edges)">
    <!-- Brume à l'horizon, derrière les roches. -->
    <ellipse cx="${CX}" cy="${HORIZON - 6}" rx="1150" ry="70" fill="url(#haze)"/>

    ${farPlanes}
    <rect x="0" y="${HORIZON - 70}" width="${W}" height="70" fill="url(#mist)"/>
    ${nearPlanes}

    <!-- Sol : surface sombre et lisse. -->
    <rect x="0" y="${HORIZON}" width="${W}" height="${H - HORIZON}" fill="url(#floor)"/>

    <!-- Reflet des roches, flou et estompé en s'éloignant de l'horizon. -->
    <g mask="url(#reflect-mask)">
      <g transform="translate(0 ${2 * HORIZON}) scale(1 -1)" filter="url(#soft)" opacity="0.55">
        ${layers.map((_, i) => `<use xlink:href="#m${i}"/>`).join("")}
      </g>
    </g>

    <!-- Lumière du faisceau étalée sur le sol, et fine ligne d'horizon. -->
    <rect x="${CX - 900}" y="${HORIZON}" width="1800" height="${H - HORIZON}" fill="url(#spill)"/>
    <rect x="${CX - 700}" y="${HORIZON}" width="1400" height="1" fill="${VIOLET_BRIGHT}" opacity="0.3"/>
    ${ripples.join("")}
  </g>
</svg>`;
}

async function main() {
  const svg = Buffer.from(build());
  const svgIndex = process.argv.indexOf("--svg");
  if (svgIndex > 0) {
    await writeFile(process.argv[svgIndex + 1], svg);
    return;
  }
  const previewIndex = process.argv.indexOf("--preview");
  if (previewIndex > 0) {
    const file = process.argv[previewIndex + 1];
    await sharp(svg, { density: 72 }).png().toFile(file);
    console.log(`Aperçu : ${file}`);
    return;
  }

  await mkdir(OUT, { recursive: true });
  const report = [];
  for (const width of WIDTHS) {
    // density : 72 dpi = 1 px CSS par unité ; on rastérise à la taille finale.
    const png = await sharp(svg, { density: (72 * width) / W }).png().toBuffer();
    const avif = await sharp(png).avif({ quality: 62, effort: 6 }).toBuffer();
    const webp = await sharp(png).webp({ quality: 80, alphaQuality: 90, effort: 6 }).toBuffer();
    await writeFile(join(OUT, `${NAME}-${width}.avif`), avif);
    await writeFile(join(OUT, `${NAME}-${width}.webp`), webp);
    report.push({ largeur: width, avif: `${Math.round(avif.length / 1024)} Ko`, webp: `${Math.round(webp.length / 1024)} Ko` });
  }
  console.table(report);
}

main();
