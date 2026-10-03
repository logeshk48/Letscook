"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { recipe } from "@/content/site";
import s from "./Recipe.module.css";

/** Sticky cards that stack; each one shrinks a little as the next slides over it. */
export default function Recipe() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-title]", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-title]", start: "top 88%", once: true },
      });
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        gsap.to(card, {
          scale: 0.92 - (cards.length - i) * 0.01,
          ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="recipe" className={s.recipe}>
      <div className="wrap">
        <header className={s.head}>
          <p className="label">OUR RECIPE</p>
          <h2 className={s.title} data-title>
            Idea to
            <br />
            launch
          </h2>
          <p>Four steps, no mystery and no disappearing acts. You always know which step we are on and what comes next.</p>
        </header>

        <div className={s.cards}>
          {recipe.map((step, i) => (
            <article key={step.title} className={s.card} style={{ "--i": i } as React.CSSProperties} data-card>
              <div className={s.num}>{String(i + 1).padStart(2, "0")}</div>
              <div>
                <div className={s.cardHead}>
                  <h3>{step.title}</h3>
                  <span>{step.stage.toUpperCase()}</span>
                </div>
                <p>{step.text}</p>
                <div className={s.tags}>
                  {step.tags.map((t, j) => (
                    <span key={t}>
                      {j === 0 && <b>● </b>}
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
