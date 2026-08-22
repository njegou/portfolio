export type Lang = "fr" | "en";
export type Tag = "Tech" | "Business" | "Data" | "Aviation";
export type Localized = Record<Lang, string>;

/** Largeur de la carte dans la galerie. "wide" pour les projets phares. */
export type CardSize = "standard" | "wide";

export interface Project {
  slug: string;
  code: string;            // code OACI fictif affiché sur la carte
  title: string;
  tagline: Localized;
  tags: Tag[];             // le premier tag décide de l'habillage de la carte
  /** Libellé affiché ("2025", "2024 →"). */
  year: string;
  /** Clé de tri chronologique, format AAAA-MM. Dernière activité connue. */
  date: string;
  /** Projet toujours en cours : change le libellé et le point d'état. */
  ongoing?: boolean;
  size?: CardSize;
  context: Localized;
  role: Localized;
  stack: string[];
  result: Localized;
  /** Chiffre mis en avant sur les cartes Business. "??" = à remplir. */
  metric?: { value: string; label: Localized };
  /** Série de valeurs pour le mini-graphe des cartes Data (0 à 1). */
  series?: number[];
  links: { label: string; href: string }[];
  // TODO: remplacer par tes visuels (public/projects/*.webp)
  cover?: string;
}
