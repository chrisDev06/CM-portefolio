# Plan du site — C&M Agency

> État : cadrage validé le 17/09/2026. Décisions prises en §2.
> **Site construit** : 44 pages statiques (22 par langue), build et lint verts.
> **Bloquant avant mise en ligne** : le contenu manque d'authenticité (§12) et les assets réels manquent ([ASSETS.md](ASSETS.md)).

---

## 1. Ce que je garde, ce que je changerais

Votre plan en 10 pages est solide : le parcours commercial (découverte → service → preuve → qui vous êtes → méthode → objections → estimation → contact) est juste et l'angle **« Le digital sans intermédiaire »** est la meilleure idée du document. Cinq corrections avant de construire.

### 1.1 Fusionner « Méthode » et « Communication & accompagnement »

Deux pages qui disent *« vous ne serez pas laissé dans le noir »* se cannibalisent : en SEO elles se concurrencent sur les mêmes requêtes, et en lecture le prospect a l'impression de relire la même chose. Une seule page **« Comment on travaille »**, longue, avec deux ancres (`#methode`, `#suivi`) : les 8 étapes, puis le bloc suivi/communication avec la fausse interface d'avancement. Une page forte plutôt que deux tièdes.

### 1.2 Une seule saisie de besoin, pas deux

« Tarifs/Estimation » et « Contact » proposaient le même formulaire long. Je sépare par intention :

- **`/tarifs`** — page de *contenu* : comment un projet est chiffré, ce qui fait varier le prix, fourchettes indicatives par type de projet, ce qui est inclus/exclu. C'est une page qui se positionne très bien en SEO (« prix création site web », « combien coûte une application mobile ») et qui désamorce l'objection avant l'appel. Elle se termine sur le configurateur.
- **`/contact`** — le configurateur multi-étapes (le parcours que vous décriviez) + un mode court « j'ai juste une question » + les deux profils + les infos légales.

Un seul formulaire à maintenir, un seul flux de leads vers Manon.

### 1.3 Supprimer tout ce qui n'est pas vérifiable

Vous l'avez dit pour les chiffres, je vais plus loin — dans les maquettes fournies il reste :

| Élément de la maquette | Problème | Remplacement |
|---|---|---|
| « +50 projets », « 150+ », « 98 % clients satisfaits » | Invérifiable, et un visiteur qui doute une fois doute partout | Chiffres factuels : années d'expérience, délai de réponse garanti, nombre de technos maîtrisées, durée de garantie après livraison |
| Équipe de 4 personnes avec visages générés | Contredit frontalement le positionnement « binôme » et se détecte en deux secondes | Deux vraies photos, Manon et Christopher |
| « 5 ans / 12 experts » | Idem | À remplacer par la réalité |
| Témoignages non signés | Sans nom + entreprise, ça ne rassure personne | Soit 3 vrais témoignages signés avec accord écrit, soit pas de bloc témoignages au lancement |
| Logos clients | Nécessitent une autorisation | À défaut : « secteurs accompagnés » (immobilier, restauration, artisanat…) |

La fausse interface de suivi de la page « Comment on travaille » est une bonne idée **à condition** d'être étiquetée « Exemple d'un suivi de projet » de façon visible : c'est une illustration, pas une capture.

### 1.4 La direction artistique : garder le niveau, baisser le volume

Les deux maquettes sont dans le même registre (fond sombre, néon violet/magenta, halos). C'est joli, mais c'est aujourd'hui l'esthétique par défaut de milliers de sites de freelances — donc l'inverse du luxe. Ce qui fait « premium » :

