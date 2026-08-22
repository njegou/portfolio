"use client";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/:.-";

/** Effet scramble : les caractères se figent un à un de gauche à droite. */
export default function Scramble({ text, className = "", onHover = true, auto = true }: { text: string; className?: string; onHover?: boolean; auto?: boolean }) {
  const [out, setOut] = useState(text);
  const raf = useRef<number>(0);
  const ref = useRef<HTMLSpanElement>(null);

  const run = () => {
    if (prefersReducedMotion()) { setOut(text); return; }
    cancelAnimationFrame(raf.current);
    let frame = 0;
    const total = text.length * 3 + 8;
    const step = () => {
      frame++;
      const fixed = Math.floor((frame / total) * text.length);
      setOut(text.split("").map((c, i) => (c === " " ? " " : i < fixed ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(""));
      if (frame < total) raf.current = requestAnimationFrame(step); else setOut(text);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    setOut(text);
    if (!auto) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return <span ref={ref} className={`font-mono ${className}`} onMouseEnter={onHover ? run : undefined} aria-label={text}><span aria-hidden>{out}</span></span>;
}
