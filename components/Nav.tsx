"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import Magnetic from "./Magnetic";

export default function Nav() {
  const { t, lang, setLang } = useI18n();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setTheme((document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark");
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  const links: [string, string][] = [
    ["#about", t.nav.about], ["#projects", t.nav.projects], ["#stack", t.nav.stack], ["#aviation", t.nav.aviation], ["#contact", t.nav.contact],
  ];

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
      <div className={`mx-4 md:mx-8 px-4 md:px-6 flex items-center justify-between rounded-full border transition-colors duration-500 ${scrolled ? "border-line bg-bg/70 backdrop-blur-md" : "border-transparent"}`}>
        <a href="#main" className="font-mono text-sm tracking-widest py-3" data-magnetic aria-label="Nicolas, accueil">
          <span className="text-accent">N</span>.JGU
        </a>

        <nav className="hidden md:flex items-center gap-7" aria-label="Navigation principale">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="link-ul font-mono text-xs uppercase tracking-[0.18em] text-muted hover:text-fg transition-colors" data-magnetic>{label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Magnetic>
            <button onClick={() => setLang(lang === "fr" ? "en" : "fr")} className="font-mono text-xs tracking-widest px-3 py-2 rounded-full border border-line hover:border-accent transition-colors" aria-label={t.lang}>
              {lang === "fr" ? "EN" : "FR"}
            </button>
          </Magnetic>
          <Magnetic>
            <button onClick={toggleTheme} className="size-9 grid place-items-center rounded-full border border-line hover:border-accent transition-colors" aria-label={theme === "dark" ? t.theme.light : t.theme.dark}>
              <span className={`block size-3 rounded-full transition-all duration-500 ${theme === "dark" ? "bg-accent shadow-[0_0_12px_var(--accent)]" : "bg-fg"}`} aria-hidden />
            </button>
          </Magnetic>
          <button onClick={() => setOpen(!open)} className="md:hidden font-mono text-xs uppercase tracking-widest px-3 py-2" aria-expanded={open} aria-controls="mobile-menu">
            {t.nav.menu}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" className="md:hidden mx-4 mt-2 p-6 rounded-3xl border border-line bg-bg/90 backdrop-blur-md flex flex-col gap-4" aria-label="Navigation mobile">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="font-display text-2xl">{label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}
