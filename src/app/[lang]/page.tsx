import type { CSSProperties } from "react";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { path, type ServiceId } from "@/i18n/config";
import {
  Button,
  Container,
  CtaBand,
  Icon,
  type IconName,
  Section,
} from "@/components/ui";
import { HeroServiceCard, TechRow } from "@/components/blocks";
import { HeroBackground } from "@/components/hero-background";
import { ServicesShowcase } from "@/components/services-showcase";
import { ModelShowcase } from "@/components/model-showcase";
import { DifferenceSection } from "@/components/difference";
import { DuoSection } from "@/components/duo";
import { MethodSection } from "@/components/method";
import { Typewriter } from "@/components/typewriter";

/** Icônes des atouts du hero, dans l'ordre de `home.heroFeatures`. */
const HERO_FEATURE_ICONS: IconName[] = ["bolt", "diamond", "user", "shieldCheck"];

/** Service lié et teinte des cartes du hero, dans l'ordre de `home.heroCards`. */
const HERO_CARDS: { id: ServiceId; accent: string }[] = [
  {
    id: "site-web",
    accent: "color-mix(in oklab, var(--color-violet) 60%, var(--color-magenta))",
  },
  { id: "e-commerce", accent: "var(--color-magenta)" },
  { id: "mobile", accent: "var(--color-indigo)" },
  { id: "sur-mesure", accent: "var(--color-violet)" },
];

/** Délai d'entrée d'un élément du hero, en secondes. */
const rise = (delay: number) => ({ "--d": `${delay}s` }) as CSSProperties;

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { home } = dict;

  return (
    <>
      {/* Hero plein écran : l'image passe sous le header translucide. */}
      <section className="relative -mt-16 flex min-h-dvh flex-col justify-end overflow-hidden pt-16">
        <HeroBackground />

        {/* Portrait : texte en haut, la scène occupe le bas de l'écran. */}
        <Container className="flex flex-1 flex-col justify-center py-8 portrait:justify-start portrait:pt-10 sm:py-16 [@media(max-height:899px)]:sm:py-6">
          <div className="hero-copy max-w-4xl">
            <p
              className="hero-rise text-xs uppercase tracking-[0.22em] text-ink/70"
              style={rise(0.35)}
            >
              <Typewriter text={home.eyebrow} delay={0.9} loop={false} />
            </p>
            <h1
              className="hero-rise mt-6 text-5xl max-[389px]:text-[2rem] sm:text-6xl [@media(max-height:760px)]:sm:text-5xl"
              style={rise(0.5)}
            >
              {home.titleStart}
              <br />
              <span className="text-gradient-bright">
                {home.titleHighlight}
              </span>
            </h1>
            <p
              className="hero-rise mt-7 max-w-xl text-lg leading-relaxed text-ink/85"
              style={rise(0.68)}
            >
              {home.subtitle}
            </p>
            <div
              className="hero-rise mt-9 flex flex-wrap gap-3"
              style={rise(0.84)}
            >
              <Button href={path("contact", locale)}>{home.ctaPrimary}</Button>
              {/* Verre dépoli : le bouton passe sur l'image en portrait. */}
              <Button
                href={path("models", locale)}
                variant="glass"
                icon={false}
              >
                {home.ctaSecondary}
              </Button>
            </div>
            <div
              className="glass hero-rise relative mt-10 w-fit rounded-md px-6 py-4 portrait:hidden [@media(max-height:760px)]:hidden"
              style={rise(0.98)}
            >
              <span aria-hidden="true" className="glass-edge" />
              <ul className="grid grid-cols-2 gap-x-8 gap-y-4 lg:flex lg:gap-0 lg:divide-x lg:divide-line-strong">
                {home.heroFeatures.map((feature, index) => (
                  <li
                    key={feature.title}
                    className="flex items-center gap-3 lg:px-6 lg:first:pl-0 lg:last:pr-0"
                  >
                    <Icon
                      name={HERO_FEATURE_ICONS[index] ?? "check"}
                      className="size-6 shrink-0 text-violet-bright drop-shadow-[0_0_10px_var(--color-violet)]"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {feature.title}
                      </p>
                      <p className="text-xs text-ink/70">{feature.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>

        {/* En portrait, ces cartes doublonnent la section Services juste
            en dessous : la place revient à la scène. */}
        <Container className="pb-10 portrait:hidden sm:pb-14 [@media(max-height:899px)]:sm:pb-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {home.heroCards.map((card, index) => (
              <HeroServiceCard
                key={card.title}
                {...HERO_CARDS[index]}
                title={card.title}
                text={card.text}
                locale={locale}
                className="hero-rise"
                style={rise(1.08 + index * 0.08)}
              />
            ))}
          </div>
        </Container>
      </section>

      {/* Services */}
      <ServicesShowcase locale={locale} dict={dict} />

      {/* Modèles */}
      <ModelShowcase locale={locale} dict={dict} />

      {/* Différence */}
      <DifferenceSection content={home.difference} />

      {/* Binôme */}
      <DuoSection content={home.duo} locale={locale} />

      {/* Méthode */}
      <MethodSection content={home.method} locale={locale} />

      {/* Technologies */}
      <Section className="py-14 sm:py-16">
        <Container>
          <TechRow eyebrow={dict.tech.eyebrow} items={dict.tech.items} />
        </Container>
      </Section>

      <CtaBand
        eyebrow={dict.cta.eyebrow}
        title={dict.cta.title}
        lead={dict.cta.lead}
        primary={{ href: path("contact", locale), label: dict.cta.button }}
        secondary={{
          href: path("models", locale),
          label: dict.cta.secondary,
        }}
      />
    </>
  );
}
