"use client";
import dynamic from "next/dynamic";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { useGsap } from "@/lib/motion";
import SplitText from "./SplitText";
import Scramble from "./Scramble";
import Magnetic from "./Magnetic";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

export default function Hero() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  // Entrée orchestrée après le préloader + parallaxe de sortie au scroll.
  useGsap((gsap) => {
    const el = root.current!;
    gsap.set(".hero-fade", { opacity: 0, y: 24 });
    const enter = () => gsap.to(".hero-fade", { opacity: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.12, delay: 0.4 });
    window.addEventListener("preloader:done", enter, { once: true });
    gsap.to(".hero-content", { yPercent: -25, opacity: 0, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-canvas", { yPercent: 15, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true } });
    return () => window.removeEventListener("preloader:done", enter);
  });

  return (
    <section ref={root} className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      <div className="hero-canvas absolute inset-0 -z-0"><HeroCanvas /></div>
      {/* Dégradé bas pour lisibilité du texte sur les particules */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent pointer-events-none" aria-hidden />

      <div className="hero-content relative px-5 md:px-12 pb-10 md:pb-16 pt-40">
        <p className="hero-fade font-mono text-[11px] md:text-xs tracking-[0.3em] text-muted mb-6">
          <Scramble text={t.hero.eyebrow} auto={false} />
        </p>
        <SplitText as="h1" text={[...t.hero.title]} trigger="event" delay={0.2} stagger={0.025}
          className="font-display font-extrabold leading-[0.88] tracking-[-0.03em] text-[17vw] sm:text-[13vw] md:text-[10.5vw] 2xl:text-[9rem]" />
        <div className="mt-10 grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <p className="hero-fade max-w-xl text-base md:text-lg text-muted leading-relaxed">{t.hero.sub}</p>
          <div className="hero-fade flex flex-wrap gap-3">
            <Magnetic><a href="#projects" className="btn btn-solid">{t.hero.cta}<span aria-hidden>↘</span></a></Magnetic>
            <Magnetic><a href="#contact" className="btn">{t.hero.cta2}</a></Magnetic>
          </div>
        </div>
        <div className="hero-fade mt-12 flex items-center justify-between font-mono text-[10px] tracking-[0.25em] uppercase text-muted">
          <span>{t.hero.scroll} <span className="inline-block animate-bounce" aria-hidden>↓</span></span>
          <span aria-hidden>LFPN / RWY 25 / QNH 1013</span>
        </div>
      </div>
    </section>
  );
}
