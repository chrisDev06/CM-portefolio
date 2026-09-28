import type { CSSProperties, ReactNode } from "react";
import { HeroCamera } from "./hero-camera";

/** Image de scène préparée par `npm run hero` (voir src/lib/scenes/). */
export type SceneImage = {
  readonly src: string;
  readonly intrinsic: { readonly width: number; readonly height: number };
  readonly widths: readonly number[];
  readonly nativeWidth: number;
  readonly backdrop: string;
  readonly backdropPad: {
    readonly left: number;
    readonly right: number;
    readonly top: number;
    readonly bottom: number;
  };
};

/** Une paire de <source> AVIF + WebP : la largeur affichée pour un média. */
export type SceneSource = {
  media?: string;
  /** Doit suivre la largeur de la classe de placement (globals.css). */
  sizes: string;
  /** Plafonne la variante servie, pour ne pas envoyer d'agrandies au mobile. */
  maxWidth?: number;
};

const pct = (n: number) => `${(n * 100).toFixed(3)}%`;

/**
 * Scène de hero, en deux plans :
 * - lointain : la scène floutée, dont la lumière déborde en halo ;
 * - net : l'image entière, jamais recadrée, bords fondus dans le halo.
 * La caméra dérive lentement (CSS) et suit le curseur / le défilement (JS).
 * À poser dans un parent `[data-hero]` : il porte l'état de révélation.
 */
export function HeroScene({
  image,
  focus,
  sources,
  className,
  priority = true,
  children,
}: {
  image: SceneImage;
  /** Point de mise au point de la caméra, en fraction de l'image. */
  focus: { x: number; y: number };
  sources: SceneSource[];
  /** Placement de la scène : .hero-stage, .services-stage… */
  className: string;
  /** Premier écran (image LCP). Plus bas dans la page : chargement différé,
      pour ne pas disputer la bande passante à l'image du hero. */
  priority?: boolean;
  /** Calques posés sur l'image nette (lueurs). */
  children?: ReactNode;
}) {
  const { src, intrinsic, nativeWidth, backdropPad: pad } = image;

  const srcSet = (ext: "avif" | "webp", maxWidth = Infinity) =>
    image.widths
      .filter((w) => w <= maxWidth)
      .map((w) => `${src}-${w}.${ext} ${w}w`)
      .join(", ");

  /** Le plan lointain déborde du plan net selon les marges générées. */
  const farBox: CSSProperties = {
    left: pct(-pad.left),
    top: pct(-pad.top),
    width: pct(1 + pad.left + pad.right),
    height: pct(1 + pad.top + pad.bottom),
    transformOrigin: `${pct((pad.left + focus.x) / (1 + pad.left + pad.right))} ${pct(
      (pad.top + focus.y) / (1 + pad.top + pad.bottom),
    )}`,
  };

  return (
    <HeroCamera className="absolute inset-0">
      <div
        className={className}
        style={
          {
            "--fx": pct(focus.x),
            "--fy": pct(focus.y),
          } as CSSProperties
        }
      >
        <div className="hero-drift">
          <div data-plane="far" className="hero-plane">
            <div className="hero-far" style={farBox}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.backdrop} alt="" className="size-full" />
            </div>
          </div>

          <div data-plane="near" className="hero-plane">
            <div className="hero-near">
              <picture>
                {sources.flatMap(({ media, sizes, maxWidth }) =>
                  (["avif", "webp"] as const).map((ext) => (
                    <source
                      key={`${media ?? "all"}-${ext}`}
                      media={media}
                      type={`image/${ext}`}
                      srcSet={srcSet(ext, maxWidth)}
                      sizes={sizes}
                    />
                  )),
                )}
                <img
                  data-hero-img
                  src={`${src}-${nativeWidth}.webp`}
                  alt=""
                  width={intrinsic.width}
                  height={intrinsic.height}
                  decoding="async"
                  loading={priority ? undefined : "lazy"}
                  fetchPriority={priority ? "high" : undefined}
                  className="size-full"
                />
              </picture>
              {children}
            </div>
          </div>
        </div>
      </div>
    </HeroCamera>
  );
}
