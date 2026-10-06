"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { recipe } from "@/content/site";
import s from "./Recipe.module.css";

/** One simple line icon per step: chat → clipboard → pan → rocket. */
const ICONS = [
  <path key="0" d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12ZM8.5 12h.01M12 12h.01M15.5 12h.01" />,
  <path key="1" d="M9 4h6v3H9zM8 5.5H6a1 1 0 0 0-1 1V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6.5a1 1 0 0 0-1-1h-2M8.5 12l2 2 4-4M8.5 17h7" />,
  <path key="2" d="M3 11h14v1a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6ZM17 12h4M8 8c0-1 1-1.5 1-2.5S8 4 8 3M12 8c0-1 1-1.5 1-2.5S12 4 12 3" />,
  <path key="3" d="M5 15c-1.5 1-2 4-2 4s3-.5 4-2M9 15l-3-3c1-3 4-8 12-9-1 8-6 11-9 12ZM15 9h.01M9 15l3 3" />,
];

/** Sticky cards that stack; each one shrinks a little as the next slides over it. */
export default function Recipe() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const { scrollTo } = useApp();

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");

      // which step is on screen (drives the progress rail) — runs even with reduced motion
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) => self.isActive && setStep(i),
        });
      });

      if (prefersReducedMotion()) return;

      gsap.from("[data-label]", {
        y: 14,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-title]", start: "top 90%", once: true },
      });
      gsap.from("[data-title]", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-title]", start: "top 88%", once: true },
      });
      // the rail's orange line fills as you scroll through the cards
      gsap.fromTo(
        "[data-fill]",
        { scaleY: 0 },
        { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-cards]", start: "top 60%", end: "bottom 70%", scrub: true } }
      );
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

  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo("contact");
  };

  return (
    <section ref={root} id="recipe" className={s.recipe}>
      <div className="wrap">
        <header className={s.head}>
          <p className={s.label} data-label>
            <span className={s.labelDot} aria-hidden="true" />
            03 / Our recipe
          </p>
          <h2 className={s.title} data-title>
            Idea to
            <br />
            launch
          </h2>
          <p>Four steps, no mystery and no disappearing acts. You always know which step we are on and what comes next.</p>
        </header>

        <div className={s.layout}>
          {/* progress rail */}
          <aside className={s.rail} aria-hidden="true">
            <div className={s.railIn}>
              <span className={s.track}>
                <span className={s.fill} data-fill />
              </span>
              <ol>
                {recipe.map((r, i) => (
                  <li key={r.stage} className={i <= step ? s.done : ""}>
                    <i />
                    <span>{r.stage}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <div className={s.cards} data-cards>
            {recipe.map((r, i) => (
              <article key={r.title} className={s.card} style={{ "--i": i } as React.CSSProperties} data-card>
                <div className={s.side}>
                  <div className={s.num}>{String(i + 1).padStart(2, "0")}</div>
                  <span className={s.icon}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      {ICONS[i]}
                    </svg>
                  </span>
                </div>
                <div>
                  <div className={s.cardHead}>
                    <h3>{r.title}</h3>
                    <span>{r.stage.toUpperCase()}</span>
                  </div>
                  <p>{r.text}</p>
                  <div className={s.tags}>
                    {r.tags.map((t, j) => (
                      <span key={t}>
                        {j === 0 && <b>● </b>}
                        {t}
                      </span>
                    ))}
                  </div>
                  {i === recipe.length - 1 && (
                    <a href="#contact" className={s.cta} onClick={goContact}>
                      Start your project <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
