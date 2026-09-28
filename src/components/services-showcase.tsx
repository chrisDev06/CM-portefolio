import { serviceIds, type Locale, type ServiceId } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { ServiceShowcaseCard } from "./blocks";
import { ServicesBackground } from "./services-background";
import { Container, Eyebrow, Icon, type IconName } from "./ui";

/** Icônes des atouts, dans l'ordre de `home.services.features`. */
const FEATURE_ICONS: IconName[] = ["user", "diamond", "heart", "bars"];

/** Service mis en avant : liseré néon et pastille « Populaire ». */
const FEATURED: ServiceId = "e-commerce";

/**
 * Section Services de l'accueil : la scène néon des appareils en fond (voir
 * ServicesBackground), le titre, quatre atouts et les six services en cartes
 * de verre illustrées, posées sur le sol de la scène.
 */
export function ServicesShowcase({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const content = dict.home.services;

  return (
    <section className="relative overflow-hidden">
      <ServicesBackground
        brand={dict.meta.siteName}
        screenTagline={content.screen}
      />

      {/* Sous lg, le texte démarre sous les appareils (.services-stage).
          À partir de lg, la colonne de texte suit --copy (.services-bg). */}
      <Container className="pt-[calc(4rem+min(48vw,17.5rem))] pb-16 sm:pb-20 lg:pt-25 lg:pb-24">
        <div className="max-w-[42rem] lg:max-w-[30rem] xl:max-w-[42rem]">
          <Eyebrow neon>{content.eyebrow}</Eyebrow>
          <h2 className="mt-5 text-[2.25rem] leading-[0.98] font-bold sm:text-5xl lg:text-[2.75rem] lg:leading-[0.93] xl:text-5xl">
            {content.titleStart}{" "}
            {/* En bloc : chaque ligne repart du violet, comme sur la maquette.
                Le dégradé ne peint que la boîte : le rembourrage (compensé)
                lui fait couvrir accents et jambages malgré l'interlignage. */}
            <span className="text-gradient-neon -my-[0.12em] block py-[0.12em]">
              {content.titleHighlight}
            </span>
          </h2>
          {/* Les retours à la ligne du texte sont ceux de la maquette : tenus
              à partir de xl, ailleurs le texte s'écoule librement. */}
          <p className="mt-5 max-w-[37.5rem] leading-snug text-ink/85 xl:whitespace-pre-line">
            {content.lead}
          </p>
        </div>

        {/* En ligne à partir de xl seulement : plus étroit, les intitulés
            passeraient sur deux lignes. */}
        <ul className="services-features mt-7 grid w-fit gap-x-8 gap-y-4 sm:grid-cols-2 sm:gap-y-5 xl:flex xl:items-center xl:gap-0">
          {content.features.map((feature, index) => (
            <li
              key={feature.title}
              className="relative flex items-center gap-3.5 xl:px-6 xl:first:pl-0 xl:not-first:before:absolute xl:not-first:before:top-1/2 xl:not-first:before:left-0 xl:not-first:before:h-7 xl:not-first:before:w-px xl:not-first:before:-translate-y-1/2 xl:not-first:before:bg-line-strong"
            >
              <span className="neon-tile inline-flex size-10 shrink-0 items-center justify-center rounded-md">
                <Icon name={FEATURE_ICONS[index] ?? "check"} className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{feature.title}</p>
                <p className="mt-0.5 text-xs text-ink/70">{feature.text}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Une carte loge texte et illustration côte à côte à partir de
            ~390 px de large : deux colonnes à lg, trois à xl. */}
        <div className="mt-6 grid gap-x-4 gap-y-3 lg:grid-cols-2 xl:grid-cols-3">
          {serviceIds.map((id) => (
            <ServiceShowcaseCard
              key={id}
              id={id}
              locale={locale}
              dict={dict}
              featured={id === FEATURED}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
