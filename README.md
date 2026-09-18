# C&M Agency — site

Site vitrine bilingue de C&M Agency. Cadrage complet dans [docs/PLAN.md](docs/PLAN.md), assets à produire dans [docs/ASSETS.md](docs/ASSETS.md).

## Démarrer

```bash
npm run dev      # http://localhost:3000 (redirige vers /fr ou /en)
npm run build    # build de production
npm run lint
npm run mockups  # régénère les maquettes d'interface des modèles
npm run hero -- "<chemin/source.png>"   # reconvertit l'image de fond du hero
```

## Image de fond du hero

`npm run hero -- "<source>"` produit `public/images/hero/hero-neon-<largeur>.{avif,webp}`
en 960 / 1280 / 1600 px et à la largeur native, plus le LQIP inline dans
`src/lib/hero-image.ts`. Le script **n'agrandit jamais** au-delà de la source :
inventer des pixels alourdit la page sans ajouter de détail.

La source actuelle fait **1672 × 941** : nette jusqu'à ~1670 px de large, agrandie
par le navigateur au-delà (1,15× en 1920, 2,3× en 4K). Pour un rendu net sur grand
écran, régénérer l'image en 2560 px minimum et relancer la commande — rien d'autre
à changer, le composant lit les largeurs depuis `hero-image.ts`.

## Images des modèles

Chaque modèle possède ses fichiers dans `public/models/<id>/` :

```
cover.svg  desktop.svg  mobile.svg  feature-01.svg  feature-02.svg
```

Ce sont des **maquettes d'interface générées** (`scripts/generate-model-mockups.mjs`),
pas des captures. Chacune a sa propre palette et sa propre mise en page selon le
secteur : site éditorial pour Horizon Travel, écrans d'application pour FitZone,
grille produits pour SoundWave, tableau de bord pour GreenEnergy.

**Pour passer aux vraies captures** : déposer le fichier au même chemin, puis

1. mettre l'extension à jour dans `src/lib/model-assets.ts` ;
2. retirer `unoptimized` des `<Image>` de `src/components/device.tsx` et
   `blocks.tsx` pour que Next optimise le raster ;
3. renseigner `demo` dans `messages/*/models.json` pour activer le bouton
   « Voir la démo en direct ».

Les cadres d'appareil (`src/components/device.tsx`) s'adaptent : un modèle listé
dans `APPS` (model-assets.ts) s'affiche sans barre d'adresse.

## Stack

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4.

## Pages

44 pages statiques (22 par langue) :

| Route FR | Route EN | Contenu |
|---|---|---|
| `/fr` | `/en` | Accueil : hero, services, modèles, différence, binôme, méthode, technos |
| `/fr/services` | `/en/services` | Vue d'ensemble des 6 services |
| `/fr/services/[slug]` | `/en/services/[slug]` | 6 pages service complètes (à qui, problème, fonctionnalités, déroulé, inclus, délais, FAQ) |
| `/fr/modeles` | `/en/ready-to-launch` | Catalogue des sites prêts à lancer, filtrable |
| `/fr/modeles/[model]` | `/en/ready-to-launch/[model]` | 4 fiches modèle : étude de cas + fiche produit |
| `/fr/agence` | `/en/agency` | Histoire, valeurs, binôme, engagements |
| `/fr/methode` | `/en/how-we-work` | 8 étapes + suivi de projet + communication |
| `/fr/tarifs` | `/en/pricing` | Méthode de chiffrage, fourchettes, modalités |
| `/fr/faq` | `/en/faq` | 20 questions en 5 catégories, balisage `FAQPage` |
| `/fr/contact` | `/en/contact` | Configurateur 5 étapes + profils + coordonnées |
| `/fr/mentions-legales` · `/fr/confidentialite` · `/fr/cgv` | `/en/legal-notice` · `/en/privacy-policy` · `/en/terms` | Pages légales |

## Structure

```
src/
  app/[lang]/           root layout localisé — toutes les pages vivent ici
  app/global-not-found  404 des URL hors routes (bilingue)
  app/globals.css       tokens de design (@theme) + base
  components/
    ui.tsx              primitives : Icon, Container, Section, Button, Card…
    blocks.tsx          blocs métier : cartes service/modèle, binôme, FAQ
    site-header/footer  navigation
    contact-form.tsx    configurateur (client)
    model-filter.tsx    filtres du catalogue (client)
  i18n/
    config.ts           locales, slugs traduits, helpers path()/servicePath()
    dictionaries.ts     chargement des messages côté serveur
    messages/{fr,en}/   common · home · services · models · pages
  lib/fonts.ts  lib/metadata.ts
  proxy.ts              négociation de langue et redirection (ex-middleware)
content/{fr,en}/        MDX (vide : le contenu vit pour l'instant en JSON)
public/                 assets — voir docs/ASSETS.md §9
```

Les dossiers de routes portent le slug FR ; les URL anglaises sont servies par
les rewrites générés dans `next.config.ts` à partir de `routes`.

## Conventions i18n

- Toutes les URL sont préfixées : `/fr/...` et `/en/...`. `/` redirige selon `Accept-Language`, défaut FR.
- **Les slugs sont traduits** (`/fr/modeles` ↔ `/en/ready-to-launch`). Toute nouvelle page s'ajoute dans `routes` (`src/i18n/config.ts`) — c'est ce qui fait fonctionner le sélecteur de langue et les `hreflang`.
- Jamais d'URL en dur : utiliser `path("models", locale)`.
- Les textes vivent dans `messages/*.json`, pas dans les composants.
- Dans un composant serveur profond, la langue se lit avec `getLocale()` (basé sur `next/root-params`), sans prop drilling.

## Design

Les tokens sont dans `src/app/globals.css` (`@theme`) : couleurs, échelle typographique fluide, rayons, courbe d'animation unique. Ne pas écrire de valeur en dur dans un composant.

## À remplacer avant la mise en ligne

| Élément | État |
|---|---|
| Police display | `Space_Grotesk` est un **placeholder**. Cible : Clash Display / General Sans en woff2 dans `public/fonts` (`src/lib/fonts.ts`). |
| Textes | Rédaction provisoire dans `messages/{fr,en}/`, à valider (docs/ASSETS.md §8). La version EN doit être relue par un anglophone. |
| Prix des modèles | **Inventés pour la démonstration.** À fixer avant publication : un prix affiché engage. |
| Démos en direct | `demo: ""` dans `models.json` → le bouton affiche « Démo bientôt disponible ». Renseigner l'URL de chaque démo déployée. |
| Scores Lighthouse | Saisis à la main dans `models.json`. À mesurer automatiquement (docs/PLAN.md §8). |
| Visuels des modèles | Maquettes d'interface générées, pas des captures des démos réelles. Procédure de remplacement ci-dessus. |
| Portraits | Bloc binôme en initiales, en attendant les photos (docs/ASSETS.md §5). |
| Logo, favicon, OG | Non fournis. |
| Envoi du formulaire | Le configurateur affiche un récapitulatif ; l'envoi (Resend + Turnstile) n'est pas branché. |
| Mentions légales | SIREN, statut, adresse et hébergeur manquants. |
| `NEXT_PUBLIC_SITE_URL` | À définir pour que les URL canoniques et OG soient absolues. |
