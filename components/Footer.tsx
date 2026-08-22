"use client";
import { useI18n } from "@/lib/i18n";
import Scramble from "./Scramble";

export default function Footer() {
  const { t } = useI18n();
  return (
    <footer className="px-5 md:px-12 py-10 border-t border-line flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
      <span>{t.footer.made} <span aria-hidden>/</span> {new Date().getFullYear()} <span aria-hidden>/</span> {t.footer.rights}</span>
      <Scramble text="N48°48'07 E002°04'12" auto={false} />
      <a href="#main" className="link-ul hover:text-fg">{t.footer.top} ↑</a>
    </footer>
  );
}
