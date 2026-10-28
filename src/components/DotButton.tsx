import { useRef, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DotButton.module.css";

const HOVER_RADIUS = 60; // 반응 반경 (px)

export default function MagneticDotButton({ to }: { to: string }) {
  const ringRef = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const navigate = useNavigate();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const ring = ringRef.current;
    if (!ring) return;

    const rect = ring.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
    setIsNear(distance < HOVER_RADIUS);
  };

  const handleMouseLeave = () => setIsNear(false);

  const handleClick = () => {
    setIsLeaving(true);
    setTimeout(() => navigate(to), 600);
  };

  return (
    <div
      ref={ringRef}
      className={`${styles.magneticButton} ${isLeaving ? styles.expanding : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      tabIndex={0}
    >
      <div className={`${styles.dot} ${isNear ? styles.dotPulse : ""}`} />
    </div>
  );
}