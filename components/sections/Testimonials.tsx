"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { testimonials } from "@/content/site";
import s from "./Testimonials.module.css";

export default function Testimonials() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-quote]", {
        y: 70,
        rotate: 1.5,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-quotes]", start: "top 82%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.words}>
      <div className="wrap">
        <header className={s.head}>
          <p className="label">KIND WORDS</p>
          <h2>What people say after handover</h2>
        </header>
        <div className={s.quotes} data-quotes>
          {testimonials.map((t) => (
            <figure key={t.name} className={s.quote} data-quote>
              <blockquote>{t.quote}</blockquote>
              <figcaption className={s.who}>
                <i aria-hidden="true">{t.name[0]}</i>
                <div>
                  <b>{t.name}</b>
                  <span>{t.role}</span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
