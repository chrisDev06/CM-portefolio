import type { ModelId } from "@/i18n/config";

/**
 * Maquettes d'interface générées par scripts/generate-model-mockups.mjs, en
 * PNG : remplacer un fichier par la capture réelle de la démo suffit, next/image
 * la sert ensuite en WebP à la bonne taille.
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
    cover: `${base(id)}/cover.png`,
    desktop: `${base(id)}/desktop.png`,
    mobile: `${base(id)}/mobile.png`,
    features: [`${base(id)}/feature-01.png`, `${base(id)}/feature-02.png`],
    demoHost: APPS.includes(id) ? undefined : `${id}.cm-agency.fr`,
  };
}

/** Chaque modèle s'allume dans la teinte de sa propre maquette. */
export const MODEL_ACCENTS: Record<ModelId, string> = {
  "horizon-travel": "#F2994A",
  fitzone: "#C4F042",
  soundwave: "#F5A524",
  greenenergy: "#34D399",
};
