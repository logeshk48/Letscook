"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { site } from "@/content/site";
import s from "./Preloader.module.css";

/** Set to false to play the preloader on every page load (handy while designing). */
const ONCE_PER_SESSION = true;
const STORAGE_KEY = "lc-preloader-seen";

const WORDS = [
  { text: "Prep", style: "outline" },
  { text: "Measure", style: "solid" },
  { text: "Cook", style: "outline" },
  { text: "Serve", style: "solid" },
  { text: "Let's cook", style: "hot" },
] as const;
const LABELS = ["KITCHEN://BOOT", "PREP://IDEA", "MEASURE://SCOPE", "COOK://BUILD", "SERVE://LAUNCH"];

const R = 88; // ring radius in the 200×200 SVG
const CIRC = 2 * Math.PI * R;

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const { finishIntro, stopScroll, startScroll } = useApp();

  useGSAP(
    () => {
      const seen = (() => {
        try {
          return ONCE_PER_SESSION && sessionStorage.getItem(STORAGE_KEY) === "1";
        } catch {
          return false;
        }
      })();
      if (seen || prefersReducedMotion()) {
        finishIntro();
        setGone(true);
        return;
      }
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* private mode: just play every time */
      }

      stopScroll();
      const el = root.current!;
      const q = <T extends Element = HTMLElement>(sel: string) => el.querySelector<T>(sel)!;
      const ring = q<SVGCircleElement>("[data-ring]");
      const fill = q("[data-fill]");
      const bar = q("[data-bar]");
      const num = q("[data-num]");
      const step = q("[data-step]");
      const label = q("[data-label]");
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");

      // steam rising from the chef hat (loops until the preloader unmounts)
      gsap.utils.toArray<HTMLElement>("[data-steam]").forEach((p, i) => {
        gsap.set(p, { x: (i - 2) * 10, y: 0, opacity: 0, scale: 0.6 });
        gsap.to(p, {
          keyframes: { y: [0, -60], opacity: [0, 0.7, 0], scale: [0.6, 2.2] },
          x: `+=${gsap.utils.random(-14, 14)}`,
          duration: 1.6,
          ease: "none",
          repeat: -1,
          delay: i * 0.3,
        });
      });

      gsap.set(words, { yPercent: 110 });
      gsap.set(ring, { strokeDasharray: CIRC, strokeDashoffset: CIRC });

      const p = { v: 0 };
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // 1. scan line draws, grid + corner HUD fade in, emblem spins in
      tl.fromTo("[data-scan]", { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power3.inOut" })
        .fromTo("[data-grid]", { opacity: 0, scale: 1.2 }, { opacity: 0.35, scale: 1, duration: 0.9 }, "-=0.15")
        .to("[data-scan]", { opacity: 0, duration: 0.25 }, "<")
        .fromTo("[data-hud]", { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.05, duration: 0.5 }, "<")
        .fromTo("[data-emblem]", { scale: 0.6, opacity: 0, rotate: -20 }, { scale: 1, opacity: 1, rotate: 0, duration: 0.7 }, "<")
        .to("[data-orb]", { rotate: 360, svgOrigin: "100 100", duration: 2.8, ease: "none" }, "<")
        .to("[data-dash]", { rotate: -90, svgOrigin: "100 100", duration: 2.8, ease: "none" }, "<")
        .addLabel("load", "-=2.5");

      // 2. progress: ring, logo fill, counter and bar move together
      tl.to(
        p,
        {
          v: 100,
          duration: 2,
          ease: "power1.inOut",
          onUpdate: () => {
            const v = p.v;
            num.textContent = String(Math.round(v)).padStart(3, "0");
            ring.style.strokeDashoffset = String(CIRC * (1 - v / 100));
            fill.style.clipPath = `inset(${100 - v}% 0 0 0)`;
            bar.style.transform = `scaleX(${v / 100})`;
            const i = Math.min(3, Math.floor(v / 25));
            step.textContent = `0${i + 1}`;
            label.textContent = LABELS[i + 1];
          },
        },
        "load"
      );

      // 3. words flip one after another: PREP → MEASURE → COOK → SERVE → LET'S COOK
      const wt = gsap.timeline();
      words.forEach((w, i) => {
        wt.to(w, { yPercent: 0, duration: 0.25, ease: "expo.out" });
        if (i < words.length - 1) wt.to(w, { yPercent: -110, duration: 0.2, ease: "power3.in" }, "+=0.06");
      });
      tl.add(wt, "load");

      // 4. finale: orange shockwave + flash as LET'S COOK lands
      tl.to("[data-steprow]", { opacity: 0, duration: 0.2 }, "load+=2.05")
        .fromTo("[data-burst]", { scale: 1, opacity: 1 }, { scale: 60, duration: 0.9, ease: "power2.out" }, "<")
        .to("[data-burst]", { opacity: 0, duration: 0.5 }, "<+0.4")
        .to("[data-emblem]", { scale: 1.08, duration: 0.22, yoyo: true, repeat: 1, ease: "power2.inOut" }, "<-0.4")
        .to("[data-flash]", { opacity: 0.12, duration: 0.08, yoyo: true, repeat: 1 }, "<");

      // 5. exit: four colour panels sweep up, the hero starts underneath, panels lift away
      tl.fromTo("[data-panel]", { scaleY: 0, transformOrigin: "bottom" }, { scaleY: 1, duration: 0.5, stagger: 0.06, ease: "power4.inOut" }, "+=0.15")
        .set("[data-screen]", { display: "none" })
        .call(() => finishIntro())
        .set("[data-panel]", { transformOrigin: "top" })
        .to("[data-panel]", { scaleY: 0, duration: 0.55, stagger: 0.06, ease: "power4.inOut" })
        .call(() => {
          startScroll();
          setGone(true);
        });
    },
    { scope: root }
  );

  if (gone) return null;

  return (
    <div ref={root} className={s.root} aria-hidden="true">
      <div className={s.screen} data-screen>
        <div className={s.grid} data-grid />
        <div className={s.scan} data-scan />

        <div className={`${s.hud} ${s.tl}`} data-hud>
          LET&apos;S COOK <b>TECHNOLOGIES</b>
          <br />
          <span data-label>{LABELS[0]}</span>
        </div>
        <div className={`${s.hud} ${s.tr}`} data-hud>
          {site.location.toUpperCase()}
          <br />
          11.12°N · 78.65°E
        </div>
        <div className={`${s.hud} ${s.bl}`} data-hud>
          <div className={s.count}>
            <span data-num>000</span>
            <small>%</small>
          </div>
        </div>
        <div className={`${s.hud} ${s.br}`} data-hud>
          BUILD
          <br />
          <b>BEYOND IDEAS</b>
        </div>

        <div className={s.stage}>
          <div className={s.emblem} data-emblem>
            <svg viewBox="0 0 200 200">
              <defs>
                <linearGradient id="lc-ring" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#4d8bd1" />
                  <stop offset="1" stopColor="#ff5a1f" />
                </linearGradient>
              </defs>
              <circle className={s.dash} cx="100" cy="100" r="98" data-dash />
              <circle className={s.track} cx="100" cy="100" r={R} />
              <circle className={s.ring} cx="100" cy="100" r={R} transform="rotate(-90 100 100)" data-ring />
              <g data-orb>
                <circle className={s.orbit} cx="100" cy="12" r="4" />
              </g>
            </svg>
            <div className={s.steam}>
              {[0, 1, 2, 3, 4].map((i) => (
                <i key={i} data-steam />
              ))}
            </div>
            <div className={s.logo}>
              <span className={s.ghost} />
              <span className={s.fill} data-fill />
            </div>
          </div>

          <div className={s.ticker}>
            {WORDS.map((w) => (
              <div key={w.text} className={`${s.word} ${s[w.style]}`} data-word>
                {w.text}
              </div>
            ))}
          </div>
          <div className={s.step} data-steprow>
            STEP <b data-step>01</b> / 04
          </div>
        </div>

        <div className={s.burst} data-burst />
        <div className={s.flash} data-flash />
        <div className={s.bar}>
          <i data-bar />
        </div>
      </div>

      <div className={s.panels}>
        <i data-panel />
        <i data-panel />
        <i data-panel />
        <i data-panel />
      </div>
    </div>
  );
}