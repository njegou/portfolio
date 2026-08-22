"use client";
import { useEffect, useRef, useState } from "react";
import { loadGsap, markReady, prefersReducedMotion } from "@/lib/motion";
import { useI18n } from "@/lib/i18n";

/**
 * Préloader : compteur de 0 à 100 + rampe de balisage qui s'allume,
 * puis rideau qui se lève. Émet "preloader:done" pour lancer le hero.
 */
export default function Preloader() {
  const { t } = useI18n();
  const root = useRef<HTMLDivElement>(null);
  const num = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("preloaded") || prefersReducedMotion()) {
      setDone(true);
      markReady();
      return;
    }
    document.documentElement.classList.add("lenis-stopped");
    let cancelled = false;
    loadGsap().then((gsap) => {
      if (cancelled) return;
      const counter = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("preloaded", "1");
          document.documentElement.classList.remove("lenis-stopped");
          setDone(true);
          markReady();
        },
      });
      tl.to(counter, {
        v: 100, duration: 1.6, ease: "power2.inOut",
        onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0"); },
      })
        .to(".pl-light", { opacity: 1, stagger: 0.05, duration: 0.2 }, 0.2)
        .to(".pl-content", { yPercent: -40, opacity: 0, duration: 0.5, ease: "power3.in" }, "+=0.2")
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.25");
    });
    return () => { cancelled = true; };
  }, []);

  if (done) return null;
  return (
    <div ref={root} className="fixed inset-0 z-[90] bg-bg flex items-end" role="status" aria-live="polite" aria-label={t.preloader}>
      <div className="pl-content w-full p-6 md:p-12 flex items-end justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted mb-3">{t.preloader}</p>
          <div className="flex gap-2" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <span key={i} className="pl-light lit h-1.5 w-6 rounded-full bg-accent opacity-10" />
            ))}
          </div>
        </div>
        <span ref={num} className="font-display font-extrabold text-[18vw] md:text-[10vw] leading-none tabular-nums">000</span>
      </div>
    </div>
  );
}
