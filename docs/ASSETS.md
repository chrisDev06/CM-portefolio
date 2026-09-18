# Assets à fournir — C&M Agency

> Complément de [PLAN.md](PLAN.md). C'est la liste exhaustive de ce qu'il faut produire ou récupérer **avant** le développement.
> Mis à jour après les décisions du 17/09/2026 : marque **C&M Agency**, offre « Sites prêts à lancer », photos auto-produites, site **bilingue FR/EN**.
> Priorités : **P1** = bloquant pour la mise en ligne · **P2** = attendu à la mise en ligne · **P3** = phase 2.
> Colonne « Par qui » : **M** = Manon · **C** = Christopher · **Ext** = prestataire externe (photographe, graphiste).

---

## 1. Identité de marque — P1

| Asset | Format / specs | Qté | Par qui |
|---|---|---|---|
| Logo principal **C&M Agency** | SVG vectoriel (tracés, pas d'image incorporée), viewBox propre | 1 | Ext |
| Déclinaisons | horizontal, monogramme carré, monochrome blanc, monochrome noir | 4 | Ext |
| Le `&` isolé | SVG en tracés, destiné à être affiché en très grand (filigrane, séparateurs) — doit rester net à 800 px de haut | 1 | Ext |
| Zone de protection + taille minimale | Documentées (1 page PDF) | 1 | Ext |
| Favicon | `favicon.svg` + `favicon.ico` 32px | 2 | C |
| Icônes d'app | `apple-touch-icon` 180×180, `icon-192`, `icon-512`, `icon-512-maskable` | 4 | C |
| `site.webmanifest` | nom, couleur de thème `#08080C` | 1 | C |
| Image OG par défaut | 1200×630 PNG, < 300 Ko, **une version FR et une EN** | 2 | Ext |
| Gabarit OG | Fichier source (Figma) pour décliner par page et par fiche modèle | 1 | Ext |
| Tokens de couleur | 1 fichier `tokens.css` ou JSON, source unique de vérité | 1 | C |

**À éviter** : un logo livré uniquement en PNG. Sur un fond sombre avec halo, un PNG mal détouré se voit immédiatement et ruine l'effet premium.

---

## 2. Typographie — P1

Deux familles maximum. Le luxe vient d'ici avant de venir des images.

| Rôle | Recommandation gratuite (usage commercial) | Alternative payante |
|---|---|---|
| Display (titres) | **Clash Display** ou **General Sans** (Fontshare) | PP Neue Montreal, Aeonik, Söhne Breit |
| Texte | **Satoshi** (Fontshare) ou **Inter** | Söhne, Suisse Int'l |

Livrables :

- Fichiers **woff2 uniquement**, auto-hébergés dans `/public/fonts` (jamais de Google Fonts en CDN : c'est un aller-retour réseau et un sujet RGPD).
- Poids strictement limités à **400 / 500 / 700** (+ le display en 600 si nécessaire). Chaque poids supplémentaire = ~25 Ko sur le chemin critique.
- Sous-ensemble **latin + latin-ext** (les accents français), pas la fonte complète.
- La **licence web archivée** dans `/docs/licences.md` avec la date d'acquisition. Point non négociable : une police sans licence web sur un site commercial est une facture qui arrive trois ans plus tard.

---

## 3. Visuels d'ambiance et hero — P1

| Asset | Specs | Qté | Par qui |
|---|---|---|---|
| Visuel hero desktop | 2560×1440, AVIF **< 250 Ko** + WebP de repli | 1 | ✅ **fourni** — mais en 1672 × 941 seulement (181 Ko en AVIF). Net jusqu'à 1670 px de large, agrandi au-delà. À régénérer en 2560 px minimum. |
| Visuel hero mobile | Recadrage **vertical dédié** 1080×1350 | 1 | ⏳ contourné par `object-position: 38%` sur la partie sombre de l'image. Un vrai recadrage n'apporterait rien tant que la source ne fait que 941 px de haut : c'est la hauteur qui limite, pas le cadrage. |
| LQIP du hero | Base64 ~24 px, intégré au HTML | 1 | ✅ généré automatiquement par `npm run hero` |
| Visuels de section | 1920×1080, pour Services, Méthode, Équipe, Tarifs, FAQ | 5 | Ext |
| Texture de grain | PNG tuilable 256×256, < 10 Ko, appliqué en `background-repeat` | 1 | Ext |
| Halo / dégradé de fond | SVG ou WebP 1600×1600, un seul réutilisé partout | 2 | Ext |
| Grille / blueprint décoratif | SVG, opacité ≤ 6 % | 1 | Ext |

**Le point le plus important de tout ce document** : dans les maquettes actuelles, l'écran du MacBook affiche un site fictif. Le hero doit afficher **la capture réelle d'un de vos modèles déployés**, avec un lien vers sa démo en direct. Vous avez des sites en ligne — c'est précisément ce que vos concurrents n'ont pas. Une image de synthèse à la place, c'est jeter votre seul avantage.

Sources acceptables pour les mockups d'appareils : Rotato, Shots.so, Angle, Mockuuups (vérifier la licence commerciale de chacun). Les images générées par IA sont acceptables pour l'**ambiance** (roches, lumière, décor) — jamais pour un visage, un logo client ou une capture de projet.

---

## 4. Modèles « Sites prêts à lancer » — le cœur du site — P1

C'est votre catalogue et votre preuve à la fois. **Minimum 4 modèles au lancement, 6 à 8 visés**, sur des secteurs distincts (restauration, immobilier, artisanat, santé, coaching, e-commerce…) : le visiteur doit pouvoir se reconnaître dans au moins un.

> **État actuel** : `public/models/<id>/` contient des **maquettes d'interface générées** (`npm run mockups`), une par secteur, avec palette et mise en page distinctes. Elles tiennent la mise en page et la direction artistique, mais ce ne sont pas des captures. Le tableau ci-dessous décrit ce qui doit les remplacer.

**Par modèle** :

| Asset | Specs |
|---|---|
| **Démo en ligne** | Sous-domaine dédié, en ligne en permanence, contenu de démonstration cohérent (pas de « Lorem ipsum », pas de « Votre titre ici ») |
| Visuel de couverture | 1600×1000, AVIF, < 180 Ko — vignette de la grille |
| Capture desktop réelle | 1440×900, prise sur la démo en ligne |
| Capture mobile réelle | 390×844 |
| Captures de fonctionnalités | 3 à 6 écrans significatifs (réservation, tunnel de commande, galerie, formulaire métier…) |
| Vidéo de parcours | 10–20 s, WebM VP9 muet en boucle, **< 2 Mo**, + image poster |
| Rapport Lighthouse | Généré automatiquement sur la démo, pas saisi à la main |

**Métadonnées par modèle** (texte, c'est un asset aussi, et en FR **et** EN) :

```
Nom · Secteur visé · Type · Intention de direction artistique
À qui il s'adresse · Le problème qu'il résout
Fonctionnalités incluses · Ce qui est personnalisable · Ce qui ne l'est pas
Choix techniques et pourquoi · Stack
Prix · Délai de mise en ligne · Ce qui est inclus (nom de domaine ? hébergement ? formation ?)
```

Sans ces textes, la fiche n'existe pas — c'est une jolie capture, exactement ce que vous vouliez éviter.

**Trois pièges sur une offre de modèles** :

1. **Le contenu de démonstration fait 80 % de l'effet.** Un modèle « restaurant » avec de vraies photos de plats, une vraie carte, de vrais horaires se vend ; le même avec des blocs gris ne se vend pas. Prévoyez du contenu fictif mais crédible, et des photos correctement licenciées (Unsplash/Pexels acceptés ici, licences documentées).
2. **Un prix affiché engage.** Décidez ce qu'il couvre exactement avant de le publier — personnalisation incluse ou non, nombre d'allers-retours, domaine et hébergement, formation à la prise en main.
3. **Une démo cassée ou obsolète coûte une vente.** Elles doivent être surveillées et maintenues comme de la production.

---

## 5. Photos du binôme — P1 — protocole de prise de vue

Vous les faites vous-mêmes : c'est tout à fait faisable, à condition de traiter ça comme une séance, pas comme deux selfies. **Les deux portraits doivent être pris le même jour, au même endroit, avec les mêmes réglages.** C'est la seule chose qui compte vraiment : deux photos irréprochables mais dissemblables donneront un résultat pire que deux photos moyennes mais jumelles.

**Matériel** — un téléphone récent en mode portrait suffit. Un reflex/hybride est mieux si vous en avez un (ouverture f/2.8–f/4, focale équivalente 50–85 mm : en dessous de 35 mm, le visage se déforme).

**Lumière** — la plus simple qui fonctionne : placez-vous **à 1 m d'une grande fenêtre, de trois quarts**, un jour couvert, lumière venant du côté. Pas de soleil direct, pas de plafonnier allumé (il mélange deux températures de couleur et c'est irrattrapable), pas de flash.

**Fond** — un mur sombre et uni, à **2 m minimum derrière vous** (le recul crée le flou d'arrière-plan et évite l'ombre portée sur le mur). Idéalement gris anthracite ou noir mat.

**Cadrage** — buste, yeux au tiers supérieur, un peu d'air au-dessus de la tête, **format vertical**, et une série en horizontal. Prenez au moins 30 photos chacun : le taux de déchet est normal et élevé.

**Réglages à ne pas changer entre les deux personnes** — même position, même distance, même hauteur d'appareil (à hauteur d'yeux), même mode, même balance des blancs manuelle si disponible.

**Tenue** — registre commun, sombre de préférence, uni. Pas de motifs fins (ils moirent), pas de logos.

**Livraison** — les fichiers **bruts, non retouchés, non filtrés** (JPEG qualité maximale ou RAW), pas d'export Instagram. Je fais le détourage, l'harmonisation colorimétrique et les recadrages.

| Livrable final (produit par moi) | Specs |
|---|---|
| Portrait 1:1 | 1200×1200 |
| Portrait 4:5 | 1200×1500 |
| Détourage | PNG à fond transparent pour le bloc « votre binôme » |
| Traitement | Une seule colorimétrie appliquée aux deux (léger duotone violet/neutre) |
| Optionnel P2 | 3–5 photos d'ambiance de travail, mêmes réglages |

**À supprimer impérativement** : les quatre visages générés de la maquette « Nexora ». Un visage IA sur une page « qui sommes-nous » est identifiable en quelques secondes et détruit la confiance que tout le reste du site cherche à construire.

---

## 6. Icônes et logos technos — P1

- **Une seule famille d'icônes**, jamais de mélange. Recommandation : **Lucide** (trait 1.5, grille 24 px) ou **Phosphor** en variante duotone. Intégrées en SVG inline, pas en police d'icônes.
- Inventaire à figer (~30) : écran, panier, mobile, engrenage, fusée, bouclier, éclair, loupe, palette, code, base de données, nuage, verrou, horloge, calendrier, message, téléphone, mail, flèches (4 directions), coche, croix, plus, moins, chevron, téléchargement, lien externe, étoile, utilisateur, utilisateurs.
- **8 logos de technologies** en SVG officiel, version monochrome : React, Next.js, React Native, TypeScript, Node.js, Laravel, Tailwind, PostgreSQL. Respecter les chartes de marque de chaque projet (certaines interdisent la recoloration).
- Drapeau France du bandeau : SVG, pas emoji (rendu incohérent entre Windows et macOS).

---

## 7. Animation — P2

| Asset | Specs |
|---|---|
| Lottie chargement | < 40 Ko JSON |
| Lottie succès formulaire | < 40 Ko JSON |
| Spécifications micro-interactions | Document, pas un fichier : durées, courbes, états hover/focus/actif/désactivé de chaque composant |
| Vidéo de démonstration du hero | Optionnelle, WebM < 3 Mo, muette, en boucle, poster obligatoire |

Règle : si une animation n'aide pas à comprendre, elle est supprimée. Et toutes sont neutralisées par `prefers-reduced-motion`.

---

## 8. Contenus rédactionnels — P1

Les textes sont des assets, et c'est **le chemin critique du projet** — d'autant plus qu'ils sont désormais à produire en deux langues.

| Contenu | Volume (FR) | Par qui |
|---|---|---|
| Accueil | ~600 mots | M |
| Services (vue d'ensemble) | ~400 mots | M |
| 6 pages service | ~900 mots chacune, structure imposée par le plan | M + C (technique) |
| Page « Sites prêts à lancer » | ~500 mots | M |
| 4 à 8 fiches modèle | ~600 mots chacune | C |
| Agence | ~500 mots + 2 bios | M |
| Méthode + suivi | ~800 mots | M |
| Tarifs | ~600 mots + fourchettes assumées | M |
| FAQ | ~25 questions/réponses réparties en 5 catégories | M + C |
| Titres, métadescriptions, textes alternatifs | 1 jeu par page et par langue, rédigés à la main | M |
| Mentions légales, confidentialité, CGV | Conformes, avec SIREN et hébergeur | M |
| Témoignages | 3 réels, signés nom + entreprise + **accord écrit**, ou aucun | M |

**Version anglaise** — environ 7 000 mots au total. Trois règles :

- Traduction **adaptée, pas littérale** : « site vitrine » ne se traduit pas par *showcase site* mais par *business website*. Une traduction mot à mot se repère immédiatement.
- **Relecture par un anglophone obligatoire** (~200–400 €). Un anglais approximatif sur un site d'agence coûte plus cher en crédibilité que l'absence de version anglaise.
- **Slugs traduits** (`/en/ready-to-launch`, pas `/en/modeles`) et mails de confirmation bilingues.

---

## 9. Contraintes de livraison

**Nommage** : `kebab-case`, sans accent, sans espace, sans majuscule.
`horizon-travel-desktop.avif`, pas `Horizon Travel – Capture 1.PNG`.

**Arborescence** :

```
public/
  fonts/
  icons/
  images/
    brand/
    hero/
    textures/
    team/
    tech/
  models/<slug>/
    cover.avif  desktop.avif  mobile.avif  feature-01.avif  demo.webm
  og/{fr,en}/
content/
  fr/…  en/…
docs/licences.md
```

**Budgets de poids** (à vérifier à la recette, pas après) :

| Élément | Plafond |
|---|---|
| Image LCP (hero) | 250 Ko |
| Toute autre image | 180 Ko |
| Vidéo en boucle | 2 Mo |
| Total d'une page | 1,2 Mo |
| Polices cumulées | 120 Ko |

**Fichiers sources à conserver** : tous les Figma / PSD / projets Rotato, dans un dossier partagé. Un site refait de zéro dans deux ans sans les sources coûte trois fois le prix.

**Licences** : chaque asset externe consigné dans `docs/licences.md` — source, licence, date, usage autorisé.

---

## 10. Interdits

- Visages générés par IA sur une page « qui sommes-nous ».
- Logo, témoignage ou nom de client sans autorisation écrite.
- Images de banque avec filigrane, même « provisoirement ».
- Polices sans licence d'usage web.
- Chiffres non vérifiables (« +150 projets », « 98 % de satisfaction »).
- Captures d'écran de projets qui ne sont pas les vôtres.
- PNG pour un logo, JPEG pour une capture d'interface.

---

## 11. Suivi de collecte

| Lot | Priorité | Statut | Échéance |
|---|---|---|---|
| Identité C&M Agency (logo + `&`) | P1 | ☐ | |
| Nom de domaine + mail pro + statut juridique/SIREN | P1 | ☐ | |
| Polices + licences | P1 | ☐ | |
| Hero + visuels d'ambiance | P1 | ☐ | |
| **4 modèles : démos en ligne + captures + prix + textes** | P1 | ☐ | |
| Contenu de démonstration crédible dans chaque modèle | P1 | ☐ | |
| Photos du binôme (protocole §5) | P1 | ☐ | |
| Icônes + logos technos | P1 | ☐ | |
| Textes des 6 pages service (FR) | P1 | ☐ | |
| Pages légales | P1 | ☐ | |
| **Traduction EN de l'ensemble + relecture anglophone** | P1 | ☐ | |
| FAQ (25 Q/R) | P2 | ☐ | |
| Modèles 5 à 8 | P2 | ☐ | |
| Lottie + vidéos | P2 | ☐ | |
| Témoignages (dès les premiers clients) | P2 | ☐ | |
| Photos d'ambiance, articles de blog | P3 | ☐ | |

Tant que la ligne « 4 modèles » n'est pas cochée, le développement peut avancer mais le site ne peut pas être mis en ligne : c'est la seule preuve commerciale du site, et son unique offre concrète au lancement.
