"use client";
import Link from "next/link";
import { useDemo } from "@/lib/store";
import { useT } from "@/lib/i18n";
import { fullName, lawyerById } from "@/lib/data";
import BriefCard from "@/components/BriefCard";
import s from "./sent.module.css";

export default function Sent() {
  const [state] = useDemo();
  const { t, lang } = useT();
  const last = state.sent[state.sent.length - 1];
  if (!last) {
    return (
      <div className="page-in stack">
        <h1>{t("st.none")}</h1>
        <Link className="btn btn-primary" href="/describe/">{t("rv.start")}</Link>
      </div>
    );
  }
  const lawyer = last.addressedTo ? lawyerById(last.addressedTo) : undefined;
  return (
    <div className={`page-in ${s.wrap}`}>
      <p className={s.ok} aria-hidden>✓</p>
      <h1 className={s.title}>{t("st.title")}</h1>
      <p className={s.to}>{lawyer ? t("st.to", { name: fullName(lawyer) }) : t("st.toPb")}</p>
      <h2 className={s.h2}>{t("st.next")}</h2>
      <ol className={s.next}>
        <li>{t("st.n1")}</li>
        <li>{t("st.n2")}</li>
        <li>{t("st.n3")}</li>
      </ol>
      <details className={s.copy}>
        <summary>{t("rv.title")}</summary>
        <BriefCard brief={last} lang={lang} headingLevel={3} />
      </details>
      <p className={s.demo}><Link href={`/app/inbox/brief/?id=${last.id}`}>{t("st.demo")} →</Link></p>
    </div>
  );
}
