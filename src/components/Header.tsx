import styles from "./header.module.css";
import SoundOn from "./SoundOn/SoundOn.tsx";
import LogNowButton from "./LogNowButton.tsx";


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
              <LogNowButton />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
