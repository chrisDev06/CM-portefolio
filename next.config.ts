import type { NextConfig } from "next";
import { routes } from "./src/i18n/config";

/**
 * Les dossiers de routes portent le slug FR. Ces rewrites servent les URL
 * anglaises publiques sans changer l'arborescence (docs/PLAN.md §3).
 */
function englishRewrites() {
  const rules: { source: string; destination: string }[] = [];

  for (const key of Object.keys(routes) as (keyof typeof routes)[]) {
    const { fr, en } = routes[key];
    if (!en || en === fr) continue;
    rules.push({ source: `/en/${en}`, destination: `/en/${fr}` });
    rules.push({ source: `/en/${en}/:path*`, destination: `/en/${fr}/:path*` });
  }

  // Les slugs de service sont gérés par la route dynamique [slug].
  return rules;
}

const nextConfig: NextConfig = {
  experimental: {
    // Le root layout vit sous [lang] : seul global-not-found peut habiller
    // les URL qui ne correspondent à aucune route (doc Next 16, not-found.md).
    globalNotFound: true,
  },
  async rewrites() {
    return { beforeFiles: [], afterFiles: englishRewrites(), fallback: [] };
  },
};

export default nextConfig;
