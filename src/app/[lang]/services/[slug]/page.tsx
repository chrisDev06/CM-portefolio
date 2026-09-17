import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import {
  locales,
  path,
  serviceIdFromSlug,
  serviceIds,
  serviceSlugs,
  servicePath,
} from "@/i18n/config";
import { localizedMetadata } from "@/lib/metadata";
import {
  Card,
  CheckList,
  Container,
  CtaBand,
  Eyebrow,
  Glow,
  Icon,
  Section,
  Tag,
} from "@/components/ui";
import { Faq, SERVICE_ICONS } from "@/components/blocks";

export function generateStaticParams() {
  return locales.flatMap((lang) =>
    serviceIds.map((id) => ({ lang, slug: serviceSlugs[id][lang] })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const id = serviceIdFromSlug(slug);
  if (!id) return {};

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const service = dict.services.items[id];

  return localizedMetadata({
    locale,
    title: service.title,
    description: service.lead,
    urls: { fr: servicePath(id, "fr"), en: servicePath(id, "en") },
  });
}

export default async function ServicePage({
  params,
}: PageProps<"/[lang]/services/[slug]">) {
  const { slug } = await params;
  const id = serviceIdFromSlug(slug);
  if (!id) notFound();

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const service = dict.services.items[id];
  const labels = dict.services.labels;
  const others = serviceIds.filter((other) => other !== id);

  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Glow className="-top-40 left-1/4 size-[560px]" />
        <Glow
          className="-top-20 right-0 size-[420px]"
          from="var(--color-magenta)"
        />
        <Container>
          <div className="flex items-center gap-4">
            <span className="inline-flex size-12 items-center justify-center rounded-md border border-line bg-surface-2 text-violet">
              <Icon name={SERVICE_ICONS[id]} />
            </span>
            <Eyebrow>{service.name}</Eyebrow>
          </div>
          <h1 className="mt-7 max-w-4xl text-4xl sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {service.lead}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href={path("contact", locale)}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet to-magenta px-6 py-3 text-sm font-medium shadow-[0_0_24px_-6px_var(--color-magenta)]"
            >
              {dict.common.estimate}
              <Icon name="arrow" className="size-4" />
            </Link>
            <span className="text-sm text-ink-muted">
              {labels.delay} : {service.delay}
            </span>
          </div>
        </Container>
      </section>

      {/* À qui + problème */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Eyebrow>{labels.for}</Eyebrow>
              <CheckList items={service.for} className="mt-6" />
            </div>
            <Card className="p-8">
              <Eyebrow>{labels.problem}</Eyebrow>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                {service.problem}
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Ce que nous créons + fonctionnalités */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl">{labels.deliver}</h2>
              <CheckList items={service.deliver} className="mt-8" />
            </div>
            <div>
              <h2 className="text-3xl">{labels.features}</h2>
              <div className="mt-8 flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <Tag key={feature}>{feature}</Tag>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Déroulé */}
      <Section>
        <Container>
          <h2 className="text-3xl">{labels.steps}</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {service.steps.map((step, index) => (
              <li key={step} className="border-t border-line pt-5">
                <span className="font-display text-sm text-violet">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Inclus + technos + après */}
      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-8">
              <h2 className="text-xl">{labels.included}</h2>
              <CheckList items={service.included} className="mt-6" />
            </Card>
            <Card className="p-8">
              <h2 className="text-xl">{labels.tech}</h2>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.tech.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
              <h2 className="mt-10 text-xl">{labels.delay}</h2>
              <p className="mt-4 font-display text-2xl text-gradient">
                {service.delay}
              </p>
            </Card>
            <Card className="p-8">
              <h2 className="text-xl">{labels.after}</h2>
              <p className="mt-6 leading-relaxed text-ink-muted">
                {service.after}
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section>
        <Container>
          <h2 className="text-3xl">{labels.faq}</h2>
          <div className="mt-10">
            <Faq items={service.faq} />
          </div>
        </Container>
      </Section>

      {/* Autres services */}
      <Section>
        <Container>
          <h2 className="text-2xl">{labels.otherServices}</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {others.map((other) => (
              <Link
                key={other}
                href={servicePath(other, locale)}
                className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink-muted transition-colors duration-200 ease-brand hover:border-violet hover:text-ink"
              >
                <Icon name={SERVICE_ICONS[other]} className="size-4" />
                {dict.services.items[other].name}
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={dict.cta.eyebrow}
        title={dict.cta.title}
        lead={dict.cta.lead}
        primary={{ href: path("contact", locale), label: dict.common.estimate }}
        secondary={{ href: path("pricing", locale), label: dict.nav.pricing }}
      />
    </>
  );
}
