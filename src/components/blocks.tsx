import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  modelPath,
  servicePath,
  type Locale,
  type ModelId,
  type ServiceId,
} from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { MODEL_ACCENTS, modelAssets } from "@/lib/model-assets";
import { ServiceIllustration } from "./service-illustrations";
import { Spotlight } from "./spotlight";
import { Card, Icon, Tag, type IconName } from "./ui";

export const SERVICE_ICONS: Record<ServiceId, IconName> = {
  "site-web": "monitor",
  "e-commerce": "cart",
  mobile: "mobile",
  "sur-mesure": "gear",
  refonte: "pen",
  maintenance: "shield",
};

/* --- Cartes --------------------------------------------------------------- */

/** Carte service posée sur l'image du hero : verre néon, teinte par carte.
    `className` et `style` vont sur la surface en verre (voir .glass). */
export function HeroServiceCard({
  id,
  title,
  text,
  accent,
  locale,
  className = "",
  style,
}: {
  id: ServiceId;
  title: string;
  text: string;
  accent: string;
  locale: Locale;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Link href={servicePath(id, locale)} className="group block rounded-md">
      {/* overflow-hidden : le halo de la tuile colore la carte sans déborder. */}
      <Spotlight
        className={`glow-card glass h-full overflow-hidden rounded-md px-5 pt-4 pb-4.5 ${className}`}
        style={{ "--card-accent": accent, ...style } as CSSProperties}
      >
        <span aria-hidden="true" className="glass-edge" />
        {/* Écran bas : la tuile passe à côté du titre, au même seuil que les
            marges du hero. Sinon les cartes sortent de l'écran. */}
        <div className="[@media(max-height:899px)]:flex [@media(max-height:899px)]:items-center [@media(max-height:899px)]:gap-3">
          <span className="glass-tile inline-flex h-11 w-13 shrink-0 items-center justify-center rounded-sm [@media(max-height:899px)]:h-10 [@media(max-height:899px)]:w-12">
            <Icon name={SERVICE_ICONS[id]} className="size-6.5" />
          </span>
          <h2 className="mt-2.5 text-base leading-tight font-semibold [@media(max-height:899px)]:mt-0">
            {title}
          </h2>
        </div>
        {/* Deux lignes minimum : la pastille ne remonte jamais sur le titre. */}
        <p className="mt-1.5 min-h-[2lh] pr-12 text-sm leading-tight text-ink/75">
          {text}
        </p>
        <span className="glass-orb absolute right-5 bottom-5 flex size-9 items-center justify-center rounded-full">
          <Icon
            name="arrow"
            className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
          />
        </span>
      </Spotlight>
    </Link>
  );
}

/** Carte de la section Services de l'accueil : verre nuit, scène illustrée à
    droite. `className` et `style` vont sur la surface en verre (.service-card) :
    une animation d'entrée posée plus haut empêcherait le flou de voir l'image. */
export function ServiceShowcaseCard({
  id,
  locale,
  dict,
  featured = false,
  className = "",
  style,
}: {
  id: ServiceId;
  locale: Locale;
  dict: Dictionary;
  /** Liseré néon et pastille « Populaire ». */
  featured?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const service = dict.services.items[id];
  return (
    <Link href={servicePath(id, locale)} className="group block h-full rounded-md">
      <Spotlight
        className={`glow-card service-card h-full overflow-hidden rounded-md ${featured ? "service-card-featured" : ""} ${className}`}
        style={style}
      >
        <ServiceIllustration id={id} />
        <span aria-hidden="true" className="service-card-edge" />

        <div className="relative z-10 flex h-full flex-col px-6 pt-4 pb-4">
          <span className="neon-tile inline-flex size-12 shrink-0 items-center justify-center rounded-md">
            <Icon name={SERVICE_ICONS[id]} className="size-6" />
          </span>
          <h3 className="mt-3 text-[1.25rem] font-semibold">{service.name}</h3>
          {/* Colonne étroite : l'illustration occupe la droite de la carte. */}
          <p className="mt-1.5 max-w-[16.75rem] text-[0.8125rem] leading-[1.4] text-ink/75">
            {service.short}
          </p>
          <span className="mt-auto inline-flex items-center gap-2 pt-3 text-sm font-medium text-violet-light">
            {dict.common.learnMore}
            <Icon
              name="arrow"
              className="size-4 transition-transform duration-200 ease-brand group-hover:translate-x-1"
            />
          </span>
        </div>

        <span className="neon-orb absolute right-5 bottom-4 z-10 flex size-9 items-center justify-center rounded-full">
          <Icon name="arrow" className="size-4" />
        </span>
        {featured ? (
          <span className="neon-badge absolute top-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-2.5 text-xs font-medium">
            <Icon name="star" className="size-3.5 fill-current" />
            {dict.services.labels.popular}
          </span>
        ) : null}
      </Spotlight>
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
            sizes="(max-width: 640px) 100vw, 45vw"
            className="block h-auto w-full will-change-transform transition-[transform,filter] duration-700 ease-brand group-hover:scale-[1.04] group-hover:brightness-110"
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

export function TechRow({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: string[];
}) {
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
