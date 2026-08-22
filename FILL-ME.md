# À remplir

Tout ce qui suit est du contenu provisoire. Le site fonctionne sans, mais il
ne sera pas publiable tel quel. En développement, la console du navigateur
liste automatiquement ce qui reste (voir `components/ContentCheck.tsx`).

## 1. Identité — `content/config.ts`
- [ ] `identity.email` — remplace `hello@nicolas.example`
- [ ] `identity.linkedin` — l'URL exacte de ton profil
- [ ] `identity.github` — vérifie le pseudo
- [ ] `identity.siteUrl` — le domaine final (sert aux métadonnées et à l'aperçu OG)
- [ ] `identity.logo` — "N.JGU" par défaut, change-le si tu veux autre chose
- [ ] `aviation.airfield` / `aircraft` / `goal` — tes vraies infos

## 2. Formulaire de contact — `.env.local`
- [ ] `NEXT_PUBLIC_CONTACT_ENDPOINT` — Formspree, Web3Forms, ou un webhook n8n chez toi
- [ ] `NEXT_PUBLIC_SITE_URL` — même valeur que `identity.siteUrl`

Sans endpoint, le formulaire affiche un message d'erreur explicite au lieu
d'échouer en silence.

## 3. Projets — `content/projects.ts`
- [ ] Les `result` marqués « à confirmer » ou « à compléter » : ce sont des
      chiffres plausibles que j'ai inventés, à remplacer par les vrais ou à
      reformuler sans chiffre
- [ ] Les `links` vides : dépôt GitHub, démo, article, post LinkedIn
- [ ] Optionnel : un visuel par projet dans `public/projects/<slug>.webp`,
      puis renseigner le champ `cover`

## 4. Visuels
- [x] Favicon (`app/icon.svg`) et icône iOS (`app/apple-icon.svg`)
- [x] Image de partage (`public/og.png`, 1200×630) — regénérable, voir README
- [ ] Optionnel : une photo de toi pour la section À propos

## 5. Textes
Le contenu FR et EN est dans `content/site.ts`. Les deux dictionnaires ont
exactement la même structure : si tu ajoutes une clé d'un côté, TypeScript
te forcera à l'ajouter de l'autre.
