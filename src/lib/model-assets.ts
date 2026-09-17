import type { ModelId } from "@/i18n/config";

/**
 * Maquettes d'interface générées par scripts/generate-model-mockups.mjs.
 * Remplacer un fichier par la capture réelle de la démo suffit : si le format
 * devient raster, retirer `unoptimized` sur les <Image> de device.tsx.
 */
export type ModelAssets = {
  cover: string;
  desktop: string;
  mobile: string;
  features: string[];
  /** Domaine affiché dans la barre d'adresse — absent pour une application. */
  demoHost?: string;
};

const base = (id: ModelId) => `/models/${id}`;

/** Une application mobile ne se présente pas dans un cadre de navigateur. */
const APPS: ModelId[] = ["fitzone"];

export function modelAssets(id: ModelId): ModelAssets {
  return {
    cover: `${base(id)}/cover.svg`,
    desktop: `${base(id)}/desktop.svg`,
    mobile: `${base(id)}/mobile.svg`,
    features: [`${base(id)}/feature-01.svg`, `${base(id)}/feature-02.svg`],
    demoHost: APPS.includes(id) ? undefined : `${id}.cm-agency.fr`,
  };
}

/** Le hero de l'accueil montre un modèle réel plutôt qu'une image d'illustration. */
export const HOME_DESKTOP_MODEL: ModelId = "horizon-travel";
export const HOME_MOBILE_MODEL: ModelId = "fitzone";

/** Chaque modèle s'allume dans la teinte de sa propre maquette. */
export const MODEL_ACCENTS: Record<ModelId, string> = {
  "horizon-travel": "#F2994A",
  fitzone: "#C4F042",
  soundwave: "#F5A524",
  greenenergy: "#34D399",
};
