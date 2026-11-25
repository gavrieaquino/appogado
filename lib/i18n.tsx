"use client";
// Client hooks for the copy in lib/copy.ts.
import { useLang, writeLang } from "./store";
import { translate, type Key } from "./copy";

export { translate, type Key };

export function useT() {
  const lang = useLang();
  return { lang, t: (key: Key, vars?: Record<string, string | number>) => translate(lang, key, vars), setLang: writeLang };
}

export function T({ k, vars }: { k: Key; vars?: Record<string, string | number> }) {
  const { t } = useT();
  return <>{t(k, vars)}</>;
}

