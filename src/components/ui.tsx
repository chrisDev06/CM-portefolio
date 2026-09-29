import Link from "next/link";
import type { ReactNode } from "react";
import { Spotlight } from "./spotlight";

/* --- Icônes : une seule famille, trait 1.5, grille 24. --------------------- */

const PATHS = {
  arrow: "M5 12h13M12 5l7 7-7 7",
  check: "M4 12.5 9 17.5 20 6.5",
  monitor:
    "M5 4h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM8 20h8M12 16v4",
  cart: "M3 4h2l2.5 11h10L20 7H6M9 21.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5zM17 21.25a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z",
  mobile:
    "M9 2h6a2 2 0 012 2v16a2 2 0 01-2 2H9a2 2 0 01-2-2V4a2 2 0 012-2zM12 5.5h.01M12 18.5h.01",
  gear: "M10.21 4.82L10.66 2.49L13.34 2.49L13.79 4.82A7.4 7.4 0 0 1 15.81 5.66L17.78 4.33L19.67 6.22L18.34 8.19A7.4 7.4 0 0 1 19.18 10.21L21.51 10.66L21.51 13.34L19.18 13.79A7.4 7.4 0 0 1 18.34 15.81L19.67 17.78L17.78 19.67L15.81 18.34A7.4 7.4 0 0 1 13.79 19.18L13.34 21.51L10.66 21.51L10.21 19.18A7.4 7.4 0 0 1 8.19 18.34L6.22 19.67L4.33 17.78L5.66 15.81A7.4 7.4 0 0 1 4.82 13.79L2.49 13.34L2.49 10.66L4.82 10.21A7.4 7.4 0 0 1 5.66 8.19L4.33 6.22L6.22 4.33L8.19 5.66A7.4 7.4 0 0 1 10.21 4.82zM12 9a3 3 0 100 6 3 3 0 000-6z",
  pen: "M4 20h4L20.5 7.5a2.1 2.1 0 00-3-3L5 17v3z",
  layout: "M3 4h18v16H3zM3 9h18M9 9v11",
  shield: "M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  diamond: "M6 3h12l4 6-10 12L2 9zM2 9h20M9 3 7.5 9 12 21M15 3l1.5 6L12 21",
  user: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21v-1a6 6 0 016-6h4a6 6 0 016 6v1",
  shieldCheck: "M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  users:
    "M16 20v-1.5a4 4 0 00-4-4H6a4 4 0 00-4 4V20M9 10.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7M22 20v-1.5a4 4 0 00-3-3.9M16 3.6a4 4 0 010 7.7",
  chart: "M4 20V11M10 20V4M16 20v-6M2 20h20",
  bars: "M4.5 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM9.5 12h1a1 1 0 011 1v5.5a1 1 0 01-1 1h-1a1 1 0 01-1-1V13a1 1 0 011-1zM14.5 8h1a1 1 0 011 1v9.5a1 1 0 01-1 1h-1a1 1 0 01-1-1V9a1 1 0 011-1zM19.5 4h1a1 1 0 011 1v13.5a1 1 0 01-1 1h-1a1 1 0 01-1-1V5a1 1 0 011-1z",
  heart:
    "M12 20.5S3 15.2 3 9.2A4.7 4.7 0 017.8 4.5c1.8 0 3.3 1 4.2 2.5.9-1.5 2.4-2.5 4.2-2.5A4.7 4.7 0 0121 9.2c0 6-9 11.3-9 11.3z",
  star: "M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z",
  sliders:
    "M4 8h9M17 8h3M15 10a2 2 0 100-4 2 2 0 000 4zM4 16h3M11 16h9M9 18a2 2 0 100-4 2 2 0 000 4z",
  devices:
    "M12 19H6a2 2 0 01-2-2V5a2 2 0 012-2h9a2 2 0 012 2v4M15 11h4a1.5 1.5 0 011.5 1.5v7a1.5 1.5 0 01-1.5 1.5h-4a1.5 1.5 0 01-1.5-1.5v-7a1.5 1.5 0 011.5-1.5zM17 18.5h.01",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7.5V12l3 2",
  globe:
    "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  phone:
    "M5 3h4l2 5-2.5 1.5a12 12 0 006 6L16 13l5 2v4a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1",
  sparkle: "M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z",
  plus: "M12 5v14M5 12h14",
  code: "M9 6l-6 6 6 6M15 6l6 6-6 6",
  codeXml: "M6 8l-4 4 4 4M18 8l4 4-4 4M14.5 4l-5 16",
  ban: "M12 3a9 9 0 100 18 9 9 0 000-18zM5.64 5.64l12.72 12.72",
  fileText:
    "M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7zM14 2v4a2 2 0 002 2h4M10 9H8M16 13H8M16 17H8",
  rocket:
    "M12 2c3 2 5 5.5 5 10l-5 4-5-4c0-4.5 2-8 5-10zM12 11h.01M7 16l-2 5 5-2M17 16l2 5-5-2",
  message:
    "M5 4h14a2 2 0 012 2v9a2 2 0 01-2 2h-9l-5 4v-4a2 2 0 01-2-2V6a2 2 0 012-2zM8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  database:
    "M12 8c4.4 0 8-1.3 8-3s-3.6-3-8-3-8 1.3-8 3 3.6 3 8 3zM4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  wrench:
    "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94z",
  calendar:
    "M8 2.5v3M16 2.5v3M5 4h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2zM3 9.5h18M8.5 14.5h.01M15.5 14.5h.01",
  circleCheck: "M12 3a9 9 0 100 18 9 9 0 000-18zM8.5 12.2l2.4 2.4 4.6-4.9",
  signal: "M6 20v-5M12 20v-9M18 20V5",
  messageCircle: "M10 18.3A9 7.5 0 1 0 6.3 16.9L5 21z",
  listRows:
    "M9 5.5h11M9 10h11M9 14.5h11M9 19h6M4.5 5.5h1M4.5 10h1M4.5 14.5h1M4.5 19h1",
  rocketLaunch:
    "M18.96 5.04C19.52 9 16.9 12.61 12.45 16.08L7.92 11.55C11.39 7.1 15 4.48 18.96 5.04zM15.56 8.44A1.7 1.7 0 1 0 13.16 10.84A1.7 1.7 0 1 0 15.56 8.44M10.43 9.25L6.58 9.36L4.46 11.48L7.92 11.55M14.75 13.57L14.64 17.42L12.52 19.54L12.45 16.08M7.43 14.17C6.02 15.58 5.94 18.06 5.94 18.06C5.94 18.06 8.42 17.98 9.83 16.57",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({
  name,
  className = "size-5",
}: {
  name: IconName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}

/* --- Mise en page --------------------------------------------------------- */

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1320px] px-4 sm:px-8 ${className}`}>
      {children}
    </div>
  );
}

/** Halo diffus de fond — l'effet néon des maquettes, dosé. */
export function Glow({
  className = "",
  from = "var(--color-violet)",
}: {
  className?: string;
  from?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 rounded-full opacity-25 blur-[120px] ${className}`}
      style={{ background: from }}
    />
  );
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`hairline relative overflow-hidden py-20 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

export function Eyebrow({
  children,
  neon = false,
}: {
  children: ReactNode;
  /** Anneau lumineux et point néon : pour une étiquette posée sur une image. */
  neon?: boolean;
}) {
  if (neon) {
    return (
      <span className="eyebrow-neon inline-flex items-center gap-3 rounded-full py-1.5 pr-4 pl-3.5 text-xs uppercase tracking-[0.24em] text-ink/85">
        <span aria-hidden="true" className="eyebrow-dot size-2 rounded-full" />
        {children}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 text-xs uppercase tracking-[0.18em] text-ink-muted">
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="mt-5 text-3xl sm:text-4xl">{title}</h2>
      {lead ? (
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">{lead}</p>
      ) : null}
    </div>
  );
}

/* --- Actions -------------------------------------------------------------- */

/** Couche GPU permanente, et seulement les propriétés utiles en transition :
    `transition-all` animait tout, y compris ce qui force un redessin. */
const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium will-change-transform transition-[color,background-color,border-color,box-shadow] duration-200 ease-brand";

const BUTTON_VARIANTS = {
  primary:
    "sheen bg-linear-to-r from-violet to-magenta text-ink shadow-[0_0_28px_-8px_var(--color-magenta)] hover:shadow-[0_0_44px_-6px_var(--color-magenta)]",
  ghost:
    "border border-line-strong text-ink-muted hover:border-violet hover:text-ink hover:shadow-[0_0_28px_-10px_var(--color-violet)]",
  /** Bouton secondaire posé sur une image : verre dépoli, texte clair. */
  glass:
    "border border-line-strong bg-canvas/65 text-ink/90 backdrop-blur-md hover:border-violet hover:text-ink hover:shadow-[0_0_28px_-10px_var(--color-violet)]",
  quiet: "text-ink-muted hover:text-ink",
} as const;

export function Button({
  href,
  children,
  variant = "primary",
  icon = true,
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof BUTTON_VARIANTS;
  icon?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {children}
      {icon ? <Icon name="arrow" className="size-4" /> : null}
    </Link>
  );
}

/* --- Surfaces ------------------------------------------------------------- */

export function Card({
  children,
  className = "",
  interactive = false,
  accent,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  /** Teinte du halo ; par défaut le violet de la marque. */
  accent?: string;
}) {
  const base = `relative rounded-lg border border-line bg-surface/60 p-6 ${className}`;

  if (!interactive) return <div className={base}>{children}</div>;

  return (
    <Spotlight
      className={`glow-card ${base}`}
      style={
        accent
          ? ({ "--card-accent": accent } as React.CSSProperties)
          : undefined
      }
    >
      {children}
    </Spotlight>
  );
}

export function IconBadge({ name }: { name: IconName }) {
  return (
    <span className="inline-flex size-11 items-center justify-center rounded-md border border-line bg-surface-2 text-violet">
      <Icon name={name} />
    </span>
  );
}

export function CheckList({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-ink-muted">
          <Icon name="check" className="mt-0.5 size-4 shrink-0 text-violet" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-ink-muted transition-colors duration-200 ease-brand hover:border-violet/50 hover:text-ink">
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-4xl font-bold text-gradient">{value}</p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </div>
  );
}

/** Bandeau d'appel à l'action, repris en bas de chaque page. */
export function CtaBand({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
}) {
  return (
    <Section className="border-b border-line">
      <Glow className="left-1/2 top-0 size-[600px] -translate-x-1/2" />
      <Container>
        <div className="flex flex-col items-start gap-8 rounded-lg border border-line bg-linear-to-br from-surface-2 to-surface p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="mt-5 text-3xl sm:text-4xl">{title}</h2>
            <p className="mt-4 text-lg text-ink-muted">{lead}</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button href={primary.href}>{primary.label}</Button>
            {secondary ? (
              <Button href={secondary.href} variant="ghost" icon={false}>
                {secondary.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** En-tête de page intérieure. */
export function PageHero({
  eyebrow,
  title,
  lead,
  note,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  note?: string;
}) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <Glow className="-top-40 left-1/4 size-[560px]" />
      <Glow
        className="-top-20 right-0 size-[420px]"
        from="var(--color-magenta)"
      />
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-4xl text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
          {lead}
        </p>
        {note ? (
          <p className="mt-6 max-w-2xl rounded-md border border-line bg-surface/60 px-4 py-3 text-sm text-ink-muted">
            {note}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
