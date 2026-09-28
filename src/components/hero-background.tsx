import { heroNeon } from "@/lib/scenes/hero-neon";
import { HeroScene, type SceneSource } from "./hero-scene";

/** Point de mise au point de la caméra : entre l'arche et le portable. */
const FOCUS = { x: 0.56, y: 0.4 };

/** Doit suivre la largeur de .hero-stage (globals.css). */
const SIZES_LANDSCAPE = "min(84vw, 157vh)";
const SIZES_PORTRAIT = "160vw";

const SOURCES: SceneSource[] = [
  {
    media: "(orientation: portrait) and (max-width: 639px)",
    sizes: SIZES_PORTRAIT,
    maxWidth: heroNeon.nativeWidth,
  },
  { media: "(orientation: portrait)", sizes: SIZES_PORTRAIT },
  { sizes: SIZES_LANDSCAPE },
];

const veil = (pct: number) =>
  `color-mix(in oklab, var(--color-canvas) ${pct}%, transparent)`;

/** Assombrit le bord gauche ; la protection du texte, elle, suit le bloc
    de texte (.hero-copy) pour ne pas éteindre le portable. */
const SCRIM_LANDSCAPE = `linear-gradient(90deg,
  var(--color-canvas) 0%,
  ${veil(80)} 14%,
  ${veil(40)} 30%,
  ${veil(10)} 46%,
  transparent 60%)`;

/** Portrait : le texte est en haut sur le halo sombre, la scène en bas. */
const SCRIM_PORTRAIT = `linear-gradient(180deg,
  ${veil(35)} 0%,
  ${veil(20)} 40%,
  transparent 62%)`;

/** Vignette : assombrit les bords, garde le sujet lumineux. */
const VIGNETTE = `radial-gradient(ellipse 120% 100% at 60% 45%,
  transparent 42%,
  ${veil(30)} 74%,
  ${veil(72)} 100%)`;

/**
 * Fond du hero de l'accueil : la scène néon (voir HeroScene), décalée à
 * droite, et les voiles qui gardent le texte lisible.
 */
export function HeroBackground() {
  return (
    <div
      data-hero
      data-state="loading"
      suppressHydrationWarning
      aria-hidden="true"
      className="hero-bg absolute inset-0 -z-10 overflow-hidden bg-canvas"
    >
      <HeroScene
        image={heroNeon}
        focus={FOCUS}
        sources={SOURCES}
        className="hero-stage"
      >
        <div className="hero-glow" />
      </HeroScene>

      {/* Voiles de lisibilité : le texte doit rester au-dessus de 4.5:1. */}
      <div
        className="absolute inset-0 landscape:hidden"
        style={{ background: SCRIM_PORTRAIT }}
      />
      <div
        className="absolute inset-0 hidden landscape:block"
        style={{ background: SCRIM_LANDSCAPE }}
      />
      <div className="absolute inset-0" style={{ background: VIGNETTE }} />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-canvas to-transparent" />
    </div>
  );
}
