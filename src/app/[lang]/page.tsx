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
  HeroVisual,
  ModelCard,
  NumberedStep,
  PersonCard,
  ServiceCard,
  TechRow,
} from "@/components/blocks";

export default async function HomePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { home } = dict;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <Glow className="-top-32 left-1/4 size-[600px]" />
        <Glow
          className="-top-10 right-0 size-[460px]"
          from="var(--color-magenta)"
        />
        <Container className="py-16 sm:py-24">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
            <div>
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
                <Button href={path("contact", locale)}>
                  {home.ctaPrimary}
                </Button>
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

            <HeroVisual dict={dict} />
          </div>

          <div className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {home.heroCards.map((card) => (
              <Card key={card.title} interactive>
                <h2 className="text-lg">{card.title}</h2>
                <p className="mt-2 text-sm text-ink-muted">{card.text}</p>
              </Card>
            ))}
          </div>

          <div className="mt-16 flex flex-wrap gap-x-16 gap-y-8">
            {home.facts.map((fact) => (
              <Stat key={fact.label} value={fact.value} label={fact.label} />
            ))}
          </div>
        </Container>
      </section>

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
        <Glow className="right-0 top-20 size-[420px]" from="var(--color-magenta)" />
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

