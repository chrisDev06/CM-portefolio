import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { path } from "@/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import {
  Card,
  CheckList,
  Container,
  CtaBand,
  Glow,
  Icon,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return localizedMetadata({
    locale,
    title: dict.pages.pricing.hero.title,
    description: dict.pages.pricing.hero.lead,
    urls: { fr: path("pricing", "fr"), en: path("pricing", "en") },
  });
}

export default async function PricingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { hero, how, ranges, factors, payment, note } = dict.pages.pricing;

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />

      <Section>
        <Container>
          <SectionHeading eyebrow={how.eyebrow} title={how.title} />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {how.items.map((item) => (
              <Card key={item.title} interactive className="h-full">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {item.text}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Glow className="left-1/3 top-0 size-[520px]" />
        <Container>
          <SectionHeading
            eyebrow={ranges.eyebrow}
            title={ranges.title}
            lead={ranges.lead}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {ranges.items.map((item) => (
              <Card key={item.name} interactive className="h-full p-8">
                <h3 className="text-2xl">{item.name}</h3>
                <p className="mt-3 font-display text-3xl text-gradient">
                  {item.range}
                </p>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  {item.text}
                </p>
                <CheckList
                  items={item.includes}
                  className="mt-6 border-t border-line pt-6 text-sm"
                />
              </Card>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink-muted">{note}</p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading eyebrow={factors.eyebrow} title={factors.title} />
            <ul className="space-y-4">
              {factors.items.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-4 border-b border-line pb-4 text-ink-muted"
                >
                  <span className="font-display text-sm text-violet">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow={payment.eyebrow} title={payment.title} />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {payment.items.map((item) => (
              <Card key={item.title} className="h-full p-8">
                <Icon name="check" className="size-5 text-violet" />
                <h3 className="mt-5 text-xl">{item.title}</h3>
                <p className="mt-3 leading-relaxed text-ink-muted">
                  {item.text}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={dict.cta.eyebrow}
        title={dict.cta.title}
        lead={dict.cta.lead}
        primary={{ href: path("contact", locale), label: dict.common.estimate }}
        secondary={{ href: path("models", locale), label: dict.cta.secondary }}
      />
    </>
  );
}
