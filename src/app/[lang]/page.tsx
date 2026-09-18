import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { modelIds, path, serviceIds } from "@/i18n/config";
import {
  Button,
  Card,
  Container,
  CtaBand,
  Glow,
  Icon,
  Section,
  SectionHeading,
  Stat,
  Tag,
} from "@/components/ui";
import {
  DuoFlow,
  ModelCard,
  NumberedStep,
  PersonCard,
  ServiceCard,
  TechRow,
} from "@/components/blocks";
import { HeroBackground } from "@/components/hero-background";

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { home } = dict;

  return (
    <>
      {/* Hero plein écran : l'image passe sous le header translucide. */}
      <section className="relative -mt-16 flex min-h-dvh flex-col justify-end overflow-hidden pt-16">
        <HeroBackground />

        <Container className="flex flex-1 flex-col justify-center py-20 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">
              {home.eyebrow}
            </p>
            <h1 className="mt-6 text-5xl sm:text-6xl">
              {home.titleStart}
              <br />
              <span className="text-gradient">{home.titleHighlight}</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-muted">
              {home.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href={path("contact", locale)}>{home.ctaPrimary}</Button>
              <Button
                href={path("models", locale)}
                variant="ghost"
                icon={false}
              >
                {home.ctaSecondary}
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-2">
              {home.heroTags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </div>
        </Container>

        <Container className="pb-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {home.heroCards.map((card) => (
              <Card
                key={card.title}
                interactive
                className="bg-surface/70 p-4 backdrop-blur-md sm:p-6"
              >
                <h2 className="text-base sm:text-lg">{card.title}</h2>
                <p className="mt-2 text-xs text-ink-muted sm:text-sm">
                  {card.text}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      <Section className="py-12 sm:py-14">
        <Container>
          <div className="flex flex-wrap gap-x-16 gap-y-8">
            {home.facts.map((fact) => (
              <Stat key={fact.label} value={fact.value} label={fact.label} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Services */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow={home.services.eyebrow}
            title={home.services.title}
            lead={home.services.lead}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceIds.map((id) => (
              <ServiceCard key={id} id={id} locale={locale} dict={dict} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Modèles */}
      <Section>
        <Glow
          className="right-0 top-20 size-[420px]"
          from="var(--color-magenta)"
        />
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={home.models.eyebrow}
              title={home.models.title}
              lead={home.models.lead}
            />
            <Button
              href={path("models", locale)}
              variant="ghost"
              className="shrink-0"
            >
              {dict.common.allModels}
            </Button>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {modelIds.map((id) => (
              <ModelCard key={id} id={id} locale={locale} dict={dict} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Différence */}
      <Section>
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr]">
            <SectionHeading
              eyebrow={home.difference.eyebrow}
              title={home.difference.title}
              lead={home.difference.lead}
            />
            <div className="grid gap-6 sm:grid-cols-2">
              {home.difference.points.map((point) => (
                <Card key={point.title}>
                  <Icon name="check" className="size-5 text-violet" />
                  <h3 className="mt-4 text-lg">{point.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {point.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Binôme */}
      <Section>
        <Glow className="left-1/2 top-0 size-[520px] -translate-x-1/2" />
        <Container>
          <SectionHeading
            eyebrow={home.duo.eyebrow}
            title={home.duo.title}
            lead={home.duo.lead}
            align="center"
          />
          <div className="mt-12">
            <DuoFlow nodes={home.duo.flow} />
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {home.duo.people.map((person) => (
              <PersonCard
                key={person.name}
                name={person.name}
                role={person.role}
                text={person.text}
              />
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <Button href={path("agency", locale)} variant="ghost">
              {home.duo.cta}
            </Button>
          </div>
        </Container>
      </Section>

      {/* Méthode */}
      <Section>
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow={home.method.eyebrow}
              title={home.method.title}
              lead={home.method.lead}
            />
            <Button
              href={path("method", locale)}
              variant="ghost"
              className="shrink-0"
            >
              {home.method.cta}
            </Button>
          </div>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {home.method.steps.map((step, index) => (
              <NumberedStep
                key={step.title}
                index={index}
                title={step.title}
                text={step.text}
              />
            ))}
          </div>
        </Container>
      </Section>

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
