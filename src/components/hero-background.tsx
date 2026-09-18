import type { CSSProperties } from "react";
import {
  HERO_BACKDROP,
  HERO_BACKDROP_PAD as PAD,
  HERO_INTRINSIC,
  HERO_NATIVE_WIDTH,
  HERO_WIDTHS,
} from "@/lib/hero-image";
import { HeroCamera } from "./hero-camera";

const NAME = "/images/hero/hero-neon";

/** Point de mise au point de la caméra : entre l'arche et le portable. */
const FOCUS = { x: 0.56, y: 0.4 };

const srcSet = (ext: "avif" | "webp", maxWidth = Infinity) =>
  HERO_WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${NAME}-${w}.${ext} ${w}w`)
    .join(", ");

/** Doit suivre la largeur de .hero-stage (globals.css). */
const SIZES_LANDSCAPE = "min(84vw, 157vh)";
const SIZES_PORTRAIT = "160vw";

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

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

/** Le plan lointain déborde du plan net selon les marges générées. */
const FAR_BOX: CSSProperties = {
  left: pct(-PAD.left),
  top: pct(-PAD.top),
  width: pct(1 + PAD.left + PAD.right),
  height: pct(1 + PAD.top + PAD.bottom),
  transformOrigin: `${pct((PAD.left + FOCUS.x) / (1 + PAD.left + PAD.right))} ${pct(
    (PAD.top + FOCUS.y) / (1 + PAD.top + PAD.bottom),
  )}`,
};

/**
 * Fond du hero, en deux plans :
 * - lointain : la scène floutée, dont la lumière déborde en halo ;
 * - net : l'image entière, jamais recadrée, bords fondus dans le halo.
 * La caméra dérive lentement (CSS) et suit le curseur / le défilement (JS).
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
      <HeroCamera className="absolute inset-0">
        <div
          className="hero-stage"
          style={
            {
              "--fx": pct(FOCUS.x),
              "--fy": pct(FOCUS.y),
            } as CSSProperties
          }
        >
          <div className="hero-drift">
            <div data-plane="far" className="hero-plane">
              <div className="hero-far" style={FAR_BOX}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={HERO_BACKDROP} alt="" className="size-full" />
              </div>
            </div>

            <div data-plane="near" className="hero-plane">
              <div className="hero-near">
                <picture>
                  <source
                    media="(orientation: portrait) and (max-width: 639px)"
                    type="image/avif"
                    srcSet={srcSet("avif", HERO_NATIVE_WIDTH)}
                    sizes={SIZES_PORTRAIT}
                  />
                  <source
                    media="(orientation: portrait) and (max-width: 639px)"
                    type="image/webp"
                    srcSet={srcSet("webp", HERO_NATIVE_WIDTH)}
                    sizes={SIZES_PORTRAIT}
                  />
                  <source
                    media="(orientation: portrait)"
                    type="image/avif"
                    srcSet={srcSet("avif")}
                    sizes={SIZES_PORTRAIT}
                  />
                  <source
                    media="(orientation: portrait)"
                    type="image/webp"
                    srcSet={srcSet("webp")}
                    sizes={SIZES_PORTRAIT}
                  />
                  <source
                    type="image/avif"
                    srcSet={srcSet("avif")}
                    sizes={SIZES_LANDSCAPE}
                  />
                  <source
                    type="image/webp"
                    srcSet={srcSet("webp")}
                    sizes={SIZES_LANDSCAPE}
                  />
                  <img
                    data-hero-img
                    src={`${NAME}-${HERO_NATIVE_WIDTH}.webp`}
                    alt=""
                    width={HERO_INTRINSIC.width}
                    height={HERO_INTRINSIC.height}
                    decoding="async"
                    fetchPriority="high"
                    className="size-full"
                  />
                </picture>
                <div className="hero-glow" />
              </div>
            </div>
          </div>
        </div>
      </HeroCamera>


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
