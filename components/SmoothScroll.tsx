"use client";
import { useEffect, type ReactNode } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/** Lenis piloté par le ticker GSAP pour que ScrollTrigger reste synchro. */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let destroy = () => {};
    (async () => {
      const [{ default: Lenis }, gsap] = await Promise.all([import("lenis"), loadGsap()]);
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      // Ancres : on délègue à Lenis pour garder le smooth.
      const onClick = (e: MouseEvent) => {
        const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
        if (!a) return;
        const id = a.getAttribute("href")!;
        if (id.length < 2) return;
        e.preventDefault();
        lenis.scrollTo(id, { offset: -20 });
      };
      document.addEventListener("click", onClick);
      (window as unknown as { lenis?: unknown }).lenis = lenis;
      destroy = () => { gsap.ticker.remove(tick); lenis.destroy(); document.removeEventListener("click", onClick); };
    })();
    return () => destroy();
  }, []);
  return <>{children}</>;
}
