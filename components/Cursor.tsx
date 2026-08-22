"use client";
import { useEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Curseur custom : point + anneau qui suit avec retard, grossit sur les
 * éléments interactifs, se colle aux [data-magnetic]. Désactivé au tactile
 * et en reduced-motion (le curseur natif reste alors).
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    let cleanup = () => {};
    loadGsap().then((gsap) => {
      const xTo = gsap.quickTo(ring.current, "x", { duration: 0.35, ease: "power3" });
      const yTo = gsap.quickTo(ring.current, "y", { duration: 0.35, ease: "power3" });
      const dxTo = gsap.quickTo(dot.current, "x", { duration: 0.08 });
      const dyTo = gsap.quickTo(dot.current, "y", { duration: 0.08 });
      let magnet: HTMLElement | null = null;

      const onMove = (e: MouseEvent) => {
        dxTo(e.clientX); dyTo(e.clientY);
        if (magnet) {
          const r = magnet.getBoundingClientRect();
          xTo(r.left + r.width / 2 + (e.clientX - r.left - r.width / 2) * 0.3);
          yTo(r.top + r.height / 2 + (e.clientY - r.top - r.height / 2) * 0.3);
        } else { xTo(e.clientX); yTo(e.clientY); }
      };
      const onOver = (e: MouseEvent) => {
        const el = (e.target as HTMLElement).closest("a, button, [data-magnetic], [data-cursor]") as HTMLElement | null;
        magnet = el?.closest("[data-magnetic]") as HTMLElement | null;
        gsap.to(ring.current, { scale: el ? 2.2 : 1, opacity: el ? 0.9 : 1, duration: 0.3 });
        gsap.to(dot.current, { scale: el ? 0 : 1, duration: 0.2 });
        const label = el?.getAttribute("data-cursor");
        if (ring.current) ring.current.textContent = label ?? "";
      };
      window.addEventListener("mousemove", onMove, { passive: true });
      document.addEventListener("mouseover", onOver);
      cleanup = () => { window.removeEventListener("mousemove", onMove); document.removeEventListener("mouseover", onOver); };
    });
    return () => { cleanup(); document.documentElement.classList.remove("has-cursor"); };
  }, []);

  return (
    <>
      <div ref={dot} className="fixed top-0 left-0 z-[80] size-2 -ml-1 -mt-1 rounded-full bg-accent pointer-events-none mix-blend-difference" aria-hidden />
      <div ref={ring} className="fixed top-0 left-0 z-[80] size-8 -ml-4 -mt-4 rounded-full border border-accent grid place-items-center font-mono text-[6px] uppercase tracking-wider text-accent pointer-events-none" aria-hidden />
    </>
  );
}
