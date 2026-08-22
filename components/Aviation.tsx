"use client";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { useGsap } from "@/lib/motion";
import Eyebrow from "./Eyebrow";
import SplitText from "./SplitText";
import Scramble from "./Scramble";

/** Section aviation : un tour de piste (circuit) tracé au scroll, avion qui le parcourt. */
export default function Aviation() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGsap((gsap) => {
    gsap.to("#plane", {
      ease: "none", motionPath: { path: "#circuit", align: "#circuit", alignOrigin: [0.5, 0.5], autoRotate: true },
      scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 30%", scrub: 1 },
    });
    gsap.to("#circuit", { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 30%", scrub: 1 } });
    gsap.from(".av-stat", { opacity: 0, y: 20, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: root.current, start: "top 60%", once: true } });
  });

  return (
    <section id="aviation" ref={root} className="relative px-5 md:px-12 py-28 md:py-40 border-y border-line bg-bg-2/40 scroll-mt-20 overflow-hidden">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <Eyebrow code="SEC 04" label={t.aviation.label} />
          <SplitText text={t.aviation.title} className="font-display font-bold text-5xl md:text-7xl tracking-tight mb-8" />
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl mb-10">{t.aviation.p}</p>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
            {t.aviation.stats.map(([k, v]) => (
              <div key={k} className="av-stat">
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted mb-1">{k}</dt>
                <dd className="font-display font-semibold text-xl">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 inline-block border border-accent/40 bg-accent/5 rounded-md px-4 py-3">
            <Scramble text={t.aviation.strip} className="text-xs tracking-wider text-accent" />
          </div>
        </div>

        <svg viewBox="0 0 600 420" className="w-full" role="img" aria-label="Schéma de tour de piste">
          <defs>
            <pattern id="g" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="var(--grid)" /></pattern>
          </defs>
          <rect width="600" height="420" fill="url(#g)" />
          {/* Piste */}
          <rect x="230" y="300" width="140" height="18" rx="2" fill="var(--fg)" opacity="0.85" />
          <text x="300" y="336" textAnchor="middle" fill="var(--fg-muted)" fontFamily="var(--font-mono)" fontSize="10">RWY 25 / 07</text>
          {/* Circuit : vent arrière, base, finale */}
          <path id="circuit" d="M240 309 L 120 309 C 60 309, 60 120, 120 120 L 480 120 C 540 120, 540 309, 480 309 L 370 309"
            fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="1400" strokeDashoffset="1400" />
          <path d="M240 309 L 120 309 C 60 309, 60 120, 120 120 L 480 120 C 540 120, 540 309, 480 309 L 370 309" fill="none" stroke="var(--line)" strokeWidth="1" strokeDasharray="4 6" />
          {["Vent arrière", "Base", "Finale"].map((l, i) => (
            <text key={l} x={[300, 510, 440][i]} y={[108, 215, 296][i]} textAnchor="middle" fill="var(--fg-muted)" fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2">{l.toUpperCase()}</text>
          ))}
          <g id="plane">
            <path d="M-10 0 L 10 0 M 0 -7 L 0 7 M -6 5 L 6 5" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" fill="none" />
            <circle r="14" fill="var(--accent)" opacity="0.12" />
          </g>
        </svg>
      </div>
    </section>
  );
}
