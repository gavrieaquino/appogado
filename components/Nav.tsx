import Link from "next/link";
import { surfaces } from "@/lib/routes";
import styles from "./Nav.module.css";

const groups = [
  { key: "client", name: "For clients" },
  { key: "lawyer", name: "For lawyers" },
  { key: "admin", name: "Admin (mock)" },
] as const;

// Labelled navigation only: the audience needs words, not icons (vision principle 7).
export default function Nav() {
  return (
    <nav className={styles.nav} aria-label="Main">
      <Link href="/" className={styles.brand}>APPogado</Link>
      {groups.map((g) => (
        <div key={g.key} className={styles.group}>
          <p className={styles.groupName}>{g.name}</p>
          <ul className={styles.list}>
            {surfaces.filter((s) => s.group === g.key).map((s) => (
              <li key={s.href}><Link href={s.href} className={styles.link}>{s.label}</Link></li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
