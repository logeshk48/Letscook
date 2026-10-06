"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { reasons, stats } from "@/content/site";
import Typewriter from "@/components/ui/Typewriter";
import s from "./About.module.css";

const HEADLINE = "Great ideas deserve great solutions.";
const QUOTE = "The name is a joke about kitchens, but the method is real: good ingredients, a written recipe, and someone watching the pan.";

/** Counts a number up from 0 once. */
const countUp = (el: HTMLElement, vars: gsap.TweenVars = {}) => {
  const to = Number(el.dataset.count);
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: 1.8, ease: "power3.out", onUpdate: () => (el.textContent = String(Math.round(o.v))), ...vars });
};

/**
 * About: on desktop the section pins and slides SIDEWAYS while you scroll down:
 * headline + quote → numbers → "why us" → four reason cards. Phones keep the normal vertical layout.
 */
export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      // ---------- desktop: horizontal scroll ----------
      mm.add("(min-width: 901px)", () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        // the headline lights up word by word as the section arrives
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 75%", end: "top top", scrub: true } }
        );

        // pin the section and move the track sideways
        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // progress bar + the big ghost text drifting slower than the track
        gsap.fromTo("[data-progress]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        gsap.fromTo("[data-ghost]", { xPercent: 0 }, { xPercent: -25, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });
        gsap.to("[data-hint]", { opacity: 0, scrollTrigger: { trigger: root.current, start: "top top", end: "+=300", scrub: true } });

        // background: the glow travels blue → orange → fire; the grid slides slower than the cards (depth)
        const bgST = () => ({ trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 1 });
        gsap
          .timeline({ scrollTrigger: bgST(), defaults: { ease: "none" } })
          .fromTo("[data-blob=blue]", { xPercent: 0, opacity: 1 }, { xPercent: -120, opacity: 0, duration: 0.5 }, 0)
          .fromTo("[data-blob=orange]", { xPercent: 120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.4 }, 0.1)
          .to("[data-blob=orange]", { xPercent: -130, opacity: 0, duration: 0.4 }, 0.55)
          .fromTo("[data-blob=fire]", { xPercent: 140, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.45 }, 0.5);
        gsap.fromTo("[data-grid]", { x: 0 }, { x: () => -distance() * 0.3, ease: "none", scrollTrigger: bgST() });

        // things inside the moving track animate when they slide into view
        root.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) =>
          countUp(el, { scrollTrigger: { trigger: el, containerAnimation: slide, start: "left 85%", once: true } })
        );
        gsap.from("[data-stat] > span:first-child", {
          scaleX: 0,
          duration: 1.6,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-stats]", containerAnimation: slide, start: "left 85%", once: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-reason]").forEach((card) =>
          gsap.from(card, {
            y: 80,
            rotate: 3,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: card, containerAnimation: slide, start: "left 92%", once: true },
          })
        );
      });

      // ---------- phones / tablets: normal vertical scroll ----------
      mm.add("(max-width: 900px)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.14 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "[data-headline]", start: "top 80%", end: "bottom 45%", scrub: true } }
        );
        root.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) =>
          countUp(el, { scrollTrigger: { trigger: el, start: "top 88%", once: true } })
        );
        gsap.from("[data-reason]", {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-reasons]", start: "top 80%", once: true },
        });
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className={s.about}>
      {/* background: travelling colour glow (blue → orange → fire) + faint grid lines */}
      <div className={s.bg} aria-hidden="true">
        <span className={`${s.blob} ${s.blue}`} data-blob="blue" />
        <span className={`${s.blob} ${s.orange}`} data-blob="orange" />
        <span className={`${s.blob} ${s.fire}`} data-blob="fire" />
        <span className={s.grid} data-grid />
      </div>
      <div className={s.ghost} data-ghost aria-hidden="true">
        LET&apos;S COOK • BUILD BEYOND IDEAS •
      </div>

      <div className={s.top}>
        <p className={s.label}>
          <span className={s.labelDot} aria-hidden="true" />
          04 / About
        </p>
        <p className={s.hint} data-hint aria-hidden="true">
          Keep scrolling <span>→</span>
        </p>
      </div>

      <div className={s.viewport}>
        <div className={s.track} data-track>
          {/* panel 1: headline + quote */}
          <div className={`${s.panel} ${s.intro}`}>
            <h2 className={s.headline} data-headline>
              {HEADLINE.split(" ").map((w, i, all) => (
                <span key={i} className={`${s.word} ${i >= all.length - 2 ? s.hot : ""}`} data-word>
                  {w}
                </span>
              ))}
            </h2>
            <div className={s.bubbleWrap}>
              <div className={s.bubbleCol}>
                <Typewriter className={s.bubble} text={QUOTE} />
                <p className={s.sign}>
                  <span aria-hidden="true">—</span> The Let&apos;s Cook team, Tamil Nadu
                </p>
              </div>
            </div>
          </div>

          {/* panel 2: numbers */}
          <div className={`${s.panel} ${s.numbers}`}>
            <p className="label">BY THE NUMBERS</p>
            <div className={s.stats} data-stats>
              {stats.map((st) => (
                <div key={st.label} className={s.stat} data-stat>
                  <span className={s.statBar} aria-hidden="true" />
                  <b>
                    <span data-count={st.value}>{st.value}</span>
                    {st.suffix && <sup>{st.suffix}</sup>}
                  </b>
                  <span className="label">{st.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* panel 3: why us intro + panels 4–7: reason cards */}
          <div className={`${s.panel} ${s.whyIntro}`} data-reasons>
            <p className="label">WHY LET&apos;S COOK</p>
            <h2>A small team that treats your project like ours</h2>
            <p>
              We work with business owners, early founders and students. You get direct access to the people writing the
              code, not a queue.
            </p>
          </div>
          {reasons.map((r, i) => (
            <article
              key={r.key}
              className={`${s.panel} ${s.card}`}
              data-reason
              onPointerMove={(e) => {
                const b = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--px", `${e.clientX - b.left}px`);
                e.currentTarget.style.setProperty("--py", `${e.clientY - b.top}px`);
              }}
            >
              <div className={s.cardTop}>
                <span className={s.key}>{r.key}</span>
                <span className={s.cardNum}>{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </article>
          ))}
          <div className={s.tail} aria-hidden="true" />
        </div>
      </div>

      {/* progress along the bottom (desktop) */}
      <div className={s.progress} aria-hidden="true">
        <span data-progress />
      </div>
    </section>
  );
}
