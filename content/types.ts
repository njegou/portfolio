export type Lang = "fr" | "en";
export type Tag = "Tech" | "Business" | "Data" | "Aviation";
export type Localized = Record<Lang, string>;

export interface Project {
  slug: string;
  code: string;            // code OACI fictif affiché sur la carte
  title: string;
  tagline: Localized;
  tags: Tag[];
  year: string;
  context: Localized;
  role: Localized;
  stack: string[];
  result: Localized;
  links: { label: string; href: string }[];
  // TODO: remplacer par tes visuels (public/projects/*.webp)
  cover?: string;
  accentHue?: number;
}
