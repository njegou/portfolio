"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dict, type Dict } from "@/content/site";
import type { Lang } from "@/content/types";

interface Ctx { lang: Lang; t: Dict; setLang: (l: Lang) => void }
const I18nCtx = createContext<Ctx>({ lang: "fr", t: dict.fr, setLang: () => {} });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  useEffect(() => {
    const saved = localStorage.getItem("lang") as Lang | null;
    const guess: Lang = navigator.language.startsWith("en") ? "en" : "fr";
    const l = saved ?? guess;
    setLangState(l);
    document.documentElement.lang = l;
  }, []);
  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
  };
  // Le dict EN est structurellement identique au FR : cast sûr.
  return <I18nCtx.Provider value={{ lang, t: dict[lang] as unknown as Dict, setLang }}>{children}</I18nCtx.Provider>;
}
export const useI18n = () => useContext(I18nCtx);
