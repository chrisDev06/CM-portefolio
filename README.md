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

## Hero : image et caméra

### Préparer l'image

`npm run hero -- "<source>"` produit dans `public/images/hero/` :

- `hero-neon-<largeur>.{avif,webp}` en 960 / 1280 / largeur native, **étalonnage
  cuit** (saturation, contraste) et accentuation légère ;
- au-delà de la largeur native, des variantes **agrandies au build** (Lanczos3 +
  accentuation, ×1,75 max) pour les grands écrans et le Retina : plus net que
  l'agrandissement du navigateur, sans inventer de détail ;
- le **plan lointain** : la scène floutée sur le fond du site, inline dans
  `src/lib/hero-image.ts` (1 Ko).

La source actuelle fait 1672 × 941. Pour gagner en définition sur écran 4K,
régénérer l'image en 3840 px et relancer la commande : rien d'autre à changer.

### Composition

L'image n'est **jamais recadrée** : elle est affichée entière, en retrait, ses bords
fondus dans le plan lointain (profondeur de champ). En paysage, elle occupe
`min(84 % de la largeur, 88 % de la hauteur)`, décalée à droite ; en portrait,
un bandeau ancré en bas, sujet centré. Réglages : `.hero-stage` dans `globals.css`.

### Animation

| Mouvement | Où | Réglage |
|---|---|---|
| Mise au point à l'ouverture (fondu + avancée) | `.hero-near` | 1,6 s / 3,4 s |
| Travelling lent vers le sujet, en montant | `.hero-drift` | 46 s aller, sinusoïde |
| Parallaxe au curseur, avec inertie | `hero-camera.tsx` | ±16 px, τ = 1,1 s |
| Parallaxe au défilement | `hero-camera.tsx` | 14 % / 28 % |
| Respiration du néon | `.hero-glow` | 7 s |

Deux plans à des vitesses différentes : c'est ce qui crée la profondeur.
Toutes les échelles animées restent ≤ 1, et chaque image a sa propre couche :
le navigateur l'affiche comme texture GPU, jamais agrandie ni redessinée pendant
le mouvement. Tout s'arrête avec `prefers-reduced-motion`.

### Mesures (build de production, Chrome, GPU)

| | 1868×961 | iPhone 390×844 @3 |
|---|---|---|
| Travelling seul | 60 i/s, pire image 17 ms | 60 i/s |
| Curseur réel + survols | 60 i/s ¹ | — |
| Défilement de toute la page | 59,7 i/s, pire image 33 ms | 60 i/s |
| Netteté | affichée ≤ résolution décodée à toutes les tailles testées ||

¹ Au tout premier survol d'un navigateur neuf, Chrome compile les shaders de
l'effet des cartes (≈ 130 ms, une fois) ; il les garde ensuite en cache.

**À ne pas réintroduire** : animer `box-shadow` ou utiliser `transition-all` sur un
élément survolé, afficher un SVG complexe en grand. Chacun a été mesuré à 100–200 ms
par image sur ce site.

## Images des modèles

Chaque modèle possède ses fichiers dans `public/models/<id>/` :

```
cover.png  desktop.png  mobile.png  feature-01.png  feature-02.png
```

Ce sont des **maquettes d'interface générées** (`scripts/generate-model-mockups.mjs`,
rendues en PNG au double de la résolution), pas des captures. Chacune a sa propre
palette et sa propre mise en page selon le secteur. `next/image` les sert en WebP
à la bonne taille.

**Pour passer aux vraies captures** : déposer le PNG au même chemin et renseigner
`demo` dans `messages/*/models.json` pour activer le bouton « Voir la démo en direct ».

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

⚠️ **Ne jamais nommer un token de couleur comme un utilitaire Tailwind existant.** Le fond
s'appelle `canvas`, pas `base` : un token `--color-base` génère un utilitaire `text-base`
qui écrase celui de taille de police, et le texte se retrouve écrit en noir sur noir sans
que rien ne le signale. Même précaution pour `sm`, `lg`, `xl`.

## À remplacer avant la mise en ligne

| Élément | État |
|---|---|
| Police display | `Space_Grotesk` est un **placeholder**. Cible : Clash Display / General Sans en woff2 dans `public/fonts` (`src/lib/fonts.ts`). |
| Textes | Rédaction provisoire dans `messages/{fr,en}/`, à valider (docs/ASSETS.md §8). La version EN doit être relue par un anglophone. |
| Prix des modèles | **Inventés pour la démonstration.** À fixer avant publication : un prix affiché engage. |
| Démos en direct | `demo: ""` dans `models.json` → le bouton affiche « Démo bientôt disponible ». Renseigner l'URL de chaque démo déployée. |
| Scores Lighthouse | Saisis à la main dans `models.json`. À mesurer automatiquement (docs/PLAN.md §8). |
| Visuels des modèles | Maquettes d'interface générées (PNG), pas des captures des démos réelles. Procédure de remplacement ci-dessus. |
| Portraits | Bloc binôme en initiales, en attendant les photos (docs/ASSETS.md §5). |
| Logo, favicon, OG | Non fournis. |
| Envoi du formulaire | Le configurateur affiche un récapitulatif ; l'envoi (Resend + Turnstile) n'est pas branché. |
| Mentions légales | SIREN, statut, adresse et hébergeur manquants. |
| `NEXT_PUBLIC_SITE_URL` | À définir pour que les URL canoniques et OG soient absolues. |
