"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { reasons, stats } from "@/content/site";
import s from "./About.module.css";

const QUOTE = "The name is a joke about kitchens, but the method is real: good ingredients, a written recipe, and someone watching the pan.";

/** Counts a number up from 0 once. */
const countUp = (el: HTMLElement, vars: gsap.TweenVars = {}) => {
  const to = Number(el.dataset.count);
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = String(Math.round(o.v))), ...vars });
};

/**
 * About, set like a printed magazine spread.
 * Desktop: the section pins and the pages slide sideways while you scroll down.
 * Phones: the same pages stacked normally.
 */
export default function About() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      // ---------- desktop: pages slide sideways ----------
      mm.add("(min-width: 901px)", () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        // headline lines rise in as the section arrives
        gsap.from("[data-line]", {
          yPercent: 100,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 60%", once: true },
        });

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // folio: a thin line that fills + the page number
        gsap.fromTo("[data-progress]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });

        // each page fades up gently as it slides in
        gsap.utils.toArray<HTMLElement>("[data-page]").forEach((page) =>
          gsap.from(page, {
            opacity: 0,
            y: 24,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: page, containerAnimation: slide, start: "left 85%", once: true },
          })
        );
        root.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) =>
          countUp(el, { scrollTrigger: { trigger: el, containerAnimation: slide, start: "left 85%", once: true } })
        );
      });

      // ---------- phones / tablets: normal stack ----------
      mm.add("(max-width: 900px)", () => {
        gsap.from("[data-line]", {
          yPercent: 100,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
        });
        gsap.utils.toArray<HTMLElement>("[data-page]").forEach((page) =>
          gsap.from(page, { opacity: 0, y: 30, duration: 0.9, ease: "power2.out", scrollTrigger: { trigger: page, start: "top 85%", once: true } })
        );
        root.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) =>
          countUp(el, { scrollTrigger: { trigger: el, start: "top 90%", once: true } })
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} id="about" className={s.about}>
      <header className={s.top}>
        <p className={s.kicker}>About us</p>
        <p className={s.hint} aria-hidden="true">
          Scroll to turn the page
        </p>
      </header>

      <div className={s.viewport}>
        <div className={s.track} data-track>
          {/* page 1: headline + pull quote */}
          <div className={`${s.page} ${s.opening}`}>
            <h2 className={s.headline}>
              <span className={s.mask}>
                <span data-line>Great ideas</span>
              </span>
              <span className={s.mask}>
                <span data-line>deserve</span>
              </span>
              <span className={s.mask}>
                <em data-line>great solutions.</em>
              </span>
            </h2>
            <figure className={s.quote} data-page>
              <span className={s.quoteMark} aria-hidden="true">
                “
              </span>
              <blockquote>{QUOTE}</blockquote>
              <figcaption>The Let&apos;s Cook team, Tamil Nadu</figcaption>
            </figure>
          </div>

          {/* page 2: numbers */}
          <div className={`${s.page} ${s.numbers}`} data-page>
            <h3 className={s.pageTitle}>
              In <em>numbers</em>
            </h3>
            <dl className={s.stats}>
              {stats.map((st) => (
                <div key={st.label} className={s.stat}>
                  <dt>{st.label}</dt>
                  <dd>
                    <span data-count={st.value}>{st.value}</span>
                    {st.suffix && <small>{st.suffix}</small>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* page 3: why us */}
          <div className={`${s.page} ${s.why}`} data-page>
            <h3 className={s.pageTitle}>
              Why <em>Let&apos;s Cook</em>
            </h3>
            <p className={s.whyLead}>A small team that treats your project like ours.</p>
            <p className={s.whyText}>
              We work with business owners, early founders and students. You get direct access to the people writing the
              code, not a queue.
            </p>
          </div>

          {/* pages 4–7: the four reasons, set as columns */}
          {reasons.map((r, i) => (
            <article key={r.key} className={`${s.page} ${s.reason}`} data-page>
              <span className={s.no}>No. {String(i + 1).padStart(2, "0")}</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
            </article>
          ))}
          <div className={s.tail} aria-hidden="true" />
        </div>
      </div>

      {/* folio along the bottom (desktop) */}
      <div className={s.folio} aria-hidden="true">
        <span className={s.folioLine}>
          <span data-progress />
        </span>
        <span className={s.folioName}>Let&apos;s Cook Technologies</span>
      </div>
    </section>
  );
}
