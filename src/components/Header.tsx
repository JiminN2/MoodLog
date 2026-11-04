import { Link } from "react-router-dom";
import styles from "./header.module.css";
import SoundOn from "./SoundOn/SoundOn.tsx";

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.contents}>
        <nav className={styles.navigation}>
          <ul className={styles.left}>
            <li>
              <SoundOn />
            </li>
          </ul>
          <ul className={styles.right}>
            <li>
              <Link to="/mood-log">기록하기</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
