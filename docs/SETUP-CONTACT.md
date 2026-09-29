# Formulaire de contact — ce qu'il reste à faire, outil par outil

Le code est en place : le formulaire envoie un email à l'agence, et le
back-office (BO-C-M-Agency) le récupère en IMAP pour créer le prospect et une
notification. Il ne manque que les comptes et les clés, qui sont à toi.

Circuit : visiteur → site (Vercel) → **Resend** → boîte **Gmail**
`helloocm.agency@gmail.com` → **back-office** (IMAP, chaque minute).

---

## 1. Resend — envoi du mail · gratuit (3 000 mails/mois, 100/jour)

- [ ] Créer un compte sur resend.com **avec l'adresse `helloocm.agency@gmail.com`**.
      Sans domaine vérifié, Resend n'envoie qu'à l'adresse du compte : c'est
      pour ça qu'elle doit être la même que celle qui reçoit les demandes.
- [ ] *API Keys* → *Create API Key* → permission **Sending access** → copier
      la clé (`re_…`, affichée une seule fois).
- [ ] La coller dans Vercel (étape 3) sous `RESEND_API_KEY`.

**Le mois prochain, avec le domaine :**
- [ ] *Domains* → *Add domain* → ajouter chez le registrar les enregistrements
      DNS affichés (SPF, DKIM, éventuellement MX de retour).
- [ ] Une fois le domaine vérifié, changer `CONTACT_FROM` dans Vercel en
      `C&M Agency <contact@ton-domaine.fr>`.
- [ ] Mettre à jour `NEXT_PUBLIC_SITE_URL` avec le domaine.

## 2. Cloudflare Turnstile — anti-robot · gratuit

- [ ] Créer un compte sur dash.cloudflare.com (pas besoin d'y mettre de domaine).
- [ ] *Turnstile* → *Add widget* : nom « Site C&M », mode **Managed**,
      hostnames : `localhost` + l'URL Vercel (`xxx.vercel.app`), et plus
      tard le domaine.
- [ ] Copier la **Site Key** → Vercel `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
- [ ] Copier la **Secret Key** → Vercel `TURNSTILE_SECRET_KEY`.
- [ ] Quand le domaine arrive : l'ajouter aux hostnames du widget.

Tant que ces deux clés sont vides, Turnstile est simplement désactivé (le
honeypot et la validation serveur restent actifs).

## 3. Vercel — hébergement

*Project → Settings → Environment Variables*, pour **Production** et **Preview** :

| Variable | Valeur |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://<projet>.vercel.app` (puis le domaine) |
| `RESEND_API_KEY` | clé Resend (étape 1) |
| `CONTACT_TO` | `helloocm.agency@gmail.com` |
| `CONTACT_FROM` | `C&M Agency <onboarding@resend.dev>` (jusqu'au domaine) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site Key Turnstile (étape 2) |
| `TURNSTILE_SECRET_KEY` | Secret Key Turnstile (étape 2) |
| `LEAD_SIGNING_KEY` | clé affichée par le back-office (étape 5) |

- [ ] Ajouter les variables ci-dessus.
- [ ] *Deployments* → dernier déploiement → *Redeploy* (les variables
      `NEXT_PUBLIC_*` ne sont prises en compte qu'au build).
- [ ] Tester : remplir le formulaire sur l'URL Vercel, vérifier la réception.

En local : copier `.env.example` en `.env.local` et le remplir. Sans clé
Resend, le mail est affiché dans le terminal au lieu d'être envoyé.

## 4. Gmail — boîte `helloocm.agency@gmail.com`

- [ ] Activer la **validation en deux étapes** sur le compte Google.
- [ ] Créer un **mot de passe d'application** (myaccount.google.com →
      Sécurité → Mots de passe des applications) : c'est lui que le
      back-office utilise pour l'IMAP, jamais le vrai mot de passe.
- [ ] Vérifier que l'IMAP est actif (Gmail → Paramètres → Transfert et
      POP/IMAP).
- [ ] Créer un filtre : *De* `onboarding@resend.dev` → **Ne jamais envoyer
      dans le spam** (le back-office ne lit que la boîte de réception).
      À refaire avec la nouvelle adresse d'expédition une fois le domaine en place.

## 5. Back-office (BO-C-M-Agency)

- [ ] Récupérer la dernière version (commit « Demandes du site vitrine ») et
      **redémarrer** le BO : la migration `019_notifications` s'applique au
      démarrage.
- [ ] *Réglages → Réception des réponses* : activer la relève,
      `imap.gmail.com`, port 993, SSL, identifiant
      `helloocm.agency@gmail.com`, mot de passe d'application (étape 4),
      puis *Tester*.
- [ ] Page **Demandes** → *Connexion au site* → *Copier* la clé, la coller
      dans Vercel sous `LEAD_SIGNING_KEY`, puis *Redeploy*. Le BO n'enregistre
      que les demandes signées avec cette clé : un e-mail forgé ne crée rien.
- [ ] Envoyer une demande de test depuis le site : sous une minute, elle
      apparaît dans le menu **Demandes** (badge), avec la fiche du prospect
      (statut « Réponse »), une tâche P1 « Répondre » dans *Aujourd'hui*
      et l'e-mail d'origine (.eml) dans *Notes & fichiers*.
- [ ] Sur la page *Demandes*, cliquer *Activer les alertes du navigateur*
      (une fois par poste).

Si le BO est éteint, les demandes attendent dans Gmail et sont traitées au
redémarrage. Seule exception : à la toute première relève d'une boîte, seuls
les 30 derniers jours sont examinés. Le BO lit « Tous les messages » de Gmail,
qui exclut le spam : d'où le filtre de l'étape 4.

## 6. Juridique

- [x] Politique de confidentialité : Resend et Cloudflare ajoutés comme
      sous-traitants.
- [ ] Vérifier les coordonnées de Vercel, Resend et Cloudflare dans leurs
      pages légales avant la mise en ligne.
