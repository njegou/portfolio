"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/content/types";
import { useI18n } from "@/lib/i18n";
import Scramble from "./Scramble";

/** Panneau de détail : dialog modale, Échap pour fermer, focus piégé. */
export default function ProjectPanel({ p, onClose }: { p: Project; onClose: () => void }) {
  const { lang, t } = useI18n();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const lenis = (window as unknown as { lenis?: { stop(): void; start(): void } }).lenis;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href], button, [tabindex]:not([tabindex='-1'])");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; lenis?.start(); prev?.focus(); };
  }, [onClose]);

  const rows: [string, string][] = [[t.projects.context, p.context[lang]], [t.projects.role, p.role[lang]], [t.projects.result, p.result[lang]]];

  return (
    <motion.div className="fixed inset-0 z-[70] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <button className="absolute inset-0 bg-bg/70 backdrop-blur-sm" onClick={onClose} aria-label={t.projects.close} tabIndex={-1} />
      <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby="panel-title"
        className="relative h-full w-full md:w-[640px] bg-bg border-l border-line overflow-y-auto p-6 md:p-10"
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 260, damping: 32 }}>
        <div className="flex items-center justify-between mb-10">
          <span className="flex items-center gap-2">
            {p.ongoing && <span className="lit size-1.5 rounded-full bg-accent animate-pulse" aria-hidden />}
            <Scramble text={`${p.code} / ${p.year}`} className="text-xs uppercase tracking-widest text-accent" />
          </span>
          <button onClick={onClose} className="btn !py-2 !px-4">{t.projects.close} <span aria-hidden>✕</span></button>
        </div>
        <h2 id="panel-title" className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-3">{p.title}</h2>
        <p className="text-lg text-muted mb-8">{p.tagline[lang]}</p>
        <div className="flex flex-wrap gap-2 mb-10">
          {p.tags.map((tag) => <span key={tag} className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full bg-accent text-accent-ink">{tag}</span>)}
        </div>

        <dl className="space-y-8">
          {rows.map(([k, v], i) => (
            <motion.div key={k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
              <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-2">{k}</dt>
              <dd className="leading-relaxed">{v}</dd>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-2">{t.projects.stack}</dt>
            <dd className="flex flex-wrap gap-2">{p.stack.map((s) => <span key={s} className="font-mono text-xs px-2.5 py-1 rounded-md border border-line">{s}</span>)}</dd>
          </motion.div>
          {p.links.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}>
              <dt className="font-mono text-xs uppercase tracking-[0.25em] text-muted mb-2">{t.projects.links}</dt>
              <dd className="flex flex-wrap gap-3">{p.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn">{l.label} <span aria-hidden>↗</span></a>)}</dd>
            </motion.div>
          )}
        </dl>
      </motion.div>
    </motion.div>
  );
}
