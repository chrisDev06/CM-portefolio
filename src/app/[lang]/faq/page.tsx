import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { path } from "@/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import { Container, CtaBand, PageHero, Section } from "@/components/ui";
import { Faq } from "@/components/blocks";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return localizedMetadata({
    locale,
    title: dict.pages.faq.hero.title,
    description: dict.pages.faq.hero.lead,
    urls: { fr: path("faq", "fr"), en: path("faq", "en") },
  });
}

export default async function FaqPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { hero, categories } = dict.pages.faq;

  // Balisage FAQPage : éligible aux résultats enrichis (docs/PLAN.md §7).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />

      {categories.map((category) => (
        <Section key={category.name}>
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
              <h2 className="text-3xl">{category.name}</h2>
              <Faq items={category.items} />
            </div>
          </Container>
        </Section>
      ))}

      <CtaBand
        eyebrow={dict.cta.eyebrow}
        title={dict.cta.title}
        lead={dict.cta.lead}
        primary={{ href: path("contact", locale), label: dict.cta.button }}
        secondary={{ href: path("method", locale), label: dict.nav.method }}
      />
    </>
  );
}
