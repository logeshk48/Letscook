"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { projects } from "@/content/site";
import s from "./Work.module.css";

/** On wide screens the section pins and the cards slide sideways as you scroll. */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const { scrollTo } = useApp();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-title]", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
      });

      const mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth);
        gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: root.current!.querySelector<HTMLElement>("[data-pin]"),
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="work" className={s.work}>
      <div className={s.pin} data-pin>
        <div className={`wrap ${s.head}`}>
          <div>
            <p className="label">RECENT WORK • SHOPS, FOUNDERS, STUDENTS</p>
            <h2 data-title>
              Things we
              <br />
              have cooked up
            </h2>
          </div>
          <p>A sample of the kinds of projects we take on. Hover a card to see what it changed.</p>
        </div>

        <div ref={track} className={s.track}>
          {projects.map((p) => (
            <article key={p.title} className={s.card} tabIndex={0} data-cursor="big">
              <div className={s.visual}>
                <span className={s.badge}>{p.kind.toUpperCase()}</span>
                {p.image ? (
                  <Image src={p.image} alt={p.title} fill sizes="(max-width: 900px) 90vw, 390px" className={s.img} />
                ) : (
                  <span className={s.glyph} aria-hidden="true">
                    {p.glyph}
                  </span>
                )}
                <div className={s.metric}>
                  <span>{p.metricLabel}</span>
                  <b>{p.metricValue}</b>
                </div>
              </div>
              <div className={s.info}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <ul>
                  {p.results.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          <article className={`${s.card} ${s.next}`}>
            <div className={s.visual}>
              <span className={s.glyph}>YOU?</span>
            </div>
            <div className={s.info}>
              <h3>Your project could be next.</h3>
              <p>Tell us the idea. We will tell you honestly what it takes to build it.</p>
              <a
                className="btn btn--solid"
                href="#contact"
                style={{ marginTop: "1rem" }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("contact");
                }}
              >
                Start a project <span className="arr">↗</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
