"use client";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { useGsap } from "@/lib/motion";
import Eyebrow from "./Eyebrow";
import SplitText from "./SplitText";

export default function Stack() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);

  useGsap((gsap) => {
    gsap.from(".stack-item", { opacity: 0, x: -24, stagger: 0.06, duration: 0.8, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
    gsap.from(".stack-bar", { scaleX: 0, stagger: 0.06, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
  });

  const cols: [string, readonly string[], string][] = [[t.stack.business, t.stack.businessItems, "BIZ"], [t.stack.tech, t.stack.techItems, "TEC"]];

  return (
    <section id="stack" ref={root} className="px-5 md:px-12 py-28 md:py-40 scroll-mt-20">
      <Eyebrow code="SEC 03" label={t.stack.label} />
      <SplitText text={t.stack.title} mode="words" stagger={0.05} className="font-display font-bold text-4xl md:text-6xl tracking-tight max-w-4xl mb-16" />
      <div className="grid md:grid-cols-2 gap-12 md:gap-20">
        {cols.map(([title, items, code]) => (
          <div key={code}>
            <h3 className="flex items-baseline gap-3 font-display font-semibold text-2xl mb-8">
              <span className="font-mono text-xs text-accent tracking-widest">{code}</span>{title}
            </h3>
            <ul className="divide-y divide-line">
              {items.map((it, i) => (
                <li key={it} className="stack-item group relative py-4 flex items-center justify-between gap-4" data-magnetic>
                  <span className="group-hover:translate-x-2 transition-transform duration-500">{it}</span>
                  <span className="font-mono text-[10px] text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="stack-bar absolute bottom-0 left-0 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" aria-hidden />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
