import type { Metadata } from "next";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { path } from "@/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import {
  Card,
  Container,
  CtaBand,
  Eyebrow,
  Glow,
  Icon,
  PageHero,
  Section,
  SectionHeading,
} from "@/components/ui";

const STATUS_STYLES = {
  done: "border-violet/50 bg-violet/10 text-ink",
  doing: "border-magenta/60 bg-magenta/10 text-ink",
  todo: "border-line bg-surface-2 text-ink-muted",
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  return localizedMetadata({
    locale,
    title: dict.pages.method.hero.title,
    description: dict.pages.method.hero.lead,
    urls: { fr: path("method", "fr"), en: path("method", "en") },
  });
}

export default async function MethodPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const { hero, steps, tracking, communication, scope } = dict.pages.method;
  const example = tracking.example;

  return (
    <>
      <PageHero eyebrow={hero.eyebrow} title={hero.title} lead={hero.lead} />

      {/* Les 8 étapes */}
      <Section id="methode">
        <Container>
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="border-t border-line pt-6">
                <span className="font-display text-sm text-violet">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 text-xl">{step.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Suivi de projet */}
      <Section id="suivi">
        <Glow className="right-0 top-10 size-[460px]" from="var(--color-magenta)" />
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-2">
            <SectionHeading
              eyebrow={tracking.eyebrow}
              title={tracking.title}
              lead={tracking.lead}
            />

            <Card className="p-8">
              <Eyebrow>{example.label}</Eyebrow>

              <h3 className="mt-6 text-xl">{example.project}</h3>

              <div className="mt-6">
                <div className="flex items-center justify-between text-sm text-ink-muted">
                  <span>{example.progressLabel}</span>
                  <span className="text-ink">{example.progress} %</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-violet to-magenta"
                    style={{ width: `${example.progress}%` }}
                  />
                </div>
              </div>

              <ul className="mt-7 space-y-2.5">
                {example.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-ink-muted">{item.label}</span>
                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${
                        STATUS_STYLES[item.status as keyof typeof STATUS_STYLES]
                      }`}
                    >
                      {
                        example.statusLabels[
                          item.status as keyof typeof example.statusLabels
                        ]
                      }
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex items-start gap-3 border-t border-line pt-5 text-sm">
                <Icon name="clock" className="mt-0.5 size-4 shrink-0 text-violet" />
                <span className="text-ink-muted">
                  {example.nextLabel} : {example.next}
                </span>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Communication */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow={communication.eyebrow}
            title={communication.title}
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {communication.items.map((item) => (
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

      {/* Changements de périmètre */}
      <Section>
        <Container>
          <div className="rounded-lg border border-line bg-linear-to-br from-surface-2 to-surface p-8 sm:p-12">
            <h2 className="max-w-2xl text-3xl">{scope.title}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-ink-muted">
              {scope.text}
            </p>
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={dict.cta.eyebrow}
        title={dict.cta.title}
        lead={dict.cta.lead}
        primary={{ href: path("contact", locale), label: dict.cta.button }}
        secondary={{ href: path("faq", locale), label: dict.nav.faq }}
      />
    </>
  );
}
