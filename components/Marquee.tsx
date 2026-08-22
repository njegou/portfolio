"use client";
import { useI18n } from "@/lib/i18n";

export default function Marquee() {
  const { t } = useI18n();
  const items = [...t.marquee, ...t.marquee];
  return (
    <div className="marquee border-y border-line py-4 overflow-hidden" aria-label={t.marquee.join(", ")}>
      <div className="marquee-track" aria-hidden>
        {items.map((it, i) => (
          <span key={i} className="font-display text-2xl md:text-4xl font-semibold px-8 flex items-center gap-8 whitespace-nowrap">
            {it}<span className="lit size-2 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
