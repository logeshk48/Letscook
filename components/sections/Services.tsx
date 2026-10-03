"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { scramble } from "@/lib/effects";
import { services } from "@/content/site";
import BuildLog from "./BuildLog";
import s from "./Services.module.css";

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-title] .line > span", {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-title]", start: "top 85%", once: true },
      });
      gsap.from("[data-sub]", {
        letterSpacing: "1.2em",
        opacity: 0,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-sub]", start: "top 90%", once: true },
      });
      gsap.fromTo(
        "[data-monitor]",
        { scale: 0.82, rotateX: 18, transformPerspective: 1200 },
        { scale: 1, rotateX: 0, ease: "none", scrollTrigger: { trigger: "[data-monitor]", start: "top bottom", end: "center 55%", scrub: true } }
      );
      gsap.from("[data-svc]", {
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.07,
        scrollTrigger: {
          trigger: "[data-svc-list]",
          start: "top 80%",
          once: true,
          onEnter: () =>
            root.current!.querySelectorAll<HTMLElement>("[data-scramble]").forEach((el, i) => setTimeout(() => scramble(el), i * 70)),
        },
      });
    },
    { scope: root }
  );

  const toggle = (i: number, nameEl: HTMLElement | null) => {
    setOpen((cur) => (cur === i ? null : i));
    if (open !== i) scramble(nameEl);
    setTimeout(() => ScrollTrigger.refresh(), 650); // heights changed
  };

  return (
    <section
      ref={root}
      id="services"
      className={s.cook}
      onPointerMove={(e) => e.currentTarget.style.setProperty("--sx", `${(e.clientX / window.innerWidth) * 100}%`)}
    >
      <div className="wrap">
        <header className={s.head}>
          <h2 className={s.title} data-title>
            <span className="line">
              <span className="chrome">WHAT WE</span>
            </span>
            <span className="line">
              <span className="chrome">COOK</span>
            </span>
          </h2>
          <p className={s.sub} data-sub>
            SERVICES • BUILT TO HAND OVER
          </p>
        </header>

        <BuildLog />

        <div className={s.list} data-svc-list>
          {services.map((svc, i) => {
            const isOpen = open === i;
            return (
              <div key={svc.name} className={`${s.svc} ${isOpen ? s.open : ""}`} data-svc>
                <span className={s.glow} />
                <button
                  className={s.row}
                  aria-expanded={isOpen}
                  aria-controls={`svc-${i}`}
                  onMouseEnter={(e) => scramble(e.currentTarget.querySelector("[data-scramble]"))}
                  onClick={(e) => toggle(i, e.currentTarget.querySelector("[data-scramble]"))}
                >
                  <span className={s.name} data-scramble data-text={svc.name.toUpperCase()}>
                    {svc.name.toUpperCase()}
                  </span>
                  <span className={s.tag}>{svc.tag}</span>
                  <span className={s.icon} aria-hidden="true">
                    +
                  </span>
                </button>
                <div className={s.body} id={`svc-${i}`}>
                  <div>
                    <div className={s.bodyIn}>
                      <div>
                        <h3>{svc.tag}</h3>
                        <p>{svc.text}</p>
                      </div>
                      <ul>
                        {svc.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
