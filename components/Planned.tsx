import { bySlug } from "@/lib/routes";
import styles from "./Planned.module.css";

// Placeholder for a surface that is designed in docs/surfaces.md but not built yet.
export default function Planned({ href }: { href: string }) {
  const s = bySlug(href);
  return (
    <section className={styles.wrap} aria-labelledby="page-title">
      <p className={styles.tag}>Planned · sample data only</p>
      <h1 id="page-title" className={styles.title}>{s.title}</h1>
      <p className={styles.job}>{s.job}</p>
      <p className={styles.ref}>Spec: <code>docs/surfaces.md</code></p>
    </section>
  );
}
