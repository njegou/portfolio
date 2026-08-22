"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/content/projects";
import type { Project, Tag } from "@/content/types";
import { useI18n } from "@/lib/i18n";
import { useGsap, useReducedMotion } from "@/lib/motion";
import Eyebrow from "./Eyebrow";
import SplitText from "./SplitText";
import ProjectCard from "./ProjectCard";
import ProjectPanel from "./ProjectPanel";

const TAGS: Tag[] = ["Tech", "Business", "Data", "Aviation"];

/**
 * Galerie en scroll horizontal, du plus récent au plus ancien. La section
 * est épinglée et le rail se déplace en X au rythme du scroll vertical.
 * Sous 768px ou en reduced-motion : grille verticale classique.
 */
export default function Projects() {
  const { t } = useI18n();
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<Tag | "all">("all");
  const [active, setActive] = useState<Project | null>(null);
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  // projects est déjà trié par date décroissante à la source.
  const list = useMemo(() => (filter === "all" ? projects : projects.filter((p) => p.tags.includes(filter))), [filter]);

  useGsap((gsap) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const el = root.current!, tr = track.current!;
      const dist = () => tr.scrollWidth - window.innerWidth + 96;
      gsap.to(tr, {
        x: () => -dist(), ease: "none",
        scrollTrigger: {
          trigger: el, pin: true, scrub: 0.6, start: "top top", end: () => `+=${dist()}`, invalidateOnRefresh: true,
          onUpdate: (st) => { if (progress.current) progress.current.style.transform = `scaleX(${st.progress})`; },
        },
      });
    });
    return () => mm.revert();
  }, [list.length]);

  useEffect(() => {
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => ScrollTrigger.refresh());
  }, [list.length]);

  // Repère d'année inséré dans le rail dès que l'année change.
  const yearOf = (p: Project) => p.date.slice(0, 4);

  return (
    <section id="projects" ref={root} className="relative md:h-screen md:overflow-hidden flex flex-col py-20 md:py-0 md:justify-center scroll-mt-20">
      <div className="px-5 md:px-12 md:pt-24">
        <Eyebrow code="SEC 02" label={t.projects.label} />
        <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
          <div>
            <SplitText text={t.projects.title} className="font-display font-bold text-5xl md:text-7xl tracking-tight" />
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-muted">{t.projects.sub}</p>
          </div>
          <div role="group" aria-label={t.projects.label} className="flex flex-wrap gap-2">
            {(["all", ...TAGS] as const).map((tag) => (
              <button key={tag} onClick={() => setFilter(tag)} aria-pressed={filter === tag} data-magnetic
                className={`font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-300 ${filter === tag ? "bg-accent text-accent-ink border-accent" : "border-line hover:border-fg"}`}>
                {tag === "all" ? t.projects.all : tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="md:flex-1 md:flex md:items-center">
        <div ref={track}
          className={reduced
            ? "grid gap-6 px-5 sm:grid-cols-2 lg:grid-cols-3"
            : "flex items-stretch gap-6 px-5 md:px-12 max-md:flex-wrap max-md:justify-center will-change-transform"}>
          <AnimatePresence mode="popLayout">
            {list.flatMap((p, i) => {
              const newYear = i === 0 || yearOf(list[i - 1]) !== yearOf(p);
              return [
                // Séparateur d'année : uniquement dans le rail horizontal,
                // où la chronologie se lit de gauche à droite.
                newYear && !reduced ? (
                  <motion.div key={`y-${yearOf(p)}`} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="hidden md:flex shrink-0 flex-col justify-center items-center gap-3 pr-2" aria-hidden>
                    <span className="h-16 w-px bg-line" />
                    <span className="font-mono text-xs tracking-[0.3em] text-muted [writing-mode:vertical-rl] rotate-180">{yearOf(p)}</span>
                    <span className="h-16 w-px bg-line" />
                  </motion.div>
                ) : null,
                <motion.div key={p.slug} layout
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className={reduced ? "w-full" : `shrink-0 w-[82vw] ${p.size === "wide" ? "sm:w-[560px] md:w-[600px]" : "sm:w-[400px] md:w-[420px]"}`}>
                  <ProjectCard p={p} index={i} onOpen={() => setActive(p)} />
                </motion.div>,
              ].filter(Boolean);
            })}
          </AnimatePresence>
        </div>
      </div>

      <div className="hidden md:flex px-12 pb-8 items-center gap-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
        <span>{t.projects.drag}</span>
        <div className="flex-1 h-px bg-line overflow-hidden"><div ref={progress} className="h-full bg-accent origin-left scale-x-0" /></div>
        <span>{list.length} / {projects.length}</span>
      </div>

      <AnimatePresence>{active && <ProjectPanel p={active} onClose={() => setActive(null)} />}</AnimatePresence>
    </section>
  );
}
