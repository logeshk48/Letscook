"use client";

import { useEffect, useRef } from "react";
import s from "./Cursor.module.css";

/** Dot + trailing ring. Grows over anything clickable. Hidden on touch screens via CSS. */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf = 0;

    const move = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };
    const over = (e: PointerEvent) => {
      const hit = (e.target as HTMLElement).closest("a, button, [data-cursor='big']");
      ring.current?.classList.toggle(s.big, !!hit);
    };
    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", over);
    loop();
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className={s.dot} aria-hidden="true" />
      <div ref={ring} className={s.ring} aria-hidden="true" />
    </>
  );
}
