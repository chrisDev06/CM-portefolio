<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Conventions du projet

- Toutes les pages vivent sous `src/app/[lang]/` : le root layout est localisé, donc `lang` est un root param lisible via `next/root-params`.
- Ajouter une page = ajouter son entrée dans `routes` (`src/i18n/config.ts`) avec les deux slugs, sinon le sélecteur de langue et les `hreflang` la manquent.
- Pas d'URL en dur : `path(key, locale)`.
- Pas de couleur, rayon ou durée en dur : tokens `@theme` dans `src/app/globals.css`.
- Pas de texte en dur dans un composant : `src/i18n/messages/{fr,en}.json`.
- `middleware.ts` n'existe pas en Next 16 : c'est `src/proxy.ts`.
- Contexte produit et décisions : `docs/PLAN.md`. Assets attendus : `docs/ASSETS.md`.
