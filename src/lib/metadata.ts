import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";

/**
 * Chaque page porte ses hreflang réciproques et son canonique
 * (docs/PLAN.md §7). `urls` contient l'URL équivalente par langue.
 */
export function localizedMetadata({
  locale,
  title,
  description,
  urls,
}: {
  locale: Locale;
  title: string;
  description: string;
  urls: Record<Locale, string>;
}): Metadata {
  const languages: Record<string, string> = { "x-default": urls.fr };
  for (const l of locales) languages[l] = urls[l];

  return {
    title,
    description,
    alternates: { canonical: urls[locale], languages },
    openGraph: { title, description, url: urls[locale] },
  };
}
