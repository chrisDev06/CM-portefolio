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
  /** Décor de l'aperçu de l'accueil, généré par
      scripts/generate-model-scenes.mjs — seulement pour les modèles mis en
      avant (voir components/model-showcase.tsx). */
  scene: string;
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
    scene: `${base(id)}/scene.webp`,
  };
}

/** Chaque modèle s'allume dans la teinte de sa propre maquette. */
export const MODEL_ACCENTS: Record<ModelId, string> = {
  "horizon-travel": "#F2994A",
  fitzone: "#C4F042",
  soundwave: "#F5A524",
  greenenergy: "#34D399",
};

/**
 * Couleurs des démos reproduites dans les aperçus de l'accueil
 * (components/model-previews.tsx). Ce sont les chartes des sites présentés,
 * pas celle de C&M Agency : elles n'ont rien à faire dans les tokens @theme.
 */
export const PREVIEW_PALETTES = {
  /** Boutons de fenêtre macOS : rouge, orange, vert. */
  browserDots: ["#FF5F57", "#FEBC2E", "#28C840"],
  "horizon-travel": {
    accent: MODEL_ACCENTS["horizon-travel"],
    accent2: "#EC6A84",
    onAccent: "#2B1216",
    /** Icône d'application : ciel du soir, soleil, collines. */
    icon: {
      sky: "#2A1F5E",
      dusk: "#8E4A8A",
      sun: "#FFE2B0",
      hills: "#241836",
      shore: "#140E22",
    },
  },
  fitzone: {
    accent: MODEL_ACCENTS.fitzone,
    onAccent: "#161C05",
    screen: "#0B0B10",
    panel: "#17171F",
    island: "#000000",
    silhouette: "#1A120F",
    /** Vignettes des séances : dégradés chauds, un par séance. */
    thumbs: [
      ["#F4A261", "#C8443C"],
      ["#E9C28E", "#9A5A36"],
      ["#F2C6A0", "#6F8FA8"],
      ["#F08A7E", "#8E2F45"],
    ],
  },
} as const;
