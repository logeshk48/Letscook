"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import s from "./Preloader.module.css";

/** Set to false to play the preloader on every page load (handy while designing). */
const ONCE_PER_SESSION = true;
const STORAGE_KEY = "lc-preloader-seen";

/** Simple, classic intro: logo fades in, a thin line fills, the screen slides up. */
export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const { finishIntro, stopScroll, startScroll } = useApp();

  useGSAP(
    () => {
      let seen = false;
      try {
        seen = ONCE_PER_SESSION && sessionStorage.getItem(STORAGE_KEY) === "1";
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode: just play every time */
      }
      if (seen || prefersReducedMotion()) {
        finishIntro();
        setGone(true);
        return;
      }

      stopScroll();
      const fill = root.current!.querySelector<HTMLElement>("[data-fill]")!;
      const pct = root.current!.querySelector<HTMLElement>("[data-pct]")!;
      const p = { v: 0 };

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo("[data-logo]", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo("[data-line], [data-pct]", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.08 }, "-=0.45")
        .to(
          p,
          {
            v: 100,
            duration: 1.3,
            ease: "power2.inOut",
            onUpdate: () => {
              pct.textContent = `${Math.round(p.v)}%`;
              fill.style.transform = `scaleX(${p.v / 100})`;
            },
          },
          "-=0.3"
        )
        .to("[data-logo], [data-line], [data-pct]", { opacity: 0, y: -12, duration: 0.4, stagger: 0.04, ease: "power2.in" }, "+=0.15")
        .call(() => finishIntro()) // hero starts animating underneath
        .to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, "-=0.1")
        .call(() => {
          startScroll();
          setGone(true);
        });
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div ref={root} className={s.preloader} aria-hidden="true">
      <div className={s.logo} data-logo />
      <div className={s.line} data-line>
        <i data-fill />
      </div>
      <div className={s.pct} data-pct>
        0%
      </div>
    </div>
  );
}