"use client";

import { useEffect, useRef } from "react";
import s from "./Cursor.module.css";

/**
 * Orange cursor with a soft light.
 * - dot: follows the mouse; opens into a ring over links/buttons, bigger over [data-cursor="big"]
 * - glow: a soft orange light that trails behind
 * Mouse/trackpad only — touch screens keep their normal behaviour.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add(s.hasCursor);

    let mx = -100, my = -100; // mouse
    let dx = mx, dy = my;     // dot (slight smoothing)
    let gx = mx, gy = my;     // glow (more smoothing)
    let raf = 0;
    let away = false; // only touch <html> classes when this actually changes

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (away) {
        away = false;
        root.classList.remove(s.away);
      }
      if (!raf) raf = requestAnimationFrame(loop); // wake the loop
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.closest("input, textarea, select, [contenteditable='true']");
      const big = t.closest("[data-cursor='big']");
      const link = t.closest("a, button, [role='button'], label");
      dot.current?.classList.toggle(s.hide, !!typing);
      dot.current?.classList.toggle(s.big, !typing && !!big);
      dot.current?.classList.toggle(s.link, !typing && !big && !!link);
      glow.current?.classList.toggle(s.hot, !typing && !!(big || link));
    };
    const leave = () => {
      away = true;
      root.classList.add(s.away);
    };
    const down = () => dot.current?.classList.add(s.press);
    const up = () => dot.current?.classList.remove(s.press);

    // Runs only while something is still moving, then sleeps until the mouse moves again.
    function loop() {
      dx += (mx - dx) * 0.35;
      dy += (my - dy) * 0.35;
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      if (dot.current) dot.current.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      if (glow.current) glow.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
      const settled = Math.abs(mx - gx) < 0.3 && Math.abs(my - gy) < 0.3 && Math.abs(mx - dx) < 0.3 && Math.abs(my - dy) < 0.3;
      raf = settled ? 0 : requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("pointerleave", leave);

    return () => {
      cancelAnimationFrame(raf);
      root.classList.remove(s.hasCursor, s.away);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <>
      <div ref={glow} className={s.glow} aria-hidden="true" />
      <div ref={dot} className={s.dot} aria-hidden="true" />
    </>
  );
}
