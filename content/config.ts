/**
 * TOUT CE QUE TU DOIS REMPLIR EST ICI.
 * Un point de vérité unique : ne cherche pas ailleurs dans le code.
 * Les valeurs contenant "example" ou "xxxx" sont détectées comme non
 * remplies et signalées dans la console en développement (voir ContentCheck).
 */
export const identity = {
  /** Affiché dans la barre de navigation, en haut à gauche. */
  logo: "N.JGU",
  /** Balise <title> et Open Graph. */
  siteName: "Nicolas",
  /** URL finale du site, sert aussi de base aux métadonnées. */
  siteUrl: "https://nicolas.example",
  email: "hello@nicolas.example",
  linkedin: "https://www.linkedin.com/in/nicolas-xxxx",
  github: "https://github.com/njegou",
};

/** Section aviation : à ajuster avec tes vraies infos. */
export const aviation = {
  airfield: "LFPN Toussus",
  aircraft: "DR400 / PA28",
  goal: "PPL(A)",
};

/** Vrai si la valeur est encore un texte de remplissage. */
export const isPlaceholder = (v: string) => /example|xxxx/i.test(v);
