import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./header.module.css";
import TracklistSidebar from "./TracklistSidebar.tsx";
import SoundOn from "./SoundOn/SoundOn.tsx";

type Props = {
  onTrackPlay: (index: number) => void;
};

export default function Header({ onTrackPlay }: Props) {
  const [tracklistOpen, setTracklistOpen] = useState(false);

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
            <li>
              <button
                className={styles.trackButton}
                onClick={() => setTracklistOpen(true)}
                aria-expanded={tracklistOpen}
                aria-controls="tracklist-sidebar"
              >
                Tracklist
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <TracklistSidebar
        isOpen={tracklistOpen}
        onClose={() => setTracklistOpen(false)}
        onPlay={onTrackPlay}
      />
    </div>
  );
}
