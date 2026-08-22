"use client";
import { useI18n } from "@/lib/i18n";

/** Lien d'évitement : client, pour suivre la langue choisie. */
export default function SkipLink() {
  const { t } = useI18n();
  return (
    <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] btn btn-solid">
      {t.a11y.skip}
    </a>
  );
}
