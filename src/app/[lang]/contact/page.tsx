import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { path } from "@/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import {
  Card,
  Container,
  Glow,
  Icon,
  Section,
} from "@/components/ui";
import { ContactForm } from "@/components/contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return localizedMetadata({
    locale,
    title: dict.pages.contact.hero.title,
    description: dict.pages.contact.hero.lead,
    urls: { fr: path("contact", "fr"), en: path("contact", "en") },
  });
}

export default async function ContactPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { hero, form, people, info } = dict.pages.contact;

  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-24">
        <Glow className="-top-40 left-1/4 size-[560px]" />
        <Glow
          className="-top-20 right-0 size-[420px]"
          from="var(--color-magenta)"
        />
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-ink-muted">
                {hero.eyebrow}
              </p>
              <h1 className="mt-6 text-4xl sm:text-5xl">{hero.title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
                {hero.lead}
              </p>

              <div className="mt-10">
                <ContactForm form={form} />
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-xl">{people.title}</h2>
              {people.items.map((person) => (
                <Card key={person.name}>
                  <div className="flex items-center gap-4">
                    <span className="flex size-12 items-center justify-center rounded-full border border-line bg-surface-2 font-display text-lg font-bold text-gradient">
                      {person.name.charAt(0)}
                    </span>
                    <div>
                      <p className="font-display text-lg">{person.name}</p>
                      <p className="text-sm text-violet">{person.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">
                    {person.text}
                  </p>
                </Card>
              ))}

              <Card>
                <h3 className="text-lg">{info.title}</h3>
                <dl className="mt-5 space-y-3">
                  {info.items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <dt className="text-ink-muted">{item.label}</dt>
                      <dd className="text-right">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </Card>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="flex flex-wrap items-center gap-4 text-sm text-ink-muted">
            <Icon name="shield" className="size-5 text-violet" />
            {form.consent}
          </div>
        </Container>
      </Section>
    </>
  );
}
