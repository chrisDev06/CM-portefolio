import Image from "next/image";
import Link from "next/link";
import {
  modelPath,
  servicePath,
  type Locale,
  type ModelId,
  type ServiceId,
} from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import {
  HOME_DESKTOP_MODEL,
  HOME_MOBILE_MODEL,
  MODEL_ACCENTS,
  modelAssets,
} from "@/lib/model-assets";
import { DeviceDuo } from "./device";
import { Card, Glow, Icon, IconBadge, Tag, type IconName } from "./ui";

export const SERVICE_ICONS: Record<ServiceId, IconName> = {
  "site-web": "monitor",
  "e-commerce": "cart",
  mobile: "mobile",
  "sur-mesure": "gear",
  refonte: "pen",
  maintenance: "shield",
};

/** Le hero montre deux modèles réels, pas une illustration. */
export function HeroVisual({ dict }: { dict: Dictionary }) {
  const desktop = modelAssets(HOME_DESKTOP_MODEL);
  const mobile = modelAssets(HOME_MOBILE_MODEL);

  return (
    <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
      <Glow className="-top-10 right-0 size-80" from="var(--color-magenta)" />
      <Glow className="bottom-0 left-0 size-72" />
      <DeviceDuo
        desktop={desktop.desktop}
        mobile={mobile.mobile}
        host={desktop.demoHost}
        priority
        alt={{
          desktop: `${dict.models.items[HOME_DESKTOP_MODEL].name} — ${dict.common.viewDesktop}`,
          mobile: `${dict.models.items[HOME_MOBILE_MODEL].name} — ${dict.common.viewMobile}`,
        }}
      />
    </div>
  );
}

/* --- Cartes --------------------------------------------------------------- */

export function ServiceCard({
  id,
  locale,
  dict,
}: {
  id: ServiceId;
  locale: Locale;
  dict: Dictionary;
}) {
  const service = dict.services.items[id];
  return (
    <Link href={servicePath(id, locale)} className="group block">
      <Card interactive className="h-full">
        <IconBadge name={SERVICE_ICONS[id]} />
        <h3 className="mt-5 text-xl">{service.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {service.short}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm text-violet">
          {dict.common.learnMore}
          <Icon
            name="arrow"
            className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-1"
          />
        </span>
      </Card>
    </Link>
  );
}

export function ModelCard({
  id,
  locale,
  dict,
}: {
  id: ModelId;
  locale: Locale;
  dict: Dictionary;
}) {
  const model = dict.models.items[id];
  const assets = modelAssets(id);
  return (
    <Link href={modelPath(id, locale)} className="group block">
      <Card interactive accent={MODEL_ACCENTS[id]} className="h-full p-4">
        <div className="overflow-hidden rounded-md border border-line bg-surface-2">
          {assets.demoHost ? (
            <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
              <span className="size-1.5 rounded-full bg-line-strong" />
              <span className="size-1.5 rounded-full bg-line-strong" />
              <span className="size-1.5 rounded-full bg-line-strong" />
              <span className="ml-1 truncate text-[10px] text-ink-muted">
                {assets.demoHost}
              </span>
            </div>
          ) : null}
          <Image
            src={assets.cover}
            alt={`${model.name} — ${dict.common.viewDesktop}`}
            width={1600}
            height={1000}
            unoptimized
            sizes="(max-width: 640px) 100vw, 45vw"
            className="block h-auto w-full transition-[transform,filter] duration-700 ease-brand group-hover:scale-[1.04] group-hover:brightness-110"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 px-2 pt-5">
          <Tag>{model.type}</Tag>
          <Tag>{model.sector}</Tag>
        </div>
        <div className="px-2 pb-2">
          <h3 className="mt-4 text-xl">{model.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            {model.tagline}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
            <span className="text-sm text-ink-muted">
              {dict.models.labels.price}{" "}
              <span className="text-ink">{model.price}</span>
            </span>
            <span className="inline-flex items-center gap-2 text-sm text-violet">
              {dict.common.seeModel}
              <Icon
                name="arrow"
                className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function PersonCard({
  name,
  role,
  text,
  skills,
}: {
  name: string;
  role: string;
  text: string;
  skills?: string[];
}) {
  return (
    <Card className="h-full">
      {/* Portrait à intégrer — protocole de prise de vue dans docs/ASSETS.md §5. */}
      <div className="flex items-center gap-4">
        <span className="flex size-14 items-center justify-center rounded-full border border-line bg-surface-2 font-display text-xl font-bold text-gradient">
          {name.charAt(0)}
        </span>
        <div>
          <p className="font-display text-xl">{name}</p>
          <p className="text-sm text-violet">{role}</p>
        </div>
      </div>
      <p className="mt-5 leading-relaxed text-ink-muted">{text}</p>
      {skills ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

/** Manon ↔ Vous ↔ Christopher : le schéma central du positionnement. */
export function DuoFlow({ nodes }: { nodes: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
      {nodes.map((node, index) => (
        <div key={node} className="flex items-center gap-3 sm:gap-5">
          <span
            className={`rounded-full border px-5 py-2.5 text-sm ${
              index === 1
                ? "border-violet bg-linear-to-r from-violet/20 to-magenta/20 text-ink"
                : "border-line bg-surface text-ink-muted"
            }`}
          >
            {node}
          </span>
          {index < nodes.length - 1 ? (
            <span aria-hidden="true" className="text-lg text-violet">
              ↔
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function NumberedStep({
  index,
  title,
  text,
}: {
  index: number;
  title: string;
  text: string;
}) {
  return (
    <div className="relative border-t border-line pt-6">
      <span className="font-display text-sm text-violet">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="mt-3 text-xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{text}</p>
    </div>
  );
}

/** Accordéon natif : aucun JavaScript, et accessible par défaut. */
export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg">
            <span>{item.q}</span>
            <span className="mt-1 shrink-0 text-violet transition-transform duration-200 ease-brand group-open:rotate-45">
              <Icon name="plus" className="size-5" />
            </span>
          </summary>
          <p className="mt-4 max-w-3xl leading-relaxed text-ink-muted">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );
}

export function TechRow({ eyebrow, items }: { eyebrow: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
        {eyebrow}
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
        {items.map((item) => (
          <span
            key={item}
            className="font-display text-lg text-ink-muted transition-colors duration-200 ease-brand hover:text-ink"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
