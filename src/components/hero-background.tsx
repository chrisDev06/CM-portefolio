import ReactDOM from "react-dom";
import { HERO_LQIP, HERO_WIDTHS } from "@/lib/hero-image";

const NAME = "/images/hero/hero-neon";

const srcSet = (ext: "avif" | "webp") =>
  HERO_WIDTHS.map((w) => `${NAME}-${w}.${ext} ${w}w`).join(", ");

const FALLBACK = `${NAME}-${HERO_WIDTHS.at(-1)}.webp`;

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
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <picture>
        <source type="image/avif" srcSet={srcSet("avif")} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet("webp")} sizes="100vw" />
        <img
          src={FALLBACK}
          alt=""
          decoding="async"
          fetchPriority="high"
          style={{
            backgroundImage: `url(${HERO_LQIP})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="size-full object-cover object-[38%_50%] sm:object-center"
        />
      </picture>

      {/* Voiles de lisibilité : le texte doit rester au-dessus de 4.5:1. */}
      <div className="absolute inset-0 bg-base/75 sm:hidden" />
      <div className="absolute inset-0 hidden sm:block sm:bg-linear-to-r sm:from-base sm:via-base/75 sm:to-base/10" />
      <div className="absolute inset-0 bg-linear-to-t from-base via-base/15 to-base/55" />
    </div>
  );
}
