"use client";
import { useRef, type ElementType } from "react";
import { isReady, useGsap } from "@/lib/motion";

interface Props {
  text: string | string[];
  as?: ElementType;
  className?: string;
  mode?: "chars" | "words";
  trigger?: "scroll" | "event";   // "event" = attend preloader:done
  delay?: number;
  stagger?: number;
}

/**
 * Découpe un texte en lignes > mots > caractères, chaque ligne masquée
 * (overflow hidden) et révélée au scroll. Sans JS ou en reduced-motion,
 * le texte est simplement visible : le DOM reste lisible et accessible.
 */
export default function SplitText({ text, as: Tag = "h2", className = "", mode = "chars", trigger = "scroll", delay = 0, stagger = 0.02 }: Props) {
  const ref = useRef<HTMLElement>(null);
  const lines = Array.isArray(text) ? text : [text];

  useGsap((gsap) => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(mode === "chars" ? ".split-char" : ".split-word");
    gsap.set(targets, { yPercent: 110, rotate: 4, opacity: 0 });
    const play = () => gsap.to(targets, { yPercent: 0, rotate: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger, delay });
    if (trigger === "event") {
      // Si le préloader est déjà passé (changement de langue, navigation
      // interne), on joue tout de suite au lieu d'attendre l'événement.
      if (isReady()) { play(); return; }
      const h = () => play();
      window.addEventListener("preloader:done", h, { once: true });
      return () => window.removeEventListener("preloader:done", h);
    }
    gsap.to(targets, { yPercent: 0, rotate: 0, opacity: 1, duration: 1, ease: "expo.out", stagger, delay, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  }, [lines.join("|"), mode]);

  return (
    <Tag ref={ref} className={className} aria-label={lines.join(" ")}>
      {lines.map((line, li) => (
        <span key={li} className="split-line" aria-hidden>
          {line.split(" ").map((word, wi) => (
            <span key={wi} className="split-word whitespace-nowrap">
              {mode === "chars" ? word.split("").map((c, ci) => <span key={ci} className="split-char">{c}</span>) : word}
              {wi < line.split(" ").length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
