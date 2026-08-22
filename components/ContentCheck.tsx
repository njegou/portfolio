"use client";
import { useEffect } from "react";
import { identity, isPlaceholder } from "@/content/config";
import { projects } from "@/content/projects";

/**
 * Garde-fou de développement : liste dans la console ce qui reste à remplir.
 * Aucun effet en production, et aucun rendu dans la page.
 */
export default function ContentCheck() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const todo: string[] = [];
    Object.entries(identity).forEach(([k, v]) => {
      if (isPlaceholder(v)) todo.push(`content/config.ts → identity.${k} = "${v}"`);
    });
    if (!process.env.NEXT_PUBLIC_CONTACT_ENDPOINT) todo.push(".env.local → NEXT_PUBLIC_CONTACT_ENDPOINT manquant (le formulaire n'enverra rien)");
    projects.forEach((p) => {
      if (/à confirmer|to confirm|à compléter|to fill in/i.test(p.result.fr + p.result.en)) todo.push(`content/projects.ts → résultat provisoire sur "${p.title}"`);
      if (p.links.length === 0) todo.push(`content/projects.ts → aucun lien sur "${p.title}"`);
    });
    if (todo.length) console.warn(`[portfolio] ${todo.length} élément(s) à remplir :\n` + todo.map((l) => "  · " + l).join("\n"));
  }, []);
  return null;
}
