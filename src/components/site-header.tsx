import Link from "next/link";
import { path, type Locale, type RouteKey } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { Icon } from "./ui";

/** Ces clés doivent exister à la fois dans `routes` et dans `nav` des messages. */
const NAV = [
  "services",
  "models",
  "agency",
  "method",
  "pricing",
] as const satisfies readonly RouteKey[];

export function Logo({ locale }: { locale: Locale }) {
  return (
    <Link
      href={path("home", locale)}
      className="font-display text-xl font-bold tracking-tight"
    >
      C<span className="text-gradient">&amp;</span>M
      <span className="ml-2 text-xs font-normal uppercase tracking-[0.2em] text-ink-muted">
        Agency
      </span>
    </Link>
  );
}

export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const links = NAV.map((key) => ({
    href: path(key, locale),
    label: dict.nav[key],
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-8">
        <Logo locale={locale} />

        <nav aria-label={dict.meta.siteName} className="hidden gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-glow text-sm text-ink-muted"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} label={dict.language.label} />
          <Link
            href={path("contact", locale)}
            className="hidden items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm transition-colors duration-200 ease-brand hover:border-violet sm:inline-flex"
          >
            {dict.cta.button}
            <Icon name="arrow" className="size-4" />
          </Link>
          <MobileNav
            links={[...links, { href: path("faq", locale), label: dict.nav.faq }]}
            openLabel={dict.nav.openMenu}
            closeLabel={dict.nav.closeMenu}
            ctaLabel={dict.nav.contact}
            ctaHref={path("contact", locale)}
          />
        </div>
      </div>
    </header>
  );
}
