import s from "./ui.module.css";

// Rule C5: always visible, always in English and Filipino, on every AI, brief or forum surface.
export default function Notice() {
  return (
    <aside className={s.notice} aria-label="Legal information notice" data-notice="info-not-advice">
      <p lang="en"><strong>Legal information, not legal advice.</strong>APPogado connects you with lawyers. It does not give legal advice, and using it does not make anyone your lawyer.</p>
      <p lang="fil"><strong>Impormasyong legal, hindi payong legal.</strong>Ikinokonekta ka ng APPogado sa mga abogado. Hindi ito nagbibigay ng payong legal, at hindi nagiging abogado mo ang sinuman dahil dito.</p>
    </aside>
  );
}
