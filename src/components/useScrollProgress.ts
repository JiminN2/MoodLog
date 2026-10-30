// useScrollProgress.ts
import { useEffect } from "react";

export const scrollState = { p: 0 };

export function useScrollProgress() {
  useEffect(() => {
    let raf = 0, cur = 0;
    const loop = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const target = max > 0 ? window.scrollY / max : 0;
      cur += (target - cur) * 0.08; // 배경과 비슷한 감속
      scrollState.p = cur;
      document.documentElement.style.setProperty("--p", cur.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
}