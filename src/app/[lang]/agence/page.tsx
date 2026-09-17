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
import { DuoFlow, PersonCard } from "@/components/blocks";

const VALUE_ICONS = ["users", "chart", "code", "shield"] as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return localizedMetadata({
    locale,
    title: dict.pages.agency.hero.title,
    description: dict.pages.agency.hero.lead,
    urls: { fr: path("agency", "fr"), en: path("agency", "en") },
  });
}

export default async function AgencyPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { hero, story, values, duo, promise } = dict.pages.agency;

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
            <h2 className="text-3xl">{story.title}</h2>
            <div className="space-y-6">
              {story.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="text-lg leading-relaxed text-ink-muted"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading eyebrow={values.eyebrow} title={values.title} />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.items.map((value, index) => (
              <Card key={value.title} interactive className="h-full">
                <Icon
                  name={VALUE_ICONS[index] ?? "sparkle"}
                  className="size-6 text-violet"
                />
                <h3 className="mt-5 text-lg">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {value.text}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Glow className="left-1/2 top-10 size-[520px] -translate-x-1/2" />
        <Container>
          <SectionHeading
            eyebrow={duo.eyebrow}
            title={duo.title}
            lead={duo.lead}
            align="center"
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {duo.people.map((person) => (
              <PersonCard
                key={person.name}
                name={person.name}
                role={person.role}
                text={person.text}
                skills={person.skills}
              />
            ))}
          </div>

          <div className="mt-14 rounded-lg border border-line bg-surface/60 p-8 text-center sm:p-12">
            <h3 className="text-2xl">{duo.flow.title}</h3>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink-muted">
              {duo.flow.text}
            </p>
            <div className="mt-8">
              <DuoFlow nodes={duo.flow.nodes} />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <SectionHeading eyebrow={promise.eyebrow} title={promise.title} />
            <CheckList items={promise.items} className="text-lg" />
          </div>
        </Container>
      </Section>

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
