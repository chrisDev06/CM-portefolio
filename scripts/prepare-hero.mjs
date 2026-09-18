/**
 * Convertit l'image de fond du hero en AVIF + WebP multi-résolutions.
 *
 * node scripts/prepare-hero.mjs "<chemin/vers/source.png>"
 *
 * On ne génère jamais plus large que la source : agrandir un fichier
 * n'ajoute aucun détail, ça ne fait qu'alourdir la page.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "images", "hero");
const NAME = "hero-neon";

const TARGET_WIDTHS = [960, 1280, 1600, 1920, 2560];
const AVIF = { quality: 74, effort: 6, chromaSubsampling: "4:4:4" };
const WEBP = { quality: 84, effort: 6 };

const source = process.argv[2];
if (!source) {
  console.error("Usage : node scripts/prepare-hero.mjs <source>");
  process.exit(1);
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const input = sharp(source, { limitInputPixels: false });
  const meta = await input.metadata();
  console.log(`Source : ${basename(source)} — ${meta.width}×${meta.height}`);

  const widths = TARGET_WIDTHS.filter((w) => w <= meta.width);
  if (widths.at(-1) !== meta.width) widths.push(meta.width);

  const report = [];
  for (const width of widths) {
    const resized = () =>
      sharp(source).resize({ width, kernel: "lanczos3", withoutEnlargement: true });

    const avif = await resized().avif(AVIF).toBuffer();
    const webp = await resized().webp(WEBP).toBuffer();

    await writeFile(join(OUT, `${NAME}-${width}.avif`), avif);
    await writeFile(join(OUT, `${NAME}-${width}.webp`), webp);
    report.push({ width, avif: avif.length, webp: webp.length });
  }

  // Miniature floutée en base64 : évite le flash de fond noir au chargement.
  const lqip = await sharp(source)
    .resize({ width: 24 })
    .blur(1)
    .webp({ quality: 40 })
    .toBuffer();

  await writeFile(
    join(ROOT, "src", "lib", "hero-image.ts"),
    `// Généré par scripts/prepare-hero.mjs — ne pas modifier à la main.
export const HERO_WIDTHS = [${widths.join(", ")}] as const;
export const HERO_INTRINSIC = { width: ${meta.width}, height: ${meta.height} };
export const HERO_LQIP =
  "data:image/webp;base64,${lqip.toString("base64")}";
`,
    "utf8",
  );

  const kb = (n) => `${(n / 1024).toFixed(0)} Ko`;
  console.table(
    report.map((r) => ({
      largeur: r.width,
      avif: kb(r.avif),
      webp: kb(r.webp),
    })),
  );
  console.log(`LQIP : ${kb(lqip.length)} inline`);
}

main();
