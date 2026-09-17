import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { path, serviceIds, servicePath } from "@/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import {
  Card,
  Container,
  CtaBand,
  Icon,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/ui";
import { SERVICE_ICONS } from "@/components/blocks";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return localizedMetadata({
    locale,
    title: dict.services.hero.title,
    description: dict.services.hero.lead,
    urls: { fr: path("services", "fr"), en: path("services", "en") },
  });
}

export default async function ServicesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { hero, items, labels } = dict.services;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
      />

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            {serviceIds.map((id) => {
              const service = items[id];
              return (
                <Link
                  key={id}
                  href={servicePath(id, locale)}
                  className="group block"
                >
                  <Card interactive className="h-full p-8">
                    <div className="flex items-start gap-5">
                      <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-violet">
                        <Icon name={SERVICE_ICONS[id]} />
                      </span>
                      <div>
                        <h2 className="text-2xl">{service.name}</h2>
                        <p className="mt-2 text-ink-muted">{service.short}</p>
                      </div>
                    </div>

                    <p className="mt-6 leading-relaxed text-ink-muted">
                      {service.lead}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {service.features.slice(0, 4).map((feature) => (
                        <span
                          key={feature}
                          className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-ink-muted"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-line pt-5 text-sm">
                      <span className="text-ink-muted">
                        {labels.delay} : {service.delay}
                      </span>
                      <span className="inline-flex items-center gap-2 text-violet">
                        {dict.common.learnMore}
                        <Icon
                          name="arrow"
                          className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-1"
                        />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow={dict.models.hero.eyebrow}
            title={dict.models.hero.title}
            lead={dict.models.hero.lead}
            align="center"
          />
        </Container>
      </Section>

      <CtaBand
        eyebrow={dict.cta.eyebrow}
        title={dict.cta.title}
        lead={dict.cta.lead}
        primary={{ href: path("contact", locale), label: dict.cta.button }}
        secondary={{ href: path("models", locale), label: dict.cta.secondary }}
      />
    </>
  );
}
