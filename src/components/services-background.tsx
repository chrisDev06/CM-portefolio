import { servicesNeon } from "@/lib/scenes/services-neon";
import { HeroScene, type SceneSource } from "./hero-scene";

/** Point de mise au point de la caméra : entre le portable et le téléphone. */
const FOCUS = { x: 0.76, y: 0.44 };

/** Doit suivre la largeur de .services-stage (globals.css). */
const SIZES_WIDE = "min(87vw, 1450px)";
const SIZES_NARROW = "min(180vw, 1100px)";

/** Mêmes paliers que .services-stage : sm (40rem) et lg (64rem). */
const SOURCES: SceneSource[] = [
  {
    media: "(width < 40rem)",
    sizes: SIZES_NARROW,
    maxWidth: servicesNeon.nativeWidth,
  },
  { media: "(width < 64rem)", sizes: SIZES_NARROW },
  { sizes: SIZES_WIDE },
];

/** Plan de l'écran du portable, relevé dans l'image : lignes à −4°, bord
    gauche incliné de 14° (la perspective). Coordonnées en pixels source. */
const SCREEN_PLANE = "rotate(-4) skewX(-14)";

/** Teinte de la dalle, pour masquer le logo factice de l'image. */
const SCREEN_TINT =
  "color-mix(in oklab, var(--color-violet) 16%, var(--color-canvas))";

/**
 * Ce qu'affiche l'écran du portable : le logo de l'agence à la place du logo
 * factice de l'image, et la signature dans l'espace vide au-dessus des lignes
 * de texte. Dans le plan net : suit la caméra, la mise au point et le fondu.
 */
function LaptopScreen({ brand, tagline }: { brand: string; tagline: string }) {
  const [mark, ...rest] = brand.split(" ");
  return (
    <svg
      viewBox="0 0 1672 941"
      className="absolute inset-0 size-full font-display"
    >
      <defs>
        <radialGradient id="services-screen-patch">
          <stop offset="0.55" style={{ stopColor: SCREEN_TINT }} />
          <stop offset="1" style={{ stopColor: SCREEN_TINT, stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <ellipse
        cx="1070"
        cy="306"
        rx="46"
        ry="15"
        fill="url(#services-screen-patch)"
      />
      <g transform={`translate(1040 312) ${SCREEN_PLANE}`}>
        <text fontSize="11" fontWeight="700" className="fill-ink/90">
          {mark.split("&").map((part, index) =>
            index === 0 ? (
              part
            ) : (
              <tspan key={index}>
                <tspan className="fill-magenta">&amp;</tspan>
                {part}
              </tspan>
            ),
          )}
          <tspan
            dx="4"
            fontWeight="500"
            letterSpacing="1.6"
            className="fill-violet-bright/80"
          >
            {rest.join(" ").toUpperCase()}
          </tspan>
        </text>
      </g>
      <g transform={`translate(1049 340) ${SCREEN_PLANE}`}>
        <text fontSize="16.5" fontWeight="500" className="fill-ink/95">
          {tagline.split("\n").map((line, index) => (
            <tspan key={line} x="0" y={index * 19}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    </svg>
  );
}

/**
 * Fond de la section Services de l'accueil : la scène néon des appareils (voir
 * HeroScene), en haut à droite en paysage, en bandeau au-dessus du texte sous
 * lg. Les cartes services passent sur le bas de l'image, fondu dans la nuit.
 */
export function ServicesBackground({
  brand,
  screenTagline,
}: {
  /** Nom de l'agence, affiché en logo sur l'écran du portable. */
  brand: string;
  /** Signature affichée sur l'écran, une ligne par « \n ». */
  screenTagline: string;
}) {
  return (
    <div
      data-hero
      data-state="loading"
      suppressHydrationWarning
      aria-hidden="true"
      className="hero-bg services-bg absolute inset-0 -z-10 overflow-hidden bg-canvas"
    >
      {/* Sous le premier écran : chargement différé, le hero passe d'abord. */}
      <HeroScene
        image={servicesNeon}
        focus={FOCUS}
        sources={SOURCES}
        className="services-stage"
        priority={false}
      >
        <LaptopScreen brand={brand} tagline={screenTagline} />
      </HeroScene>

      {/* Voile de lisibilité : le texte doit rester au-dessus de 4.5:1. */}
      <div className="services-scrim absolute inset-0 hidden lg:block" />
      {/* Le haut de l'image est coupé par la section : il sort de la nuit
          laissée par le hero au lieu de marquer une arête. */}
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-canvas to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-linear-to-t from-canvas to-transparent" />
    </div>
  );
}
