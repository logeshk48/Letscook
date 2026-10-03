"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { reasons, stats } from "@/content/site";
import Typewriter from "@/components/ui/Typewriter";
import s from "./About.module.css";

const HEADLINE = "Great ideas deserve great solutions.";
const QUOTE = "The name is a joke about kitchens, but the method is real: good ingredients, a written recipe, and someone watching the pan.";

export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // words light up one by one as you scroll
      gsap.fromTo(
        "[data-word]",
        { opacity: 0.14 },
        { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "[data-headline]", start: "top 80%", end: "bottom 45%", scrub: true } }
      );
      // ghost title drifts sideways
      gsap.fromTo(
        "[data-ghost]",
        { xPercent: 4 },
        { xPercent: -4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } }
      );
      // count-up stats
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const to = Number(el.dataset.count);
        const o = { v: 0 };
        gsap.to(o, {
          v: to,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      gsap.from("[data-reason]", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: "[data-reasons]", start: "top 80%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className={s.about}>
      <div className={s.ghost} data-ghost aria-hidden="true">
        LET&apos;S COOK
      </div>
      <div className="wrap">
        <div className={s.grid}>
          <h2 className={s.headline} data-headline>
            {HEADLINE.split(" ").map((w, i) => (
              <span key={i} className={s.word} data-word>
                {w}
              </span>
            ))}
          </h2>
          <div className={s.bubbleWrap}>
            <div className={s.orb} aria-hidden="true">
              <div className={s.halo} />
              <div className={s.core} />
            </div>
            <Typewriter className={s.bubble} text={QUOTE} />
          </div>
        </div>

        <div className={s.stats}>
          {stats.map((st) => (
            <div key={st.label} className={s.stat}>
              <b>
                <span data-count={st.value}>{st.value}</span>
                {st.suffix && <sup>{st.suffix}</sup>}
              </b>
              <span className="label">{st.label}</span>
            </div>
          ))}
        </div>

        <div className={s.why} data-reasons>
          <div className={s.whyIntro}>
            <div>
              <p className="label">WHY LET&apos;S COOK</p>
              <h2>A small team that treats your project like ours</h2>
            </div>
            <p>
              We work with business owners, early founders and students. You get direct access to the people writing the
              code, not a queue.
            </p>
          </div>
          {reasons.map((r) => (
            <article
              key={r.key}
              className={s.card}
              data-reason
              onPointerMove={(e) => {
                const b = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--px", `${e.clientX - b.left}px`);
                e.currentTarget.style.setProperty("--py", `${e.clientY - b.top}px`);
              }}
            >
              <span className={s.key}>{r.key}</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
