import Link from "next/link";
import type { ReactNode } from "react";

/* --- Icônes : une seule famille, trait 1.5, grille 24. --------------------- */

const PATHS = {
  arrow: "M5 12h13M12 5l7 7-7 7",
  check: "M4 12.5 9 17.5 20 6.5",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  cart: "M3 4h2l2.5 11h10L20 7H6M9 20h.01M17 20h.01",
  mobile: "M7 2h10v20H7zM11 18.5h2",
  gear: "M12 9a3 3 0 100 6 3 3 0 000-6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1",
  pen: "M4 20h4L20.5 7.5a2.1 2.1 0 00-3-3L5 17v3z",
  layout: "M3 4h18v16H3zM3 9h18M9 9v11",
  shield: "M12 3l8 3v6c0 4.8-3.4 8-8 9-4.6-1-8-4.2-8-9V6z",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  users: "M16 20v-1.5a4 4 0 00-4-4H6a4 4 0 00-4 4V20M9 10.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7M22 20v-1.5a4 4 0 00-3-3.9M16 3.6a4 4 0 010 7.7",
  chart: "M4 20V11M10 20V4M16 20v-6M2 20h20",
  clock: "M12 3a9 9 0 100 18 9 9 0 000-18zM12 7.5V12l3 2",
  globe: "M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18",
  mail: "M3 5h18v14H3zM3 6l9 7 9-7",
  phone: "M5 3h4l2 5-2.5 1.5a12 12 0 006 6L16 13l5 2v4a1 1 0 01-1 1A17 17 0 013 5a1 1 0 011-1",
  sparkle: "M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z",
  plus: "M12 5v14M5 12h14",
  code: "M9 6l-6 6 6 6M15 6l6 6-6 6",
  rocket: "M12 2c3 2 5 5.5 5 10l-5 4-5-4c0-4.5 2-8 5-10zM12 11h.01M7 16l-2 5 5-2M17 16l2 5-5-2",
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
      className={`relative overflow-hidden border-t border-line py-20 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
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

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ease-brand";

const BUTTON_VARIANTS = {
  primary:
    "bg-linear-to-r from-violet to-magenta text-ink shadow-[0_0_24px_-6px_var(--color-magenta)] hover:shadow-[0_0_36px_-4px_var(--color-magenta)]",
  ghost:
    "border border-line-strong text-ink-muted hover:border-violet hover:text-ink",
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
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg border border-line bg-surface/60 p-6 transition-all duration-300 ease-brand ${
        interactive
          ? "hover:-translate-y-1 hover:border-violet/50 hover:bg-surface"
          : ""
      } ${className}`}
    >
      {children}
    </div>
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
    <span className="rounded-full border border-line bg-surface-2 px-3 py-1 text-xs text-ink-muted">
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
    <Section className="border-b">
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
      <Glow className="-top-20 right-0 size-[420px]" from="var(--color-magenta)" />
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
