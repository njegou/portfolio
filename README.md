# Portfolio Nicolas

Next.js 15 (App Router) + TypeScript + Tailwind v4, GSAP/ScrollTrigger, Lenis, Framer Motion, Three.js. Export statique.

## Lancer
```bash
npm install
cp .env.example .env.local   # renseigner NEXT_PUBLIC_CONTACT_ENDPOINT
npm run dev
```

## Déployer sur IONOS
```bash
npm run build      # génère /out
```
Envoyer le contenu de `/out` à la racine du site via SFTP / gestionnaire de fichiers IONOS.
Si le site n'est pas à la racine du domaine, ajouter `basePath` dans `next.config.ts`.

## Structure
- `app/` : layout (fonts, thème, métadonnées), page, CSS global et tokens
- `content/` : projets et textes FR/EN, typés
- `components/` : une section = un fichier ; effets transverses (Preloader, Cursor, SmoothScroll, Konami)
- `lib/` : i18n (contexte) et helpers motion (import dynamique GSAP, reduced-motion)

## Accessibilité / perf
- `prefers-reduced-motion` : préloader, Lenis, curseur, marquee, split text, Three.js (frame statique) désactivés ou figés
- Three.js et GSAP chargés en import dynamique, rendu pausé hors écran et onglet caché
- Galerie horizontale épinglée sur desktop, grille verticale sur mobile
