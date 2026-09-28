import type { CSSProperties } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container, Eyebrow, Icon, type IconName } from "./ui";
import { DifferenceDeck } from "./difference-deck";
import styles from "./difference.module.css";

/** Icônes des engagements, dans l'ordre de `home.difference.points`. */
const POINT_ICONS: IconName[] = ["user", "codeXml", "ban", "fileText"];

/** Icônes des deux atouts, dans l'ordre de `home.difference.features`. */
const FEATURE_ICONS: IconName[] = ["user", "diamond"];

/** Nœuds lumineux sur l'orbite principale : angle sur l'ellipse, avant sa
    rotation (0° à droite, sens horaire). Choisis hors des cartes : en haut à
    droite, à gauche près de l'orbe, en bas à gauche. */
const ORBIT_NODES = [-5, 170, 200];

/** Paysage généré par scripts/generate-difference-landscape.mjs. Affiché
    en 1500 px sous md, 3000 px au-delà (voir .landscape). */
const LANDSCAPE = "/images/sections/difference-landscape";
const LANDSCAPE_WIDTHS = [1500, 3000, 4500];
const LANDSCAPE_SIZES = "(min-width: 48rem) 3000px, 1500px";
const landscapeSet = (ext: "avif" | "webp") =>
  LANDSCAPE_WIDTHS.map((w) => `${LANDSCAPE}-${w}.${ext} ${w}w`).join(", ");

/**
 * « Notre différence » : le titre à gauche ; à droite, les quatre engagements
 * en cartes de verre inclinées vers un orbe, sur un faisceau qui tombe dans
 * un paysage néon. Le décor est aria-hidden : il reste une liste ordonnée.
 */
export function DifferenceSection({
  content,
}: {
  content: Dictionary["home"]["difference"];
}) {
  return (
    <section className={`hairline ${styles.section}`}>
      <Container className="grid items-center gap-20 xl:grid-cols-[minmax(0,1fr)_minmax(0,44rem)] xl:gap-10">
        <div className={styles.copy}>
          <div aria-hidden="true" className={styles.planet} />
          <div className="relative z-2">
            <Eyebrow neon>{content.eyebrow}</Eyebrow>
            <h2 className="mt-7 text-[clamp(2.25rem,2.9vw+1.5rem,4.25rem)] leading-[1.02] font-bold tracking-[-0.035em]">
              {content.titleStart}
              <br />
              <span className={styles.highlight}>{content.titleHighlight}</span>
            </h2>
            <p className="mt-7 max-w-[27rem] text-lg leading-[1.6] text-ink/80">
              {content.lead}
            </p>
            {/* Côte à côte, séparés d'un filet, dès que la colonne le permet. */}
            <div className="@container mt-10">
              <ul className="grid gap-5 @min-[30rem]:grid-cols-[auto_auto] @min-[30rem]:justify-start @min-[30rem]:gap-x-5">
                {content.features.map((feature, index) => (
                  <li
                    key={feature.title}
                    className="flex items-center gap-3.5 @min-[30rem]:not-first:border-l @min-[30rem]:not-first:border-line-strong @min-[30rem]:not-first:pl-5"
                  >
                    <span
                      className={`${styles.badge} flex size-13 shrink-0 items-center justify-center rounded-full`}
                    >
                      <Icon
                        name={FEATURE_ICONS[index] ?? "check"}
                        className="size-6"
                      />
                    </span>
                    <div>
                      <p className="text-[0.9375rem] font-medium text-ink">
                        {feature.title}
                      </p>
                      <p className="mt-1 max-w-[10.5rem] text-[0.65625rem] leading-[1.5] tracking-[0.08em] text-balance text-ink-muted uppercase">
                        {feature.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.stage}>
          {/* Centré sur le faisceau, il déborde de la scène : la section le
              rogne à ses bords. */}
          <div aria-hidden="true" className={styles.landscape}>
            <picture>
              <source
                type="image/avif"
                srcSet={landscapeSet("avif")}
                sizes={LANDSCAPE_SIZES}
              />
              <source
                type="image/webp"
                srcSet={landscapeSet("webp")}
                sizes={LANDSCAPE_SIZES}
              />
              <img
                src={`${LANDSCAPE}-3000.webp`}
                alt=""
                width={3000}
                height={400}
                loading="lazy"
                decoding="async"
              />
            </picture>
          </div>
          <div aria-hidden="true" className={styles.orbits}>
            <span className={styles.orbitMain} />
            {/* Même ellipse, sans fondu : les nœuds restent nets. */}
            <span className={styles.orbitNodes}>
              {ORBIT_NODES.map((angle) => (
                <i
                  key={angle}
                  className={styles.orbitNode}
                  style={{ "--t": `${angle}deg` } as CSSProperties}
                />
              ))}
            </span>
            <span className={styles.orbitDotted} />
          </div>
          <div aria-hidden="true" className={styles.pool} />

          {/* Faisceau, cartes et orbe dans le même plan : une carte qui tourne
              passe derrière le faisceau, puis devant. */}
          <div className={styles.board}>
            <div aria-hidden="true" className={styles.beam} />
            <DifferenceDeck className="grid gap-4 md:auto-rows-fr md:grid-cols-2 md:gap-x-22 md:gap-y-16">
              {content.points.map((point, index) => {
                const number = String(index + 1).padStart(2, "0");
                return (
                  <li key={point.title} className={styles.slot}>
                    <span aria-hidden="true" className={styles.slab} />
                    <div className={`${styles.card} h-full`}>
                      <span aria-hidden="true" className={styles.edge} />
                      <div className={`${styles.face} px-7 pt-5 pb-6`}>
                        <div className="flex items-center justify-between gap-4">
                          <span className="neon-tile flex size-14 items-center justify-center rounded-md">
                            <Icon
                              name={POINT_ICONS[index] ?? "check"}
                              className="size-7"
                            />
                          </span>
                          <span
                            aria-hidden="true"
                            className={`${styles.number} font-display text-lg`}
                          >
                            {number}
                          </span>
                        </div>
                        <h3 className="mt-4 text-lg leading-snug font-semibold text-ink">
                          {point.title}
                        </h3>
                        <p className="mt-2 text-[0.9375rem] leading-6 text-ink/70">
                          {point.text}
                        </p>
                      </div>
                      {/* Dos de la pancarte, vu pendant le tour : le « & » de
                          C&M, motif de la marque. */}
                      <div aria-hidden="true" className={styles.back}>
                        <span className={`${styles.backNumber} font-display text-lg`}>
                          {number}
                        </span>
                        <span className={`${styles.amp} font-display`}>&amp;</span>
                      </div>
                      <span aria-hidden="true" className={styles.fx}>
                        <span className={styles.sheen} />
                        <span data-ripple className={styles.ripple} />
                      </span>
                    </div>
                  </li>
                );
              })}
            </DifferenceDeck>

            <div aria-hidden="true" className={styles.dots} />
            <i aria-hidden="true" className={`${styles.node} ${styles.nodeTop}`} />
            <i aria-hidden="true" className={`${styles.node} ${styles.nodeUpper}`} />
            <i aria-hidden="true" className={`${styles.node} ${styles.nodeLower}`} />
            <i aria-hidden="true" className={`${styles.node} ${styles.nodeBottom}`} />
            <i aria-hidden="true" data-pulse className={styles.pulse} />
            <div aria-hidden="true" className={styles.orb}>
              <span data-flare className={styles.flare} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
