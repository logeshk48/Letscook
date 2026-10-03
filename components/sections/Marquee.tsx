"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { marqueeItems } from "@/content/site";
import s from "./Marquee.module.css";

/** Two rows of giant service names; scrolling the page speeds them up. */
export default function Marquee() {
  const root = useRef<HTMLElement>(null);
  const { onScrollVelocity } = useApp();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-row]");
      const tweens = rows.map((row, i) =>
        gsap.fromTo(row, { xPercent: i % 2 ? -50 : 0 }, { xPercent: i % 2 ? 0 : -50, duration: 38, ease: "none", repeat: -1 })
      );
      let settle: gsap.core.Tween | null = null;
      const off = onScrollVelocity((v) => {
        const speed = 1 + Math.min(Math.abs(v) / 6, 5);
        tweens.forEach((t) => gsap.to(t, { timeScale: speed, duration: 0.3, overwrite: true }));
        settle?.kill();
        settle = gsap.delayedCall(0.4, () => tweens.forEach((t) => gsap.to(t, { timeScale: 1, duration: 1.2 })));
      });
      return () => off();
    },
    { scope: root }
  );

  const row = (items: string[]) =>
    [...items, ...items].map((t, i) => (
      <span key={i} aria-hidden={i >= items.length}>
        {t}
        <em> ✦</em>
      </span>
    ));

  return (
    <section ref={root} className={s.marq} aria-label="Everything we build">
      <div className={`${s.row} ${s.outline}`} data-row>
        {row(marqueeItems)}
      </div>
      <div className={s.row} data-row>
        {row([...marqueeItems].reverse())}
      </div>
    </section>
  );
}
