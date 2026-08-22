"use client";
import { useEffect, useState } from "react";

/**
 * Renvoie l'id de la section actuellement à l'écran. On retient la section
 * la plus visible plutôt que la première croisée : avec la galerie projets
 * épinglée, plusieurs sections peuvent être intersectées en même temps.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        let best = "", max = 0;
        ratios.forEach((r, id) => { if (r > max) { max = r; best = id; } });
        setActive(max > 0.15 ? best : "");
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9], rootMargin: "-72px 0px -20% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids.join(",")]);
  return active;
}
