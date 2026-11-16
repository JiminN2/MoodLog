import styles from "./Introduction.module.css";
import MagneticDotButton from "./DotButton.tsx";
import MonthsRail from "./MonthsRail";
import { useScrollProgress } from "./useScrollProgress";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {useLayoutEffect} from "react";

// interface MonthSelection {
//   year: number;
//   month: number;
// }


export default function Introduction() {
  const navigate = useNavigate();

  const {state} = useLocation();
useLayoutEffect(() => {
  if ( state?. fromMonth)window.scrollTo(0, document.documentElement.scrollHeight);
}, []);

  
  useScrollProgress(); // ← 추가

  return (
    <div className={styles.landing}>

      {/* ← 추가: 스크롤 공간 */}
      <div style={{ height: "300vh" }} />

      {/* ← 추가: 인트로 타이틀 (스크롤하면 확대되며 사라짐) */}
      <h1 className={styles.title}>moodlog</h1>

      <MagneticDotButton to="/" />

      {/* ← 추가: 월 선택 화면 */}
      <MonthsRail onSelect={(y, m) => navigate(`/mood-log/${y}/${m}`)} />
    </div>
  );
}