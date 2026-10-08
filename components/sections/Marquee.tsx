"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
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
      // pause while off screen
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => tweens.forEach((t) => (self.isActive ? t.play() : t.pause())),
      });
      // speed follows scroll velocity, then eases back (one ticker, no tweens per scroll event)
      let target = 1;
      let speed = 1;
      const off = onScrollVelocity((v) => {
        target = Math.max(target, 1 + Math.min(Math.abs(v) / 6, 5));
      });
      const tick = () => {
        if (!st.isActive) return;
        speed += (target - speed) * 0.12;
        target += (1 - target) * 0.04;
        tweens.forEach((t) => t.timeScale(speed));
      };
      gsap.ticker.add(tick);
      return () => {
        off();
        gsap.ticker.remove(tick);
        st.kill();
      };
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
