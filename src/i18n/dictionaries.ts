import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { defaultLocale, isLocale, type Locale } from "./config";

async function loadFr() {
  const [common, home, services, models, pages] = await Promise.all([
    import("./messages/fr/common.json"),
    import("./messages/fr/home.json"),
    import("./messages/fr/services.json"),
    import("./messages/fr/models.json"),
    import("./messages/fr/pages.json"),
  ]);
  return {
    ...common.default,
    home: home.default,
    services: services.default,
    models: models.default,
    pages: pages.default,
  };
}

export type Dictionary = Awaited<ReturnType<typeof loadFr>>;

async function loadEn(): Promise<Dictionary> {
  const [common, home, services, models, pages] = await Promise.all([
    import("./messages/en/common.json"),
    import("./messages/en/home.json"),
    import("./messages/en/services.json"),
    import("./messages/en/models.json"),
    import("./messages/en/pages.json"),
  ]);
  return {
    ...common.default,
    home: home.default,
    services: services.default,
    models: models.default,
    pages: pages.default,
  };
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: loadFr,
  en: loadEn,
};

/** Résout la langue du segment racine [lang], ou 404 si elle est inconnue. */
export async function getLocale(): Promise<Locale> {
  const value = (await lang()) as string | undefined;
  if (!value || !isLocale(value)) notFound();
  return value;
}

/** Comme getLocale, mais sans 404 : pour les pages d'erreur. */
export async function resolveLocale(): Promise<Locale> {
  const value = (await lang()) as string | undefined;
  return value && isLocale(value) ? value : defaultLocale;
}

/** Sans argument, la langue est résolue depuis le segment racine. */
export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  return dictionaries[locale ?? (await getLocale())]();
}
