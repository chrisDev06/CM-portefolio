import Link from "next/link";
import {
  path,
  servicePath,
  serviceIds,
  type Locale,
  type RouteKey,
} from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "./ui";
import { Logo } from "./site-header";

const EXPLORE = [
  "models",
  "agency",
  "method",
  "pricing",
  "faq",
  "contact",
] as const satisfies readonly RouteKey[];

const LEGAL = ["legal", "privacy", "terms"] as const satisfies readonly RouteKey[];

function Column({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.18em] text-ink-muted">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface/40">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo locale={locale} />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ink-muted">
              {dict.footer.tagline}
            </p>
            <p className="mt-4 text-sm text-ink-muted">{dict.footer.based}</p>
          </div>

          <Column
            title={dict.footer.columns.services}
            links={serviceIds.map((id) => ({
              href: servicePath(id, locale),
              label: dict.services.items[id].name,
            }))}
          />
          <Column
            title={dict.footer.columns.explore}
            links={EXPLORE.map((key) => ({
              href: path(key, locale),
              label: dict.nav[key],
            }))}
          />
          <Column
            title={dict.footer.columns.legal}
            links={LEGAL.map((key) => ({
              href: path(key, locale),
              label: dict.nav[key],
            }))}
          />
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-line pt-8 text-sm text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {dict.meta.siteName}. {dict.footer.rights}
          </p>
          <p>{dict.meta.tagline}</p>
        </div>
      </Container>
    </footer>
  );
}
