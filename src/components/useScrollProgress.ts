import { useEffect } from "react";

export const scrollState = { p: 0 };

const readTarget = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
};

export function useScrollProgress() {
  useEffect(() => {
    let raf = 0;
    let cur = readTarget();               
    scrollState.p = cur;

    const loop = () => {
      cur += (readTarget() - cur) * 0.08;
      scrollState.p = cur;
      document.documentElement.style.setProperty("--p", cur.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.removeProperty("--p");   
    };
  }, []);
}