- **Un noir profond, pas un violet saturé partout.** Base `#08080C`, le dégradé violet→magenta réservé à 3 ou 4 endroits par page maximum (accent de titre, CTA principal, ligne active).
- **De l'air.** Les maquettes sont denses : sections à 120–180 px de respiration verticale en desktop, largeur de texte plafonnée à ~65 caractères.
- **La typographie porte le luxe**, pas les effets. Un display à fort caractère en très grande taille + un texte neutre impeccable.
- **Le glow remplace l'ombre** — mais un seul niveau, pas cinq.
- **Contraste** : les textes gris de la maquette (`#8A8A9A` sur fond sombre) passent sous le seuil WCAG AA. À remonter, ce n'est pas négociable pour un site pro.
- **Le mouvement doit être rare et net** : apparitions à 200–300 ms, une seule animation par zone visible, `prefers-reduced-motion` respecté.

### 1.5 Le hero ne doit pas montrer un faux site

Dans les maquettes, l'écran du MacBook affiche… une page fictive. Le premier visuel du site doit montrer **un de vos modèles réellement en ligne**, avec un lien « voir la démo en direct » à côté. Vous avez des sites déployés : c'est un avantage sur la quasi-totalité de vos concurrents, qui n'ont que des captures d'écran. Ne le gâchez pas avec une image de synthèse.

> **Modifié le 18/09/2026.** Le hero est désormais l'image d'ambiance néon fournie, en fond plein écran. L'objection initiale ne s'applique plus : l'écran du portable y affiche un paysage, pas un faux site web. Les modèles réels restent la preuve, montrés juste en dessous dans « Sites prêts à lancer ».
>
> **Limite de résolution à connaître.** La source fait 1672 × 941 px. Elle est servie nette jusqu'à ~1670 px de large ; au-delà, le navigateur l'agrandit (1,15× en 1920, 1,53× en 2560, 2,3× en 4K). Sur un grand écran ou un écran Retina, le flou se verra. Pour y remédier : régénérer l'image en 2560 px minimum, idéalement 3840, puis relancer `npm run hero`.

### 1.6 Ajouts

