"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import s from "./Preloader.module.css";

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const { finishIntro, stopScroll, startScroll } = useApp();

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        finishIntro();
        setGone(true);
        return;
      }
      stopScroll();
      const fill = root.current!.querySelector<HTMLElement>("[data-fill]")!;
      const count = root.current!.querySelector<HTMLElement>("[data-count]")!;
      const p = { v: 0 };

      gsap
        .timeline()
        .to(p, {
          v: 100,
          duration: 1.7,
          ease: "power2.inOut",
          onUpdate: () => {
            fill.style.clipPath = `inset(${100 - p.v}% 0 0 0)`;
            count.textContent = `${Math.round(p.v)}%`;
          },
        })
        .to("[data-logo], [data-count]", { scale: 1.15, opacity: 0, duration: 0.45, ease: "power2.in" }, "+=0.15")
        .to("[data-col]", { scaleY: 0, transformOrigin: "top", stagger: 0.06, duration: 0.5, ease: "power3.in" }, "<")
        .add(() => finishIntro(), "-=0.1") // hero starts animating underneath
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "expo.inOut" }, "<")
        .add(() => {
          startScroll();
          setGone(true);
        });
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div ref={root} className={s.preloader} aria-hidden="true">
      <div className={s.cols}>
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} data-col />
        ))}
      </div>
      <div className={s.logo} data-logo>
        <span className={s.ghost} />
        <span className={s.fill} data-fill />
      </div>
      <div className={s.count} data-count>
        0%
      </div>
    </div>
  );
}
