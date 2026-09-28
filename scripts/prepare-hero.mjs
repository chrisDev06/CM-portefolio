/**
 * Prépare une image de hero : étalonnage cuit, accentuation, AVIF + WebP
 * multi-résolutions, et un arrière-plan étendu et flouté pour la profondeur.
 *
 * node scripts/prepare-hero.mjs "<chemin/vers/source.png>" [nom] [--section]
 *
 * `nom` (kebab-case, « hero-neon » par défaut) préfixe les fichiers produits
 * dans public/images/hero/ et nomme le module src/lib/scenes/<nom>.ts.
 *
 * `--section` : scène plus bas dans la page, pas l'image LCP. Budget de
 * 180 Ko au lieu de 250 (docs/ASSETS.md §9) : qualité un cran en dessous,
 * sans différence visible sur ces scènes sombres.
 *
 * Au-delà de la largeur native, les variantes sont agrandies ici (Lanczos3 +
 * accentuation) plutôt que par le navigateur : c'est plus net, sans inventer
 * de détail. Elles ne sont servies qu'aux grands écrans et écrans Retina.
 */
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "hero");
const MODULES = join(ROOT, "src", "lib", "scenes");

const DOWN_TARGETS = [960, 1280];
const UP_TARGETS = [2240, 2880];
const MAX_UPSCALE = 1.75;

const args = process.argv.slice(2);
const section = args.includes("--section");

const AVIF = { quality: section ? 74 : 80, effort: 6, chromaSubsampling: "4:4:4" };
const WEBP = { quality: section ? 80 : 86, effort: 6, smartSubsample: true };

// Étalonnage autrefois appliqué en filtre CSS à chaque image : cuit une fois.
const SATURATION = 1.14;
const CONTRAST = 1.06;
const SHARPEN_NATIVE = { sigma: 0.7, m1: 0.6, m2: 1.4, x1: 2, y2: 8, y3: 12 };
const SHARPEN_UPSCALED = { sigma: 1.0, m1: 0.7, m2: 1.6, x1: 2, y2: 8, y3: 12 };

// Arrière-plan : la scène posée sur le fond du site puis très floutée. La
// lumière déborde et s'éteint d'elle-même, comme un halo dans la brume.
// (Recopier les bords créait des traînées nettes : le néon filait en laser.)
const BACKDROP_WIDTH = 200;
const BACKDROP_PAD = { left: 0.6, right: 0.6, top: 1.3, bottom: 0.9 };
const BACKDROP_BLUR = 9;
const CANVAS = { r: 8, g: 8, b: 12, alpha: 1 };

const [source, name = "hero-neon"] = args.filter((arg) => !arg.startsWith("--"));
if (!source) {
  console.error("Usage : node scripts/prepare-hero.mjs <source> [nom] [--section]");
  process.exit(1);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
  console.error(`Nom invalide : « ${name} ». Attendu : kebab-case, sans accent.`);
  process.exit(1);
}

/** hero-neon → heroNeon : nom de l'export du module généré. */
const exportName = name.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());

const graded = () =>
  sharp(source, { limitInputPixels: false })
    .modulate({ saturation: SATURATION })
    .linear(CONTRAST, -128 * (CONTRAST - 1));

async function main() {
  await mkdir(OUT, { recursive: true });
  await mkdir(MODULES, { recursive: true });
  for (const file of await readdir(OUT)) {
    if (file.startsWith(`${name}-`)) await rm(join(OUT, file));
  }

  const meta = await sharp(source).metadata();
  const native = meta.width;
  console.log(`Source : ${basename(source)} — ${native}×${meta.height}`);

  const widths = [
    ...DOWN_TARGETS.filter((w) => w < native),
    native,
    ...UP_TARGETS.filter((w) => w > native && w <= native * MAX_UPSCALE),
  ];

  const report = [];
  for (const width of widths) {
    const upscaled = width > native;
    const pipeline = () =>
      graded()
        .resize({ width, kernel: "lanczos3" })
        .sharpen(upscaled ? SHARPEN_UPSCALED : SHARPEN_NATIVE);

    const avif = await pipeline().avif(AVIF).toBuffer();
    const webp = await pipeline().webp(WEBP).toBuffer();
    await writeFile(join(OUT, `${name}-${width}.avif`), avif);
    await writeFile(join(OUT, `${name}-${width}.webp`), webp);
    report.push({ width, upscaled, avif: avif.length, webp: webp.length });
  }

  // Deux passes : agrandir la toile d'abord, flouter ensuite, sinon le flou
  // s'arrête net au bord de l'image d'origine.
  const small = await graded()
    .resize({ width: BACKDROP_WIDTH, kernel: "lanczos3" })
    .png()
    .toBuffer();
  const { width: bw, height: bh } = await sharp(small).metadata();
  const pad = {
    left: Math.round(BACKDROP_PAD.left * bw),
    right: Math.round(BACKDROP_PAD.right * bw),
    top: Math.round(BACKDROP_PAD.top * bh),
    bottom: Math.round(BACKDROP_PAD.bottom * bh),
  };
  const extended = await sharp(small)
    .extend({ ...pad, background: CANVAS })
    .png()
    .toBuffer();
  const backdrop = await sharp(extended)
    .blur(BACKDROP_BLUR)
    .webp({ quality: 58 })
    .toBuffer();

  const frac = (n, d) => Number((n / d).toFixed(4));
  await writeFile(
    join(MODULES, `${name}.ts`),
    `// Généré par scripts/prepare-hero.mjs — ne pas modifier à la main.
export const ${exportName} = {
  src: "/images/hero/${name}",
  intrinsic: { width: ${native}, height: ${meta.height} },
  /** Largeurs disponibles ; au-delà de ${native}, agrandies au build. */
  widths: [${widths.join(", ")}],
  nativeWidth: ${native},
  /** La scène floutée sur le fond du site : plan lointain, halo lumineux. */
  backdrop:
    "data:image/webp;base64,${backdrop.toString("base64")}",
  /** Marges du plan lointain, en fraction de la taille de l'image. */
  backdropPad: {
    left: ${frac(pad.left, bw)},
    right: ${frac(pad.right, bw)},
    top: ${frac(pad.top, bh)},
    bottom: ${frac(pad.bottom, bh)},
  },
} as const;
`,
    "utf8",
  );

  const kb = (n) => `${(n / 1024).toFixed(0)} Ko`;
  console.table(
    report.map((r) => ({
      largeur: r.width,
      origine: r.upscaled ? "agrandie au build" : "native / réduite",
      avif: kb(r.avif),
      webp: kb(r.webp),
    })),
  );
  console.log(`Arrière-plan flou : ${kb(backdrop.length)} inline`);
  console.log(`Module : src/lib/scenes/${name}.ts (export ${exportName})`);
}

main();
