import { useEffect, useRef, useState } from "react";
import { scrollState } from "./useScrollProgress.ts";
import "./MonthsRail.css";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const NOW = new Date().getMonth();
const THIS_YEAR = new Date().getFullYear();
const SHOW_FROM = 0.55, SHOW_TO = 0.9, ENTER = 0.96;
const clamp = (v: number) => Math.max(0, Math.min(11, v));

export default function MonthsRail({ onSelect }: { onSelect?: (year: number, month: number) => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [year, setYear] = useState(THIS_YEAR);
  const yearRef = useRef(year);
  yearRef.current = year;
  const [hint, setHint] = useState("");

  useEffect(() => {
    const root = rootRef.current!, rail = railRef.current!, line = lineRef.current!;
    const nodes = nodeRefs.current.map((el) => ({
      el: el!,
      ring: el!.querySelector(".ring") as HTMLElement,
      core: el!.querySelector(".core") as HTMLElement,
      num: el!.querySelector(".num") as HTMLElement,
      name: el!.querySelector(".name") as HTMLElement,
    }));

    let cx = 0, cy = 0, gap = 100, SC = 2;
    let pos = NOW, target = NOW, raf = 0, snapT = 0;
    let entered = false, enterT = 0, lastWheel = 0;

    const layout = () => {
      const W = innerWidth, H = innerHeight;
      cx = W < 560 ? W * 0.36 : W * 0.5; cy = H / 2;
      gap = Math.max(72, Math.min(120, H / 7)); SC = W < 560 ? 1.5 : 2;
      line.style.left = cx + "px";
      root.style.setProperty("--cx", cx + "px"); 
      render();
    };

    const render = () => {
      nodes.forEach((o, i) => {
        const d = i - pos, ad = Math.abs(d);
        if (ad > 4.6) { o.el.style.display = "none"; return; }
        o.el.style.display = "";
        const f = Math.max(0, 1 - ad);
        o.el.style.transform = `translate(${cx}px,${cy + d * gap}px)`;
        o.el.style.opacity = String(Math.max(0.1, 1 - Math.min(ad, 4.6) * 0.17));
        o.ring.style.transform = `scale(${1 + f * 1.3})`;
        o.core.style.opacity = String(f);
        const off = 20 + f * 20, s = 1 + f * (SC - 1);
        o.name.style.left = off + "px";
        o.name.style.transform = `translate(0,-50%) scale(${s})`;
        o.name.style.opacity = String(0.55 + f * 0.45);
        o.num.style.left = -off + "px";
        o.num.style.transform = `translate(-100%,-50%) scale(${1 + f * (SC - 0.6)})`;
        o.num.style.opacity = String(0.5 + f * 0.5);
        o.num.style.color = f > 0.5 ? "#fff" : "";
        o.el.classList.toggle("on", f > 0.6);
      });
    };

    const tick = () => {
      pos += (target - pos) * 0.12;
      if (Math.abs(target - pos) < 0.001) pos = target;
      render();
      raf = pos === target ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const snapLater = () => {
      clearTimeout(snapT);
      snapT = window.setTimeout(() => { target = Math.round(target); kick(); }, 120);
    };

    // ── 스크롤 진행도에 따른 표시/입력 게이트 ──
    let visId = 0;
    const visLoop = () => {
      const p = scrollState.p;
      const o = Math.max(0, Math.min(1, (p - SHOW_FROM) / (SHOW_TO - SHOW_FROM)));
      root.style.opacity = String(o);
      root.style.pointerEvents = p > SHOW_TO ? "auto" : "none";
      rail.style.pointerEvents = p > ENTER ? "auto" : "none";
      entered = p > ENTER;
      visId = requestAnimationFrame(visLoop);
    };
    visLoop();

    // ── 입력 ──
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      if (!entered) { enterT = now; return; }           // 아직 다이브 중 → 기본 스크롤
      if (now - enterT < 400) { e.preventDefault(); return; } // 진입 직후 관성 스크롤 무시
      const idle = now - lastWheel > 200;
      lastWheel = now;
      if (e.deltaY < 0 && target <= 0.001 && idle) return;     // 1월에서 위로 → 인트로로 복귀
      e.preventDefault();
      target = clamp(target + e.deltaY * 0.006);
      kick(); snapLater();
    };

    let drag: { y: number; t: number } | null = null, moved = false;
    const onDown = (e: PointerEvent) => { drag = { y: e.clientY, t: target }; moved = false; };
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      const dy = e.clientY - drag.y;
      if (Math.abs(dy) > 4) moved = true;
      target = clamp(drag.t - dy / gap); kick();
    };
    const onUp = () => { if (drag) { drag = null; target = Math.round(target); kick(); } };
    const onKey = (e: KeyboardEvent) => {
      if (!entered) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") target = clamp(Math.round(target) + 1);
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") target = clamp(Math.round(target) - 1);
      else return;
      kick();
    };
    const clickHandlers = nodes.map((o, i) => {
      const h = () => {
        if (moved) return;
        if (i === Math.round(pos)) { setHint(`/mood-log/${yearRef.current}/${i + 1} 으로 이동`); onSelect?.(yearRef.current, i + 1); }
        else { target = i; kick(); }
      };
      o.el.addEventListener("click", h);
      return h;
    });

    window.addEventListener("wheel", onWheel, { passive: false });
    rail.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", layout);
    layout();

    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(visId); clearTimeout(snapT);
      window.removeEventListener("wheel", onWheel);
      rail.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", layout);
      nodes.forEach((o, i) => o.el.removeEventListener("click", clickHandlers[i]));
    };
  }, []);

  return (
    <div ref={rootRef} className="months-root" style={{ opacity: 0, pointerEvents: "none" }}>
      <div ref={railRef} className="rail">
        <div ref={lineRef} className="line" />
        {MONTHS.map((name, i) => (
          <div key={name} ref={(el) => (nodeRefs.current[i] = el)} className={"node" + (i === NOW ? " now" : "")}>
            <i className="ring"><b className="core" /></i>
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <span className="name">{name}{i === NOW && <small>This Month</small>}</span>
          </div>
        ))}
      </div>

      <div className="top">
        <span className="year">
          <button aria-label="이전 해" onClick={() => setYear((y) => y - 1)}>‹</button>
          <b>{year}</b>
          <button aria-label="다음 해" disabled={year >= THIS_YEAR} onClick={() => setYear((y) => Math.min(THIS_YEAR, y + 1))}>›</button>
        </span>
      </div>
      <div className="bottom"><span>{hint}</span><span>↕</span></div>
    </div>
  );
}