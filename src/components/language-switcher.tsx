"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  locales,
  path,
  routes,
  serviceIdFromSlug,
  serviceSlugs,
  type Locale,
  type RouteKey,
} from "@/i18n/config";

/** Retrouve la clé de route à partir du slug affiché dans l'URL. */
function routeKeyFrom(segment: string, locale: Locale): RouteKey {
  const keys = Object.keys(routes) as RouteKey[];
  return keys.find((key) => routes[key][locale] === segment) ?? "home";
}

/**
 * URL équivalente dans la langue cible, slug enfant compris : les slugs de
 * service se traduisent, les noms de modèles ne changent pas.
 */
function translate(pathname: string, from: Locale, to: Locale): string {
  const [, , section, child] = pathname.split("/");
  const key = routeKeyFrom(section ?? "", from);
  const base = path(key, to);

  if (!child) return base;
  if (key === "services") {
    const id = serviceIdFromSlug(child);
    return id ? `${base}/${serviceSlugs[id][to]}` : base;
  }
  if (key === "models") return `${base}/${child}`;
  return base;
}

export function LanguageSwitcher({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className="flex items-center gap-1 text-sm">
      {locales.map((target) => (
        <Link
          key={target}
          href={translate(pathname, locale, target)}
          hrefLang={target}
          aria-current={target === locale ? "true" : undefined}
          className={
            target === locale
              ? "px-2 py-1 text-ink"
              : "px-2 py-1 text-ink-muted transition-colors hover:text-ink"
          }
        >
          {target.toUpperCase()}
        </Link>
      ))}
    </nav>
  );
}
