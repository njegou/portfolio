"use client";
import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { socials } from "@/content/site";
import Eyebrow from "./Eyebrow";
import SplitText from "./SplitText";
import Magnetic from "./Magnetic";

const ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;

export default function Contact() {
  const { t } = useI18n();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "noEndpoint">("idle");

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ENDPOINT) { setState("noEndpoint"); return; }
    setState("sending");
    try {
      const res = await fetch(ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(e.currentTarget) });
      setState(res.ok ? "sent" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch { setState("error"); }
  };

  const field = "w-full bg-transparent border-b border-line py-4 focus:border-accent outline-none transition-colors placeholder:text-muted/60";
  const links = [["LinkedIn", socials.linkedin], ["GitHub", socials.github], ["Email", `mailto:${socials.email}`]];

  return (
    <section id="contact" className="px-5 md:px-12 py-28 md:py-40 scroll-mt-20">
      <Eyebrow code="SEC 05" label={t.contact.label} />
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <SplitText text={t.contact.title} className="font-display font-extrabold text-6xl md:text-8xl tracking-tight mb-6" />
          <p className="text-lg text-muted max-w-md mb-10">{t.contact.sub}</p>
          <ul className="flex flex-wrap gap-3">
            {links.map(([l, h]) => (
              <li key={l}><Magnetic><a href={h} target={h.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="btn">{l} <span aria-hidden>↗</span></a></Magnetic></li>
            ))}
          </ul>
        </div>

        <form onSubmit={submit} className="space-y-6" aria-describedby="form-status">
          <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
          <div><label htmlFor="name" className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{t.contact.name}</label><input id="name" name="name" required autoComplete="name" className={field} /></div>
          <div><label htmlFor="email" className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{t.contact.email}</label><input id="email" name="email" type="email" required autoComplete="email" className={field} /></div>
          <div><label htmlFor="message" className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted">{t.contact.message}</label><textarea id="message" name="message" required rows={5} className={`${field} resize-none`} /></div>
          <Magnetic><button type="submit" disabled={state === "sending"} className="btn btn-solid disabled:opacity-60">{state === "sending" ? t.contact.sending : t.contact.send}<span aria-hidden>→</span></button></Magnetic>
          <p id="form-status" role="status" aria-live="polite" className={`font-mono text-xs ${state === "error" || state === "noEndpoint" ? "text-accent" : "text-muted"}`}>
            {state === "sent" && t.contact.sent}{state === "error" && t.contact.error}{state === "noEndpoint" && t.contact.noEndpoint}
          </p>
        </form>
      </div>
    </section>
  );
}
