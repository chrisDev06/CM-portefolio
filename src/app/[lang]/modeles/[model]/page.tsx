import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { isModelId, locales, modelIds, modelPath, path } from "@/i18n/config";
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
import Image from "next/image";
import { ModelCard } from "@/components/blocks";
import { BrowserFrame, DeviceDuo } from "@/components/device";
import { modelAssets } from "@/lib/model-assets";

export function generateStaticParams() {
  return locales.flatMap((lang) => modelIds.map((model) => ({ lang, model })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/modeles/[model]">): Promise<Metadata> {
  const { model: id } = await params;
  if (!isModelId(id)) return {};

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const model = dict.models.items[id];

  return localizedMetadata({
    locale,
    title: `${model.name} — ${model.type}`,
    description: model.tagline,
    urls: { fr: modelPath(id, "fr"), en: modelPath(id, "en") },
  });
}

function Score({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-gradient">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-muted">
        {label}
      </p>
    </div>
  );
}

export default async function ModelPage({
  params,
}: PageProps<"/[lang]/modeles/[model]">) {
  const { model: id } = await params;
  if (!isModelId(id)) notFound();

  const locale = await getLocale();
  const dict = await getDictionary(locale);
  const model = dict.models.items[id];
  const labels = dict.models.labels;
  const hero = dict.models.hero;
  const assets = modelAssets(id);
  const others = modelIds.filter((other) => other !== id);

  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-28">
        <Glow className="-top-40 left-1/4 size-[560px]" />
        <Glow
          className="-top-20 right-0 size-[420px]"
          from="var(--color-magenta)"
        />
        <Container>
          <Link
            href={path("models", locale)}
            className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
          >
            <Icon name="arrow" className="size-4 rotate-180" />
            {dict.common.backToModels}
          </Link>

          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Tag>{model.type}</Tag>
                <Tag>{model.sector}</Tag>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl sm:text-5xl">
                {model.name}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
                {model.tagline}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                {model.demo ? (
                  <a
                    href={model.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-violet to-magenta px-6 py-3 text-sm font-medium shadow-[0_0_24px_-6px_var(--color-magenta)]"
                  >
                    {dict.common.liveDemo}
                    <Icon name="arrow" className="size-4" />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm text-ink-muted">
                    <Icon name="clock" className="size-4" />
                    {labels.demoSoon}
                  </span>
                )}
                <Link
                  href={path("contact", locale)}
                  className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-sm transition-colors duration-200 ease-brand hover:border-violet"
                >
                  {dict.common.estimate}
                  <Icon name="arrow" className="size-4" />
                </Link>
              </div>
            </div>

            <DeviceDuo
              desktop={assets.desktop}
              mobile={assets.mobile}
              host={assets.demoHost}
              priority
              alt={{
                desktop: `${model.name} — ${dict.common.viewDesktop}`,
                mobile: `${model.name} — ${dict.common.viewMobile}`,
              }}
            />
          </div>

          <div className="mt-20 grid gap-6 rounded-lg border border-line bg-surface/60 p-8 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                {labels.price}
              </p>
              <p className="mt-2 font-display text-2xl">{model.price}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                {labels.delay}
              </p>
              <p className="mt-2 font-display text-2xl">{model.delay}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                {labels.sector}
              </p>
              <p className="mt-2 font-display text-2xl">{model.sector}</p>
            </div>
            <p className="text-sm text-ink-muted sm:col-span-3">
              {labels.priceNote}
            </p>
          </div>
        </Container>
      </section>

      {/* Galerie d'écrans */}
      <Section>
        <Container>
          <h2 className="text-2xl">{dict.common.gallery}</h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {assets.features.map((feature, index) => (
              <BrowserFrame
                key={feature}
                src={feature}
                alt={`${model.name} — ${dict.common.viewDesktop} ${index + 2}`}
                host={assets.demoHost}
              />
            ))}
          </div>
          <div className="mt-6 flex items-start gap-6 rounded-lg border border-line bg-surface/60 p-6">
            <Image
              src={assets.mobile}
              alt={`${model.name} — ${dict.common.viewMobile}`}
              width={390}
              height={844}
              sizes="120px"
              className="w-24 shrink-0 rounded-lg border border-line sm:w-32"
            />
            <p className="text-sm leading-relaxed text-ink-muted">
              {hero.note}
            </p>
          </div>
        </Container>
      </Section>

      {/* Intention de DA + pour qui */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <Card className="p-8">
              <Eyebrow>{labels.intent}</Eyebrow>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                {model.intent}
              </p>
            </Card>
            <div>
              <Eyebrow>{labels.for}</Eyebrow>
              <p className="mt-6 text-lg leading-relaxed text-ink-muted">
                {model.for}
              </p>
              <div className="mt-10">
                <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                  {labels.tech}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {model.tech.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Fonctionnalités + personnalisation */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl">{labels.features}</h2>
              <CheckList items={model.features} className="mt-8" />
            </div>
            <div>
              <h2 className="text-3xl">{labels.customizable}</h2>
              <CheckList items={model.customizable} className="mt-8" />
              <h2 className="mt-12 text-2xl">{labels.included}</h2>
              <CheckList items={model.included} className="mt-6" />
            </div>
          </div>
        </Container>
      </Section>

      {/* Performances */}
      <Section>
        <Container>
          <div className="flex flex-col items-center gap-8 rounded-lg border border-line bg-surface/60 p-10 sm:flex-row sm:justify-center sm:gap-20">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
              {labels.performance}
            </p>
            <div className="flex gap-12">
              <Score value={model.performance.perf} label={labels.perf} />
              <Score value={model.performance.a11y} label={labels.a11y} />
              <Score value={model.performance.seo} label={labels.seo} />
            </div>
          </div>
        </Container>
      </Section>

      {/* Autres modèles */}
      <Section>
        <Container>
          <h2 className="text-2xl">{labels.similar}</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {others.map((other) => (
              <ModelCard key={other} id={other} locale={locale} dict={dict} />
            ))}
          </div>
        </Container>
      </Section>

      <CtaBand
        eyebrow={dict.cta.eyebrow}
        title={dict.cta.title}
        lead={dict.cta.lead}
        primary={{ href: path("contact", locale), label: dict.cta.button }}
      />
    </>
  );
}
