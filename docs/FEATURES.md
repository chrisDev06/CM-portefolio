# Fonctionnalités à faire

Idées validées, pas encore développées. Une ligne par fonctionnalité, avec ce
qui la bloque.

## Formulaire de contact

- [ ] **Accusé de réception au prospect.** Un email de confirmation envoyé
  au visiteur après sa demande (récapitulatif, délai de réponse, prénom de
  Manon), dans sa langue.
  *Bloqué par :* le domaine. Sans domaine vérifié, Resend n'envoie qu'à
  l'adresse du compte (voir `docs/SETUP-CONTACT.md` §1).
  *Où :* `src/app/[lang]/contact/actions.ts`, après l'envoi du mail à
  l'agence ; textes dans `messages/{fr,en}/pages.json`.
- [ ] **Limitation de débit** côté serveur (quelques envois par IP et par
  heure). Demande un stockage partagé entre les fonctions Vercel
  (Upstash Redis, offre gratuite).
- [ ] **Signer les demandes envoyées au back-office.** Aujourd'hui, un e-mail
  forgé avec l'en-tête `X-CM-Lead` et un `lead.json` valide, envoyé à la
  boîte de l'agence, crée une fiche dans le BO (au pire une fausse fiche,
  rien n'est envoyé). Correctif : une clé partagée (`LEAD_SIGNING_KEY`)
  pour signer `lead.json` en HMAC côté site et vérifier la signature côté BO
  (`src/messaging/website-lead.ts`).
