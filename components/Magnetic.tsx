"use client";
import { useRef, type ReactNode } from "react";

/** Wrapper magnétique : l'enfant glisse vers le pointeur puis revient. */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={reset} className="inline-block transition-transform duration-300 ease-out" data-magnetic>
      {children}
    </div>
  );
}
