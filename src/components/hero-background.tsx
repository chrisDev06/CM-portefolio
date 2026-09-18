import ReactDOM from "react-dom";
import { HERO_LQIP, HERO_WIDTHS } from "@/lib/hero-image";

const NAME = "/images/hero/hero-neon";

const srcSet = (ext: "avif" | "webp") =>
  HERO_WIDTHS.map((w) => `${NAME}-${w}.${ext} ${w}w`).join(", ");

const FALLBACK = `${NAME}-${HERO_WIDTHS.at(-1)}.webp`;

const veil = (pct: number) =>
  `color-mix(in oklab, var(--color-canvas) ${pct}%, transparent)`;

/**
 * Le voile s'éteint vite vers la droite : le texte reste lisible dans le
 * premier quart, et le paysage garde toute sa présence sur le reste.
 */
const SCRIM_DESKTOP = `linear-gradient(96deg,
  var(--color-canvas) 0%,
  var(--color-canvas) 26%,
  ${veil(62)} 46%,
  ${veil(18)} 66%,
  transparent 82%)`;

const SCRIM_MOBILE = `linear-gradient(180deg,
  ${veil(76)} 0%,
  ${veil(66)} 42%,
  ${veil(80)} 100%)`;

/** Vignette cinéma : assombrit les bords, garde le centre lumineux. */
const VIGNETTE = `radial-gradient(ellipse 115% 95% at 58% 42%,
  transparent 36%,
  ${veil(32)} 72%,
  ${veil(76)} 100%)`;

/**
 * Fond plein écran du hero. <picture> plutôt que next/image : on veut
 * maîtriser l'AVIF, le srcset et la priorité de chargement à la main,
 * puisque c'est l'élément LCP de la page.
 */
export function HeroBackground() {
  // Préchargement dans le <head> : c'est l'élément LCP de la page.
  ReactDOM.preload(FALLBACK, {
    as: "image",
    type: "image/avif",
    imageSrcSet: srcSet("avif"),
    imageSizes: "100vw",
    fetchPriority: "high",
  });

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 overflow-hidden"
      style={{
        backgroundImage: `url(${HERO_LQIP})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <picture>
        <source type="image/avif" srcSet={srcSet("avif")} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet("webp")} sizes="100vw" />
        <img
          src={FALLBACK}
          alt=""
          decoding="async"
          fetchPriority="high"
          style={{ filter: "saturate(1.18) contrast(1.07)" }}
          className="hero-drift size-full object-cover object-[45%_50%] sm:object-center"
        />
      </picture>

      {/* Voiles de lisibilité : le texte doit rester au-dessus de 4.5:1. */}
      <div
        className="absolute inset-0 sm:hidden"
        style={{ background: SCRIM_MOBILE }}
      />
      <div
        className="absolute inset-0 hidden sm:block"
        style={{ background: SCRIM_DESKTOP }}
      />
      <div
        className="absolute inset-0 hidden sm:block"
        style={{ background: VIGNETTE }}
      />
      {/* Fondu vers la section suivante. */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-canvas to-transparent" />
    </div>
  );
}
