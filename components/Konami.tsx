"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** Easter egg : code Konami = radar + décollage qui traverse l'écran. */
export default function Konami() {
  const { t } = useI18n();
  const [on, setOn] = useState(false);

  useEffect(() => {
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      i = e.key === CODE[i] ? i + 1 : e.key === CODE[0] ? 1 : 0;
      if (i === CODE.length) { i = 0; setOn(true); setTimeout(() => setOn(false), 4200); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {on && (
        <motion.div className="fixed inset-0 z-[85] pointer-events-none overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-live="polite">
          <div className="absolute inset-0 bg-bg/80" />
          {/* Radar */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[70vmin] rounded-full border border-accent/30">
            <div className="absolute inset-[25%] rounded-full border border-accent/20" />
            <div className="absolute inset-[50%] rounded-full border border-accent/20" />
            <div className="radar-sweep absolute inset-0 rounded-full" />
          </div>
          {/* Avion qui décolle */}
          <motion.svg className="absolute" width="80" height="80" viewBox="0 0 80 80"
            initial={{ x: "-10vw", y: "85vh", rotate: 0 }} animate={{ x: "110vw", y: "5vh", rotate: -25 }} transition={{ duration: 3.6, ease: [0.4, 0, 0.2, 1] }}>
            <path d="M10 40 L 70 40 M 40 15 L 40 65 M 25 58 L 55 58" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" fill="none" />
          </motion.svg>
          <motion.div className="absolute bottom-[12vh] left-1/2 -translate-x-1/2 text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <p className="font-display font-extrabold text-4xl md:text-6xl text-accent">{t.konami.title}</p>
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-muted mt-3">{t.konami.sub}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
