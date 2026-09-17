export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Slugs traduits : un slug français dans une URL anglaise dégrade le
 * référencement local (voir docs/PLAN.md §3). Le slug FR sert aussi de nom
 * de dossier ; les URL anglaises passent par les rewrites de next.config.ts.
 */
export const routes = {
  home: { fr: "", en: "" },
  services: { fr: "services", en: "services" },
  models: { fr: "modeles", en: "ready-to-launch" },
  agency: { fr: "agence", en: "agency" },
  method: { fr: "methode", en: "how-we-work" },
  pricing: { fr: "tarifs", en: "pricing" },
  faq: { fr: "faq", en: "faq" },
  contact: { fr: "contact", en: "contact" },
  legal: { fr: "mentions-legales", en: "legal-notice" },
  privacy: { fr: "confidentialite", en: "privacy-policy" },
  terms: { fr: "cgv", en: "terms" },
} as const;

export type RouteKey = keyof typeof routes;

export function path(key: RouteKey, locale: Locale): string {
  const slug = routes[key][locale];
  return slug ? `/${locale}/${slug}` : `/${locale}`;
}

/* --- Services ------------------------------------------------------------ */

export const serviceIds = [
  "site-web",
  "e-commerce",
  "mobile",
  "sur-mesure",
  "refonte",
  "maintenance",
] as const;

export type ServiceId = (typeof serviceIds)[number];

export const serviceSlugs: Record<ServiceId, Record<Locale, string>> = {
  "site-web": { fr: "site-web", en: "website" },
  "e-commerce": { fr: "e-commerce", en: "e-commerce" },
  mobile: { fr: "application-mobile", en: "mobile-app" },
  "sur-mesure": { fr: "sur-mesure", en: "custom-software" },
  refonte: { fr: "refonte", en: "redesign" },
  maintenance: { fr: "maintenance", en: "maintenance" },
};

export function servicePath(id: ServiceId, locale: Locale): string {
  return `${path("services", locale)}/${serviceSlugs[id][locale]}`;
}

export function serviceIdFromSlug(slug: string): ServiceId | undefined {
  return serviceIds.find((id) =>
    locales.some((l) => serviceSlugs[id][l] === slug),
  );
}

/* --- Modèles ------------------------------------------------------------- */

export const modelIds = [
  "horizon-travel",
  "fitzone",
  "soundwave",
  "greenenergy",
] as const;

export type ModelId = (typeof modelIds)[number];

/** Noms propres : même slug dans les deux langues, donc aucun rewrite. */
export function modelPath(id: ModelId, locale: Locale): string {
  return `${path("models", locale)}/${id}`;
}

export function isModelId(value: string): value is ModelId {
  return (modelIds as readonly string[]).includes(value);
}
