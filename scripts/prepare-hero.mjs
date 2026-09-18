/**
 * Prépare l'image du hero : étalonnage cuit, accentuation, AVIF + WebP
 * multi-résolutions, et un arrière-plan étendu et flouté pour la profondeur.
 *
 * node scripts/prepare-hero.mjs "<chemin/vers/source.png>"
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
const NAME = "hero-neon";

const DOWN_TARGETS = [960, 1280];
const UP_TARGETS = [2240, 2880];
const MAX_UPSCALE = 1.75;

const AVIF = { quality: 80, effort: 6, chromaSubsampling: "4:4:4" };
const WEBP = { quality: 86, effort: 6, smartSubsample: true };

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

const source = process.argv[2];
if (!source) {
  console.error("Usage : node scripts/prepare-hero.mjs <source>");
  process.exit(1);
}

const graded = () =>
  sharp(source, { limitInputPixels: false })
    .modulate({ saturation: SATURATION })
    .linear(CONTRAST, -128 * (CONTRAST - 1));

async function main() {
  await mkdir(OUT, { recursive: true });
  for (const file of await readdir(OUT)) {
    if (file.startsWith(`${NAME}-`)) await rm(join(OUT, file));
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
    await writeFile(join(OUT, `${NAME}-${width}.avif`), avif);
    await writeFile(join(OUT, `${NAME}-${width}.webp`), webp);
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
    join(ROOT, "src", "lib", "hero-image.ts"),
    `// Généré par scripts/prepare-hero.mjs — ne pas modifier à la main.
export const HERO_INTRINSIC = { width: ${native}, height: ${meta.height} } as const;

/** Largeurs disponibles ; au-delà de ${native}, agrandies au build. */
export const HERO_WIDTHS = [${widths.join(", ")}] as const;
export const HERO_NATIVE_WIDTH = ${native};

/** La scène floutée sur le fond du site : plan lointain, halo lumineux. */
export const HERO_BACKDROP =
  "data:image/webp;base64,${backdrop.toString("base64")}";

/** Marges du plan lointain, en fraction de la taille de l'image. */
export const HERO_BACKDROP_PAD = {
  left: ${frac(pad.left, bw)},
  right: ${frac(pad.right, bw)},
  top: ${frac(pad.top, bh)},
  bottom: ${frac(pad.bottom, bh)},
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
}

main();