- **Pages légales** : mentions légales, politique de confidentialité, CGV/conditions de prestation, page cookies (voir §9).
- **Page 404 travaillée** (c'est un détail qui signe un site soigné).
- **Phase 2 SEO** : pages locales (« création de site web à \<ville\> ») et 6–10 articles de fond. Pas au lancement, mais l'architecture doit les accueillir sans refonte.

---

## 2. Décisions actées

| # | Décision | Conséquence sur le projet |
|---|---|---|
| 1 | **Marque : C&M Agency**, logo à créer | Le `&` devient le motif central de l'identité : il *est* le binôme. Baseline « Le digital sans intermédiaire ». Domaine à réserver (voir §2.1). |
| 2 | **Aucun client réel à montrer**, mais des projets déjà déployés et vendables | Change l'architecture : l'offre « **Sites prêts à lancer** » remplace la page Réalisations au lancement (voir §2.2). |
| 3 | **Next.js + TypeScript + Tailwind + Framer Motion**, MDX, Vercel | Le site devient lui-même une démonstration de la stack annoncée. Installé en **Next.js 16** (version courante au moment du démarrage, et non 15 comme indiqué à la question) : App Router, Turbopack, React 19. |
| 4 | **Contenu en MDX**, édité par Christopher | Pas de CMS en V1. Le contenu est structuré dès maintenant pour qu'un passage à Sanity/Payload en phase 2 soit indolore. |
| 5 | **Photos réalisées par vos soins** | Protocole de prise de vue fourni dans ASSETS.md §5. Je prends en charge le détourage et l'harmonisation colorimétrique. |
| 6 | **Bilingue FR + EN dès la V1** | +3 à 4 j de développement, +25 % de rédaction, et un choix de portée à arbitrer (voir §2.3). |

### 2.1 Ce qu'il me faut encore (non bloquant pour démarrer le design)

- Nom de domaine : vérifier la disponibilité de `cm-agency.fr`, `cmagency.fr`, `cm-agency.com`. Si vous partez à l'international avec l'anglais, le `.com` devient prioritaire.
- Adresse mail pro et téléphone affichables.
- **Statut juridique** (micro-entreprise ×2 ? SASU commune ?) + SIREN — obligatoire pour les mentions légales, et ça change la rédaction des CGV.
- Facturez-vous de la maintenance récurrente ? Si oui, la page Maintenance devient une offre chiffrée, pas une simple réassurance.
- Les délais que vous pouvez vous engager à tenir (réponse sous X h, livraison d'un modèle personnalisé en X jours). Ce sont vos seuls « chiffres » vérifiables — ils remplacent les « +150 projets » des maquettes.

### 2.2 Correction sur la présentation des projets démo

Vous avez choisi « preuve + offre commerciale », et c'est le bon arbitrage. Une précision sur la mise en œuvre, par rapport à ce que je proposais dans la question : **une seule page, pas deux.** Faire cohabiter une page « Réalisations » et une page « Sites prêts à lancer » qui montrent exactement les mêmes projets, c'est le défaut que je reprochais plus haut à Méthode/Communication — duplication, cannibalisation SEO, et le visiteur qui se demande s'il a raté quelque chose.

Donc :

- **`/modeles` — « Sites prêts à lancer »** devient une page principale de la navigation. Chaque modèle a sa fiche construite **comme une étude de cas** (intention de direction artistique, problème que le modèle résout, fonctionnalités, choix techniques, performances mesurées) **et** comme une fiche produit (démo en ligne, prix, délai de mise en ligne, options de personnalisation). La même page fait les deux métiers : elle prouve et elle vend.
- **`/realisations` existe dans l'architecture mais n'est pas publiée au lancement.** Elle s'ouvre le jour où un premier vrai client accepte d'être cité. Chaque fiche modèle prévoit déjà l'emplacement « ce modèle a été personnalisé pour… ».

C'est aussi un argument de vente rare : vos concurrents montrent des captures d'écran, vous proposez **un site en ligne, réellement cliquable, testable tout de suite**. Il faut l'exploiter frontalement — un bouton « Voir la démo en direct » sur chaque carte, et le hero de l'accueil qui affiche un modèle réel.

### 2.3 Arbitrage à faire sur le bilingue

FR + EN acté. Une question reste ouverte, et elle n'est pas technique :

- **Traduire tout le site** (~7 000 mots), ou **seulement le parcours commercial** (accueil, services, modèles, contact, légal) en laissant la FAQ et la méthode en français ? Un site à moitié traduit se voit ; un site entièrement traduit mais dont la version anglaise n'attire personne est du travail perdu.
- Ma position : **traduire l'intégralité**, mais faire relire la version anglaise par un anglophone. Un anglais approximatif sur un site d'agence coûte plus cher en crédibilité que l'absence de version anglaise. Budget à prévoir : ~200–400 € de relecture.
- La version **française fait foi** juridiquement : les pages légales anglaises portent une mention explicite en ce sens.

---

## 3. Architecture finale

Navigation principale — 6 entrées, aucune de plus, + le sélecteur de langue :

```
Services · Sites prêts à lancer · Agence · Méthode · Tarifs · Contact        [FR|EN]
```

« Sites prêts à lancer » en deuxième position : c'est votre différenciateur, il ne doit pas être enterré dans un sous-menu.

Arborescence complète. **Les deux langues sont préfixées** — `/fr/...` et `/en/...` — et `/` redirige selon l'en-tête `Accept-Language`, par défaut vers le français. C'est le schéma que Next 16 gère nativement, et il évite l'ambiguïté de canonique d'un français non préfixé.

```
/                                   Accueil
/services                           Vue d'ensemble
  /services/site-web
  /services/e-commerce
  /services/application-mobile
  /services/sur-mesure
  /services/refonte
  /services/maintenance
/modeles                            Sites prêts à lancer — grille + filtres
  /modeles/[slug]                   Fiche modèle = étude de cas + fiche produit
/agence                             L'entreprise + le binôme Manon ↔ Christopher
/methode                            Méthode (#methode) + suivi (#suivi)
/tarifs                             Comment on chiffre + fourchettes
/faq                                Objections, par catégorie
/contact                            Configurateur + contact court
/mentions-legales · /confidentialite · /cgv · /404
/realisations                       ⏳ prêt, publié à la première référence client
```

**Footer** : FAQ · Maintenance · Mentions légales · Confidentialité · CGV · réseaux · « Basé en France, disponible partout ».

**Slugs anglais traduits** (`/en/services/website`, `/en/ready-to-launch`…) : un slug français dans une URL anglaise dégrade le référencement local et fait amateur. Chaque page porte ses `hreflang` réciproques et son canonique.

Soit **10 gabarits uniques** (les 6 services partagent un gabarit, les fiches modèle aussi), déclinés en deux langues.

---

## 4. Contenu et objectif par page

| Page | Objectif unique | Sections | CTA | Requête SEO visée |
|---|---|---|---|---|
| Accueil | Comprendre en 5 s + déclencher le contact | Hero (**un modèle réel, cliquable**) · 4 services · 3 modèles en vedette · « le digital sans intermédiaire » · binôme · méthode en 4 temps · technos · CTA | Lancer mon projet | agence web / création site internet \<ville\> |
| Services | Orienter vers sa problématique | 6 cartes détaillées + comparatif « quelle solution pour moi ? » + passerelle vers les modèles | Voir le service | création site internet |
| Service ×6 | Convertir + SEO | À qui · problème résolu · ce qu'on crée · fonctionnalités · déroulé · technos · inclus · délais · après la mise en ligne · FAQ · estimation | Demander une estimation | création site vitrine / e-commerce / app mobile… |
| Sites prêts à lancer | Preuve **et** vente | Promesse (« en ligne en X jours ») · grille filtrable par secteur et par type · comment se passe la personnalisation · ce qui est inclus | Voir la démo en direct | site web clé en main / template site vitrine |
| Fiche modèle | Convertir sur un produit précis | Intention de DA · à qui il s'adresse · fonctionnalités · choix techniques · performances mesurées (Lighthouse réel) · **démo en direct** · options de personnalisation · prix et délai · emplacement prévu « personnalisé pour… » | Je veux ce site | site \<secteur\> clé en main |
| Agence | Rassurer sur la petite structure | Pourquoi l'entreprise · valeurs · **le binôme** (Manon ↔ Client ↔ Christopher) · ce que ça change pour vous | Contact | qui sommes-nous |
| Méthode | Lever la peur du « tunnel » | 8 étapes · bloc suivi · exemple d'interface d'avancement · gestion des changements de périmètre | Démarrer | comment se passe un projet web |
| Tarifs | Désamorcer le prix | Comment on chiffre · ce qui fait varier · fourchettes par type · inclus/exclu · modalités de paiement · coûts récurrents | Estimer mon projet | prix création site web |
| FAQ | Lever les objections | 5 catégories (projet, prix, technique, après-livraison, communication), ~25 Q/R, balisage `FAQPage` | Contact | questions fréquentes |
| Contact | Qualifier le lead | Configurateur 5 étapes · mode court · profils Manon/Christopher · coordonnées | Envoyer | contact agence web |

**Le configurateur** (page contact) — 5 étapes, une seule question visible à la fois sur mobile, barre de progression, sauvegarde locale si la page est rechargée :

1. Que voulez-vous créer ? (vitrine / e-commerce / app / sur-mesure / refonte / **personnaliser un modèle** / je ne sais pas) — pré-rempli quand on arrive depuis une fiche modèle
2. Fonctionnalités (cases à cocher contextuelles au choix 1)
3. Contexte (nouveau projet ou existant, activité, cible)
4. Budget envisagé (fourchettes) + échéance souhaitée
5. Coordonnées + message + pièce jointe

Sortie : un mail structuré à Manon + un accusé de réception au prospect + stockage de la demande.

---

## 5. Direction artistique et design system

**Le `&` de C&M Agency est le motif de l'identité.** Il signifie littéralement ce que vend le site : Manon **&** Christopher, le commercial **&** le technique, le client **&** son développeur. Il doit vivre ailleurs que dans le logo — en filigrane géant dans le bloc « binôme », comme séparateur de sections, comme puce de liste. Une identité tient quand un seul signe est répété avec conviction ; c'est nettement plus distinctif que d'empiler des halos violets.

> ⚠️ **Pas encore tenu.** Le `&` n'existe aujourd'hui que dans le logo du header. Tant qu'il ne structure pas les pages, le site reste un thème sombre générique de plus. C'est le premier chantier d'identité à ouvrir.

Tokens à figer avant la première ligne de CSS :

- **Couleurs** — base `#08080C` / surfaces `#0F0F16`, `#15151F` / bordures `rgba(255,255,255,.08)` / texte `#F5F5F7`, `#A8A8B8` (remonté pour AA) / accent dégradé violet `#7C3AED` → magenta `#D946EF` → un soupçon d'ambre `#F59E0B` uniquement en détail. Variante claire prévue dès le départ (tokens CSS), même si on ne l'expose pas en V1.
- **Typographie** — display + texte, deux familles maximum, échelle fluide en `clamp()`, en pixels rendus : 12 / 14 / 16 / 18 / 20–22 / 24–28 / 30–36 / 36–48 / 40–56 / 44–80. Interlignage 1.08 sur les titres, 1.6 sur le corps. *(Les bornes hautes ont été redescendues après essai : à 1280 px, un titre de 88 px débordait sur trois lignes dans une colonne de 640 px.)*
- **Espacement** — grille de 4 px, échelle 4/8/12/16/24/32/48/64/96/128/180.
- **Rayons** — 8 / 12 / 20 / 999. Un seul rayon par famille de composant.
- **Élévation** — pas d'ombre portée classique : bordure 1 px + halo coloré très diffus, deux niveaux maximum.
- **Mouvement** — 160 ms (hover), 240 ms (apparition), 400 ms (transition de page). Courbe unique `cubic-bezier(.16,1,.3,1)`. Tout désactivable par `prefers-reduced-motion`.
- **Effets néon** — quatre effets, pas un de plus : halo de bordure et lueur interne qui suivent le curseur sur les cartes (`.glow-card`, teinte réglable par carte) ; balayage de lumière sur les boutons pleins (`.sheen`) ; filet dégradé en séparateur de section (`.hairline`) ; grain fixe à 3 % sur toute la page. La règle reste la même : le halo se voit quand on interagit, pas en permanence.

Composants — **construits** : header + nav mobile plein écran, bouton (3 variantes), carte service, carte modèle, filtre, accordéon FAQ, étape numérotée, stat, logo technologie, champ de formulaire (5 types), stepper du configurateur, bloc binôme, bandeau CTA, footer, cadres d'appareil (navigateur + téléphone), séparateur lumineux.
**Restent à faire** : bloc témoignage (en attente de vrais témoignages), fil d'Ariane, toast de confirmation, skeleton de chargement.

---

## 6. Responsive et accessibilité

- Points de rupture : **360 / 640 / 768 / 1024 / 1280 / 1536 / 1920**. Tests réels à 360 px (l'iPhone SE reste une réalité) et à 1920 px (ne pas laisser le contenu s'étirer : conteneur max 1320 px).
- **Art direction du hero** : le visuel desktop panoramique ne fonctionnera pas en portrait — il faut un recadrage vertical dédié, pas un `object-fit` qui coupe l'essentiel.
- Tableaux et comparatifs → cartes empilées sous 768 px.
- Cibles tactiles ≥ 44 px, navigation clavier complète, focus visible (et pas un `outline: none`), `aria-current` sur la nav, formulaire avec `label` réels et messages d'erreur liés.
- Objectif : **WCAG 2.1 AA**, vérifié avec axe + un passage clavier complet sur chaque gabarit.

---

## 7. Performance et SEO technique

- Budgets : **LCP < 2,0 s**, CLS < 0,05, INP < 200 ms, poids de page < 1,2 Mo, JS initial < 150 Ko gzip.
- Images : AVIF + WebP, `next/image`, dimensions explicites, LQIP, `priority` sur le seul visuel du hero.
- Polices : auto-hébergées en woff2, sous-ensemble latin, `font-display: swap`, préchargement du display uniquement.
- Balisage structuré : `ProfessionalService` (+ adresse, zone desservie), `Service` par page service, `Product` + `Offer` sur les fiches modèle (prix affiché → éligible aux résultats enrichis), `FAQPage`, `BreadcrumbList`.
- `sitemap.xml` (les deux langues), `robots.txt`, canoniques, OG/Twitter par page, titres et méta rédigés **un par un** (pas de génération automatique).
- **Bilingue** : `hreflang` réciproques FR/EN + `x-default`, slugs traduits, sélecteur de langue qui renvoie vers la page équivalente (jamais vers l'accueil — c'est l'erreur classique), `lang` correct sur `<html>`.
- Analytics sans cookie (Plausible ou Umami auto-hébergé) — conséquence directe : **pas de bandeau cookies**, ce qui est un vrai gain d'expérience.
- Protection du formulaire : Cloudflare Turnstile (pas de reCAPTCHA) + honeypot + limitation de débit côté serveur.

---

## 8. Stack proposée

```
Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind v4 · Framer Motion
Contenu       : MDX par langue — content/{fr,en}/… (services, modèles, FAQ)
i18n          : natif Next 16 — segment [lang], next/root-params, dictionnaires
                JSON, slugs traduits, hreflang. Pas de next-intl : inutile ici,
                et zéro JS client pour les traductions.
Redirection   : src/proxy.ts (le middleware a été renommé « proxy » en Next 16)
Formulaires   : route API + Zod + Resend (mail) + Turnstile
Stockage lead : table Postgres (Supabase) ou simple envoi mail en V1
Hébergement   : Vercel (UE) + domaine chez un registrar FR
Qualité       : ESLint, Prettier, Lighthouse CI, Playwright sur le parcours contact
```

Deux points d'attention propres à ce projet :

- **Les démos en direct sont hébergées à part** (sous-domaines `demo-<nom>.cm-agency.fr`) et doivent rester en ligne et à jour : une démo cassée sur une fiche produit, c'est une vente perdue et un doute sur votre sérieux. Prévoir une surveillance de disponibilité.
- **Le score Lighthouse affiché sur chaque fiche modèle** doit être mesuré automatiquement, pas saisi à la main : sinon il devient faux en trois mois, et on retombe dans les chiffres invérifiables qu'on a chassés du site.

---

## 9. Conformité légale

Obligatoire, souvent oublié, et facilement contrôlé :

- **Mentions légales** : identité, statut, SIREN, adresse, directeur de publication, hébergeur (nom + adresse).
- **Politique de confidentialité** : finalité du formulaire, base légale, durée de conservation des leads, destinataires, droits RGPD, contact.
- **CGV / conditions de prestation** : particulièrement important si vous facturez de la maintenance récurrente.
- Le formulaire doit indiquer la finalité au point de collecte et ne demander que le nécessaire.
- Données hébergées dans l'UE.

---

## 10. Lotissement

| Lot | Contenu | Estimation | État |
|---|---|---|---|
| **0 — Cadrage** | Logo C&M Agency, domaine, inventaire des modèles déployés, collecte des assets | 3–4 j | ⏳ décisions prises, assets et domaine manquants |
| **1 — Design system** | Tokens, typographie, composants, maquettes Accueil + 1 service + 1 fiche modèle (desktop + mobile) | 5–7 j | ✅ fait, sauf le motif `&` (§5) |
| **2 — Socle technique** | Projet, layout, header/footer, animations, **i18n et routage bilingue**, SEO technique, CI | 5–6 j | ✅ fait, sauf la CI |
| **3 — Pages** | Accueil, Services + 6 services, Agence, Méthode | 6–8 j | ✅ structure faite, contenu à réécrire (§12) |
| **4 — Offre modèles** | `/modeles`, fiches produit, démos en ligne, mesure Lighthouse automatisée, prix | 5–6 j | ⏳ pages faites ; démos, prix réels et mesure auto manquants |
| **5 — Conversion** | Tarifs, FAQ, configurateur, mails bilingues, anti-spam | 4–5 j | ⏳ configurateur fait ; envoi, mails et anti-spam à brancher |
| **6 — Traduction EN** | Intégration des contenus anglais, hreflang, slugs, recette bilingue | 3–4 j | ⏳ intégré ; relecture anglophone à faire |
| **7 — Légal & recette** | Pages légales, accessibilité, performance, tests, 404, mise en ligne | 3–4 j | ⏳ gabarits faits ; SIREN, audit axe et Lighthouse à faire |
| **Total V1** | | **≈ 34 à 44 jours** | ~60 % |

Hors production de contenu (rédaction FR + EN, photos, captures des modèles) qui est le vrai chemin critique : **c'est le lot 0 qui fait glisser un projet comme celui-ci**, pas le développement. Avec le bilingue, la rédaction représente désormais plus de charge que le développement de plusieurs lots réunis — commencez-la en parallèle du lot 1, pas après.

**Phase 2** (après mise en ligne) : page Réalisations à la première référence client, blog/ressources, pages locales SEO, CMS si Manon doit publier seule, espace client de suivi réel.

---

## 11. Critères de recette

Le site est livrable quand, sur **chaque** gabarit :

- [ ] Lighthouse ≥ 95 en Performance, Accessibilité, Bonnes pratiques, SEO (mobile, 4G simulée)
- [ ] Aucune erreur axe-core
- [ ] Parcours complet au clavier, focus visible partout
- [ ] Rendu vérifié à 360, 768, 1024, 1440, 1920 px
- [ ] Aucun texte sous 4.5:1 de contraste
- [ ] `prefers-reduced-motion` neutralise toutes les animations
- [ ] Titre + méta + OG rédigés spécifiquement
- [ ] Le formulaire arrive bien chez Manon, avec accusé de réception au prospect, dans la langue du visiteur
- [ ] Aucune donnée inventée n'est affichée
- [ ] Aucune phrase ne pourrait être copiée telle quelle chez un concurrent (§12.4)
- [ ] `hreflang` réciproques valides, sélecteur de langue qui mène à la page équivalente
- [ ] Version anglaise relue par un anglophone
- [ ] Chaque démo en direct répond, dans sa dernière version, sur un sous-domaine surveillé

---

**Suite** : la liste détaillée des assets à produire est dans [ASSETS.md](ASSETS.md).

---

## 12. Authenticité du contenu — le chantier bloquant

Le contenu actuel est **écrit par une IA et ça se voit**. Il est cohérent, grammaticalement irréprochable, et parfaitement interchangeable avec celui de n'importe quelle autre agence. C'est le problème le plus sérieux du site : toute la stratégie repose sur « vous parlez à de vraies personnes », et les textes disent exactement le contraire de ce qu'ils affirment.

### 12.1 Les tells, précisément

| Symptôme | Exemple dans le site | Pourquoi ça sonne faux |
|---|---|---|
| **L'antithèse en boucle** | « Ce n'est pas X, c'est Y », « Nous avons construit l'inverse », « le problème n'est plus l'organisation, c'est l'outil » | La figure revient dans presque chaque section. Un humain ne parle pas en chiasmes toutes les trois phrases. |
| **Le rythme ternaire systématique** | « Sites web, e-commerce, applications mobiles », « proximité, transparence, qualité » | Trois éléments, toujours trois, toujours équilibrés. |
| **La chute élégante** | Chaque paragraphe se termine sur une formule qui claque | Personne n'écrit 40 paragraphes qui finissent tous bien. |
| **Zéro spécificité** | Aucune ville, aucune date, aucun nom, aucun prix vécu, aucun secteur qu'on connaît mieux qu'un autre | Le texte pourrait être copié-collé chez un concurrent sans changer un mot. |
| **Des chiffres inventés** | « 48 h de délai de réponse », « 100 % code qui vous appartient » | Placeholders que j'ai posés. Ils ne viennent pas de vous. |
| **Des exemples fabriqués** | « Refonte — Dupont Immobilier », Horizon Travel, FitZone, SoundWave, GreenEnergy | Les quatre modèles et leurs secteurs sont **mon invention**, repris de la maquette Nexora. Rien ne dit qu'ils correspondent à ce que vous savez ou voulez vendre. |
| **Une voix neutre** | Aucune familiarité, aucun humour, aucune irritation, aucun parti pris tranché | Vous avez forcément des avis sur ce métier. Ils n'apparaissent nulle part. |

### 12.2 Ce qui rendrait le texte authentique

Trois leviers, par ordre d'impact :

1. **L'ancrage.** Une ville, une région, un tissu économique. « Basé en France, disponible partout » ne veut rien dire. « On travaille surtout avec des artisans et des commerçants de l'arrière-pays niçois » en dit dix fois plus et attire exactement les bons clients.
2. **Le vécu.** Une vraie histoire de départ, un vrai devis concurrent qui vous a choqués, un vrai client qui a appelé un dimanche, une vraie erreur que vous avez faite. Une anecdote précise vaut mieux que trois paragraphes de valeurs.
3. **La voix.** Ce qui vous agace dans ce métier. C'est là que naît un ton reconnaissable — et « Le digital sans intermédiaire » vient forcément d'une frustration concrète qu'il faut raconter.

### 12.3 Matière première à fournir

Réponses courtes suffisantes — je m'occupe de la mise en forme. Ce ne sont pas des questions de style, ce sont des faits que je ne peux pas inventer :

**L'agence**
- Où êtes-vous basés (ville) ? Travaillez-vous surtout en local ou à distance ?
- Depuis quand C&M Agency existe ? Est-ce votre activité principale ou en parallèle d'autre chose ?
- Statut juridique et SIREN.

**Vous deux**
- Comment vous êtes-vous rencontrés, et pourquoi monter ça ensemble ?
- Christopher : combien d'années de dev, sur quoi, chez qui ? Ce que vous faisiez avant.
- Manon : quel parcours commercial, dans quel secteur ?
- Un truc vrai et non professionnel sur chacun (ça humanise une page équipe plus que n'importe quel paragraphe sur les valeurs).

**Le déclic**
- Quelle situation précise vous a fait dire « on fait mieux que ça » ? Un devis délirant vu chez un client, une agence qui a disparu en cours de projet, un site livré catastrophique ?
- Qu'est-ce qui vous agace le plus dans les agences web aujourd'hui ?

**Les modèles**
- Les quatre secteurs actuels (voyage, fitness, audio, énergie) sont mon invention. Quels secteurs connaissez-vous réellement, ou lesquels visez-vous ?
- Vos projets déployés : qu'est-ce que c'est exactement, et pourquoi les avoir construits ?
- Les vrais prix, et ce qu'ils couvrent.

**Les engagements**
- Sous combien de temps répondez-vous vraiment ?
- Délais réels sur un site vitrine déjà livré ?
- Y a-t-il des projets que vous refusez ? Lesquels ?

**Le ton**
- Vouvoiement ou tutoiement ?
- Plutôt sobre et rassurant, ou direct et cash ?

### 12.4 Règle à tenir pour la réécriture

Aucune phrase du site ne doit pouvoir être copiée telle quelle sur le site d'un concurrent sans devenir fausse. Si elle le peut, elle ne sert à rien — on la supprime ou on la remplace par un fait.
