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
