"use client";
import { useEffect, useState } from "react";
import type { gsap as GsapType } from "gsap";

/** Vrai si l'utilisateur demande moins d'animations. Lu côté client uniquement. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let gsapPromise: Promise<typeof GsapType> | null = null;
/** Import dynamique unique de GSAP + ScrollTrigger + MotionPath (hors bundle initial). */
export function loadGsap() {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import("gsap"), import("gsap/ScrollTrigger"), import("gsap/MotionPathPlugin")]).then(([g, st, mp]) => {
      g.gsap.registerPlugin(st.ScrollTrigger, mp.MotionPathPlugin);
      return g.gsap;
    });
  }
  return gsapPromise;
}

/**
 * Exécute `setup` avec gsap dans un gsap.context (cleanup automatique).
 * Ne fait rien si reduced-motion, sauf si `alwaysRun` est vrai.
 */
export function useGsap(
  setup: (gsap: typeof GsapType) => void | (() => void),
  deps: unknown[] = [],
  alwaysRun = false,
) {
  useEffect(() => {
    if (!alwaysRun && prefersReducedMotion()) return;
    let ctx: ReturnType<typeof GsapType.context> | undefined;
    let cleanup: void | (() => void);
    let cancelled = false;
    loadGsap().then((gsap) => {
      if (cancelled) return;
      ctx = gsap.context(() => { cleanup = setup(gsap); });
    });
    return () => { cancelled = true; cleanup?.(); ctx?.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
