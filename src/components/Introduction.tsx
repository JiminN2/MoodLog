import { useEffect, useRef } from "react";
import styles from "./Introduction.module.css";
import IntroductionBg from "./IntroductionBg.tsx";
import MagneticDotButton from "./DotButton.tsx";
import MonthsRail from "./MonthsRail.tsx";
import { useScrollProgress } from "./useScrollProgress.ts";
import { useNavigate } from "react-router-dom";

interface ActiveTrack {
  label: string;
  file: string;
}

interface Props {
  activeTrack: ActiveTrack | null;
  isPlaying: boolean;
  hasNextTrack: boolean;
  onTogglePlay: () => void;
  onNextTrack: () => void;
  onTrackEnd: () => void;
}

// interface MonthSelection {
//   year: number;
//   month: number;
// }

export default function Introduction({
  activeTrack, isPlaying, hasNextTrack, onTogglePlay, onNextTrack, onTrackEnd,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  
  useScrollProgress(); // ← 추가

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.play().catch(() => {});
    else audio.pause();
  }, [isPlaying, activeTrack]);

  return (
    <div className={styles.landing}>
      <IntroductionBg isPlaying={isPlaying} />

      {/* ← 추가: 스크롤 공간 */}
      <div style={{ height: "300vh" }} />

      {/* ← 추가: 인트로 타이틀 (스크롤하면 확대되며 사라짐) */}
      <h1 className={styles.title}>moodlog</h1>

      {/* 기존 컨트롤: fixed로 고정 */}
      <div className={styles.centerControls}>
        {activeTrack && (
          <>
            <button type="button" className={styles.controlButton} onClick={onTogglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
              )}
            </button>
            <button type="button" className={styles.nextButton} onClick={onNextTrack} disabled={!hasNextTrack}>
              Next Track
            </button>
          </>
        )}
      </div>

      <MagneticDotButton to="/" />

      {/* ← 추가: 월 선택 화면 */}
      <MonthsRail onSelect={(y, m) => navigate(`/mood-log/${y}/${m}`)} />

      {activeTrack && (
        <audio ref={audioRef} src={`/audio/${activeTrack.file}.mp3`} onEnded={onTrackEnd} />
      )}
    </div>
  );
}