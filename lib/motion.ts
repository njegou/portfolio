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

/**
 * Le préloader ne joue qu'une fois par session. Ce drapeau permet aux
 * animations déclenchées par "preloader:done" de savoir que l'événement
 * est déjà passé (sinon elles attendent un signal qui ne reviendra pas,
 * par exemple après un changement de langue qui remonte les composants).
 */
let ready = false;
export const markReady = () => {
  ready = true;
  window.dispatchEvent(new Event("preloader:done"));
};
export const isReady = () => ready;

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
