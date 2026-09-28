import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { modelPath, path, type Locale, type ModelId } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  FitZonePreview,
  HorizonTravelPreview,
  ModelAppIcon,
} from "./model-previews";
import { Spotlight } from "./spotlight";
import { Container, Eyebrow, Icon, Section, type IconName } from "./ui";
import styles from "./model-showcase.module.css";

/** Icônes des atouts, dans l'ordre de `home.models.features`. */
const FEATURE_ICONS: IconName[] = ["bolt", "sliders", "devices"];

/** Étiquettes d'un modèle : type, secteur, point fort. */
const TAG_ICONS: Record<ModelId, readonly [IconName, IconName, IconName]> = {
  "horizon-travel": ["monitor", "globe", "diamond"],
  fitzone: ["mobile", "heart", "bars"],
  soundwave: ["cart", "sparkle", "chart"],
  greenenergy: ["gear", "bolt", "chart"],
};

/** Modèles mis en avant : les autres sont sur la page « Sites prêts à lancer ».
    `bleed` : la scène touche les bords de la carte (pas de cadre). */
const FEATURED: {
  id: ModelId;
  preview: (dict: Dictionary) => ReactNode;
  bleed?: boolean;
}[] = [
  {
    id: "horizon-travel",
    preview: (dict) => <HorizonTravelPreview dict={dict} />,
  },
  { id: "fitzone", preview: (dict) => <FitZonePreview dict={dict} />, bleed: true },
];

/** Ciel : étoiles à quatre branches (x en %, y en px, taille en px). */
const STARS = [
  { x: 49, y: 116, size: 22 },
  { x: 65.5, y: 150, size: 26 },
  { x: 87, y: 28, size: 16 },
  { x: 21, y: 92, size: 12 },
  { x: 97.5, y: 590, size: 18 },
];

/** … et simples points de lumière. */
const SPECKS = [
  { x: 36, y: 40 },
  { x: 62, y: 22 },
  { x: 78, y: 64 },
  { x: 93, y: 180 },
  { x: 8, y: 300 },
  { x: 55, y: 262 },
];

function ShowcaseCard({
  id,
  locale,
  dict,
  preview,
  bleed = false,
  flare = false,
}: {
  id: ModelId;
  locale: Locale;
  dict: Dictionary;
  preview: ReactNode;
  bleed?: boolean;
  /** Coin supérieur droit allumé. */
  flare?: boolean;
}) {
  const model = dict.models.items[id];
  const tags = [model.type, model.sector, model.highlight];
  const cta = (
    <>
      {dict.common.tryDemo}
      <Icon
        name="arrow"
        className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
      />
    </>
  );

  return (
    <Spotlight
      className={`glow-card glass group relative flex h-full flex-col rounded-lg ${styles.card}`}
    >
      <span aria-hidden="true" className="glass-edge z-10" />
      {flare ? (
        <>
          <span aria-hidden="true" className={styles.flare} />
          <span aria-hidden="true" className={styles.flareGlow} />
        </>
      ) : null}

      <div className={bleed ? styles.bleed : undefined}>{preview}</div>

      <div className="mt-auto pt-5">
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <li
              key={tag}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-canvas/40 py-1.5 pr-3.5 pl-3 text-xs text-ink/85"
            >
              <Icon
                name={TAG_ICONS[id][index]}
                className="size-4 text-violet-bright"
              />
              {tag}
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-5">
          <ModelAppIcon
            id={id}
            className="size-14 shrink-0 overflow-hidden rounded-md shadow-[0_0_0_1px_var(--color-line-strong),0_10px_24px_-12px_var(--color-violet)]"
          />
          <div className="min-w-0 flex-1 basis-52">
            <h3 className="text-xl font-semibold">
              {/* Lien étiré : toute la carte ouvre la fiche du modèle. */}
              <Link href={modelPath(id, locale)} className={styles.stretched}>
                {model.name}
              </Link>
            </h3>
            <p className="mt-1.5 text-sm leading-snug text-ink-muted">
              {model.tagline}
            </p>
          </div>
          {model.demo ? (
            <a
              href={model.demo}
              target="_blank"
              rel="noreferrer"
              className={`${styles.cta} z-20`}
            >
              {cta}
            </a>
          ) : (
            // Pas encore de démo en ligne : le bouton suit le lien de la carte.
            <span aria-hidden="true" className={styles.cta}>
              {cta}
            </span>
          )}
        </div>
      </div>
    </Spotlight>
  );
}

export function ModelShowcase({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const { models } = dict.home;

  return (
    <Section>
      <div aria-hidden="true" className={styles.sky}>
        <div className={styles.planet} />
        {STARS.map((star) => (
          <span
            key={`${star.x}-${star.y}`}
            className={styles.star}
            style={
              {
                left: `${star.x}%`,
                top: star.y,
                "--size": `${star.size}px`,
              } as CSSProperties
            }
          />
        ))}
        {SPECKS.map((speck) => (
          <span
            key={`${speck.x}-${speck.y}`}
            className={styles.speck}
            style={{ left: `${speck.x}%`, top: speck.y }}
          />
        ))}
      </div>

      <Container>
        {/* Titre sur deux colonnes, bouton à droite de sa première ligne,
            atouts à droite de l'introduction (xl). */}
        <div className="grid gap-x-10 lg:grid-cols-[minmax(0,36rem)_1fr_auto]">
          <div className="lg:col-span-3">
            <Eyebrow neon>{models.eyebrow}</Eyebrow>
          </div>
          <h2 className="mt-5 text-4xl font-bold sm:text-5xl lg:col-span-2 lg:text-[2.75rem]">
            {models.titleStart}
            <br />
            {models.titleEnd}{" "}
            {/* D'un seul tenant dès que la place le permet : la coupure
                tombe avant la fin colorée, jamais au milieu. */}
            <span className={`${styles.highlight} sm:whitespace-nowrap`}>
              {models.titleHighlight}
            </span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-muted lg:col-start-1">
            {models.lead}
          </p>
          <Link
            href={path("models", locale)}
            className={`${styles.cta} ${styles.ctaLarge} group mt-8 justify-self-start lg:col-start-3 lg:row-start-2 lg:mt-7 lg:self-start lg:justify-self-end`}
          >
            {dict.common.allModels}
            <Icon
              name="arrow"
              className="size-4.5 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
            />
          </Link>
          {/* Sous xl, pas la place à droite de l'introduction : une ligne à part. */}
          <ul className="mt-8 flex flex-wrap gap-x-7 gap-y-5 lg:col-span-3 xl:col-span-2 xl:col-start-2 xl:row-start-3 xl:mt-6 xl:self-start xl:justify-self-end">
            {models.features.map((feature, index) => (
              <li key={feature.title} className="flex items-center gap-3">
                <span className={styles.featureIcon}>
                  <Icon
                    name={FEATURE_ICONS[index] ?? "check"}
                    className="size-4"
                  />
                </span>
                <span className="text-xs leading-snug">
                  <span className="block font-medium text-ink">
                    {feature.title}
                  </span>
                  <span className="block text-ink-muted">{feature.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-8 grid gap-5 lg:grid-cols-[1.14fr_1fr]">
          <div aria-hidden="true" className={`${styles.backlight} max-lg:hidden`} />
          {FEATURED.map(({ id, preview, bleed }, index) => (
            <ShowcaseCard
              key={id}
              id={id}
              locale={locale}
              dict={dict}
              preview={preview(dict)}
              bleed={bleed}
              flare={index === 0}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
