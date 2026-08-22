"use client";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { useGsap } from "@/lib/motion";
import Eyebrow from "./Eyebrow";
import SplitText from "./SplitText";

export default function About() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGsap((gsap) => {
    // Parallaxe multi-couches : le bloc de faits monte plus vite que le texte.
    gsap.from(".about-p", { opacity: 0, y: 30, stagger: 0.15, duration: 1, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
    gsap.to(".about-facts", { y: -80, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: 1 } });
    gsap.to(".about-track", { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 80%", end: "bottom 40%", scrub: true } });
  });

  return (
    <section id="about" ref={root} className="relative px-5 md:px-12 py-28 md:py-40 scroll-mt-20">
      {/* Trajectoire qui se trace au scroll */}
      <svg className="absolute right-0 top-0 h-full w-1/2 pointer-events-none hidden lg:block" viewBox="0 0 600 800" fill="none" aria-hidden>
        <path className="about-track" d="M600 40 C 420 120, 380 380, 240 520 S 60 720, -20 780" stroke="var(--accent)" strokeWidth="1" strokeDasharray="1200" strokeDashoffset="1200" opacity="0.5" />
        <circle cx="240" cy="520" r="3" fill="var(--accent)" />
        <text x="252" y="514" fill="var(--fg-muted)" fontFamily="var(--font-mono)" fontSize="10">WPT ABOUT 48.80N 2.07E</text>
      </svg>

      <Eyebrow code="SEC 01" label={t.about.label} />
      <SplitText text={t.about.title} mode="words" stagger={0.06} className="font-display font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight max-w-4xl mb-16" />

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6 text-lg md:text-xl leading-relaxed text-muted">
          <p className="about-p text-fg">{t.about.p1}</p>
          <p className="about-p">{t.about.p2}</p>
          <p className="about-p">{t.about.p3}</p>
        </div>
        <dl className="about-facts lg:col-span-4 lg:col-start-9 self-start border border-line rounded-2xl divide-y divide-line bg-bg-2/60 backdrop-blur-sm">
          {t.about.facts.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 px-5 py-4">
              <dt className="font-mono text-xs uppercase tracking-widest text-muted">{k}</dt>
              <dd className="text-right font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
