"use client";
import { useRef } from "react";
import type { Project } from "@/content/types";
import { useI18n } from "@/lib/i18n";

/** Carte projet avec tilt 3D et reflet suivant le pointeur. */
export default function ProjectCard({ p, onOpen, index }: { p: Project; onOpen: () => void; index: number }) {
  const { lang, t } = useI18n();
  const ref = useRef<HTMLButtonElement>(null);

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 14}deg) rotateX(${(0.5 - py) * 14}deg) translateZ(0)`;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };

  return (
    <button ref={ref} onMouseMove={move} onMouseLeave={reset} onClick={onOpen} data-cursor={t.projects.open}
      className="tilt project-card group relative text-left w-[82vw] sm:w-[420px] md:w-[460px] aspect-[4/5] shrink-0 rounded-3xl border border-line bg-bg-2 overflow-hidden p-6 md:p-8 flex flex-col justify-between hover:border-accent/60 transition-colors"
      aria-label={`${p.title}. ${t.projects.open}`}>
      <span className="tilt-glare" aria-hidden />
      {/* Grille de fond locale, plus dense que le site */}
      <span className="absolute inset-0 opacity-40 [background-image:linear-gradient(var(--grid)_1px,transparent_1px),linear-gradient(90deg,var(--grid)_1px,transparent_1px)] [background-size:24px_24px]" aria-hidden />

      <div className="relative flex justify-between items-start font-mono text-[11px] uppercase tracking-widest text-muted">
        <span><span className="text-accent">{p.code}</span> / {String(index + 1).padStart(2, "0")}</span>
        <span>{p.year}</span>
      </div>

      <div className="relative">
        <h3 className="font-display font-bold text-3xl md:text-4xl tracking-tight mb-3 group-hover:text-accent transition-colors">{p.title}</h3>
        <p className="text-muted leading-relaxed mb-6">{p.tagline[lang]}</p>
        <div className="flex flex-wrap gap-2">
          {p.tags.map((tag) => (
            <span key={tag} className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full border border-line">{tag}</span>
          ))}
        </div>
      </div>

      <span className="absolute bottom-6 right-6 size-11 rounded-full border border-line grid place-items-center group-hover:bg-accent group-hover:text-accent-ink group-hover:border-accent transition-all duration-500 group-hover:rotate-45" aria-hidden>↗</span>
    </button>
  );
}
