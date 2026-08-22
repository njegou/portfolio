"use client";
import { useRef } from "react";
import type { Project } from "@/content/types";
import { useI18n } from "@/lib/i18n";

/**
 * Chaque carte s'habille selon la nature du projet (premier tag) :
 * Tech = terminal, Business = chiffre mis en avant, Data = mini-graphe,
 * Aviation = trajectoire. Le but est qu'on reconnaisse le type de projet
 * avant même d'avoir lu le titre.
 */
function Instrument({ p }: { p: Project }) {
  const { lang } = useI18n();
  const kind = p.tags[0];

  if (kind === "Business" && p.metric) {
    const unknown = p.metric.value === "??";
    return (
      <div className="flex items-baseline gap-3">
        <span className={`font-display font-extrabold text-6xl md:text-7xl leading-none tabular-nums ${unknown ? "text-muted" : ""}`}>
          {p.metric.value}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted max-w-[9rem] leading-snug">
          {p.metric.label[lang]}
        </span>
      </div>
    );
  }

  if (kind === "Data" && p.series) {
    return (
      <div className="flex items-end gap-1.5 h-16" aria-hidden>
        {p.series.map((v, i) => (
          <span key={i} className="flex-1 rounded-sm bg-accent origin-bottom transition-transform duration-500 group-hover:scale-y-110"
            style={{ height: `${Math.max(v * 100, 8)}%`, opacity: 0.25 + v * 0.75, transitionDelay: `${i * 40}ms` }} />
        ))}
      </div>
    );
  }

  if (kind === "Aviation") {
    return (
      <svg viewBox="0 0 240 64" className="w-full h-16" aria-hidden>
        <path d="M4 58 C 70 58, 90 14, 236 8" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="5 7" className="dash-path" opacity="0.7" />
        <circle cx="4" cy="58" r="3" fill="var(--accent)" />
        <g transform="translate(236 8) rotate(-14)">
          <path d="M-8 0 H 8 M 0 -6 V 6 M -5 4 H -1" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    );
  }

  // Tech par défaut : la stack en sortie de terminal.
  return (
    <div className="font-mono text-[11px] leading-relaxed text-muted" aria-hidden>
      <p className="text-fg">$ stack --list</p>
      {p.stack.slice(0, 3).map((s) => <p key={s}>{"› "}{s}</p>)}
      {p.stack.length > 3 && <p>{"› "}+{p.stack.length - 3}</p>}
      <p className="text-accent">
        {"$ "}<span className="inline-block w-2 h-3.5 align-middle bg-accent animate-pulse" />
      </p>
    </div>
  );
}

export default function ProjectCard({ p, onOpen, index }: { p: Project; onOpen: () => void; index: number }) {
  const { lang, t } = useI18n();
  const ref = useRef<HTMLButtonElement>(null);

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 12}deg) rotateX(${(0.5 - py) * 12}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };

  const wide = p.size === "wide";

  return (
    <button ref={ref} onMouseMove={move} onMouseLeave={reset} onClick={onOpen} data-cursor={t.projects.open}
      className="tilt group relative text-left w-full h-full min-h-[460px] md:min-h-[500px] rounded-3xl border border-line bg-bg-2 overflow-hidden p-6 md:p-8 flex flex-col hover:border-accent/60 transition-colors"
      aria-label={`${p.title}. ${t.projects.open}`}>
      <span className="tilt-glare" aria-hidden />
      <span className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--grid)_1px,transparent_1px),linear-gradient(90deg,var(--grid)_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden />

      <div className="relative flex justify-between items-start font-mono text-[11px] uppercase tracking-widest text-muted">
        <span><span className="text-accent">{p.code}</span> / {String(index + 1).padStart(2, "0")}</span>
        <span className="flex items-center gap-2">
          {p.ongoing && <span className="lit size-1.5 rounded-full bg-accent animate-pulse" aria-hidden />}
          {p.year}
        </span>
      </div>

      {/* Instrument : plus grand sur les cartes larges, qui ont la place */}
      <div className={`relative my-auto ${wide ? "py-6" : "py-4"}`}>
        <Instrument p={p} />
      </div>

      <div className="relative">
        <h3 className={`font-display font-bold tracking-tight mb-3 group-hover:text-accent transition-colors ${wide ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
          {p.title}
        </h3>
        <p className={`text-muted leading-relaxed mb-6 ${wide ? "text-base max-w-md" : "text-sm"}`}>{p.tagline[lang]}</p>
        <div className="flex flex-wrap gap-2 pr-14">
          {p.tags.map((tag) => (
            <span key={tag} className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-line">{tag}</span>
          ))}
        </div>
      </div>

      <span className="absolute bottom-6 right-6 size-11 rounded-full border border-line grid place-items-center group-hover:bg-accent group-hover:text-accent-ink group-hover:border-accent transition-all duration-500 group-hover:rotate-45" aria-hidden>↗</span>
    </button>
  );
}
