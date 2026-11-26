"use client";
import { useT } from "@/lib/i18n";
import s from "./LangToggle.module.css";

// EN / FIL on every screen (vision principle 4). Real radio inputs under a sliding thumb (LAMBAT .mseg).
export default function LangToggle({ compact = false, tone = "page" }: { compact?: boolean; tone?: "page" | "brand" }) {
  const { lang, setLang, t } = useT();
  return (
    <fieldset className={s.seg} data-compact={compact || undefined} data-tone={tone} style={{ "--i": lang === "en" ? 0 : 1 } as React.CSSProperties}>
      <legend className="sr-only">{t("lang.label")}</legend>
      <span className={s.thumb} aria-hidden />
      {(["en", "fil"] as const).map((l) => (
        <label key={l} className={s.opt}>
          <input type="radio" name={`lang-${tone}`} value={l} checked={lang === l} onChange={() => setLang(l)} />
          <span lang={l === "fil" ? "fil" : "en"}>{l === "en" ? "English" : "Filipino"}</span>
        </label>
      ))}
    </fieldset>
  );
}
