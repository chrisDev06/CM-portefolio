import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { modelIds, path } from "@/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import {
  Container,
  CtaBand,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/ui";
import { ModelCard, NumberedStep } from "@/components/blocks";
import { ModelFilter } from "@/components/model-filter";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return localizedMetadata({
    locale,
    title: dict.models.hero.title,
    description: dict.models.hero.lead,
    urls: { fr: path("models", "fr"), en: path("models", "en") },
  });
}

export default async function ModelsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { hero, howItWorks, filters, items } = dict.models;

  return (
    <>
      <PageHero
        eyebrow={hero.eyebrow}
        title={hero.title}
        lead={hero.lead}
        note={hero.note}
      />

      <Section>
        <Container>
          <ModelFilter
            labels={filters}
            items={modelIds.map((id) => ({
              id,
              filter: items[id].filter,
              card: <ModelCard id={id} locale={locale} dict={dict} />,
            }))}
          />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow={howItWorks.eyebrow}
            title={howItWorks.title}
          />
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {howItWorks.steps.map((step, index) => (
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

      <CtaBand
        eyebrow={dict.cta.eyebrow}
        title={dict.cta.title}
        lead={dict.cta.lead}
        primary={{ href: path("contact", locale), label: dict.cta.button }}
        secondary={{ href: path("services", locale), label: dict.common.allServices }}
      />
    </>
  );
}
