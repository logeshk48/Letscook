"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { projects, whatsappLink } from "@/content/site";
import s from "./Work.module.css";

/** One accent per project for the result screen. */
const TINTS = ["#ff5a1f", "#4d8bd1", "#ffb547", "#7ee2a8", "#c9a7ff", "#ff7a59"];

/**
 * Work, told like a product page:
 * the projects scroll on the right, and a sticky "result screen" on the left
 * switches to each project's headline number as it reaches the middle of the screen.
 */
export default function Work() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollTo } = useApp();

  useGSAP(
    () => {
      // which project is in the middle of the screen (runs even with reduced motion)
      gsap.utils.toArray<HTMLElement>("[data-entry]").forEach((el, i) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setActive(i),
        })
      );

      if (prefersReducedMotion()) return;
      gsap.from("[data-title] .line > span", {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-title]", start: "top 85%", once: true },
      });
      gsap.from("[data-screen]", {
        y: 60,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-screen]", start: "top 85%", once: true },
      });
    },
    { scope: root }
  );

  const total = projects.length + 1; // the last slide is "your project"
  const isYou = active === projects.length;
  const p = projects[Math.min(active, projects.length - 1)];
  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo("contact");
  };

  return (
    <section ref={root} id="work" className={s.work}>
      <div className="wrap">
        <header className={s.head}>
          <p className={s.kicker}>
            <span className={s.dot} aria-hidden="true" />
            Selected work
          </p>
          <h2 className={s.title} data-title>
            <span className="line">
              <span>Things we have</span>
            </span>
            <span className="line">
              <span>
                cooked <em>up.</em>
              </span>
            </span>
          </h2>
          <p className={s.intro}>Real problems for shops, founders and students, and the number that changed after we shipped.</p>
        </header>

        <div className={s.story}>
          {/* sticky result screen */}
          <div className={s.stick}>
            <div className={s.screen} data-screen style={{ "--tint": TINTS[active % TINTS.length] } as React.CSSProperties} aria-hidden="true">
              <div className={s.bar}>
                <span>{isYou ? "Your project" : p.kind}</span>
                <span>
                  {String(active + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
              </div>

              {/* project screenshots, cross-fading */}
              <div className={s.shots}>
                {projects.map((proj, i) =>
                  proj.image ? (
                    <Image
                      key={proj.title}
                      src={proj.image}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 90vw, 45vw"
                      className={`${s.shot} ${i === active ? s.shotOn : ""}`}
                      priority={i === 0}
                    />
                  ) : null
                )}
                {/* last slide: an empty frame waiting for your project */}
                <div className={`${s.blank} ${isYou ? s.blankOn : ""}`}>
                  <div className={s.reserve}>
                    <i className={s.reserveLogo} />
                    <span className={s.reserveTag}>Reserved</span>
                    <span className={s.reserveName}>Your project</span>
                    <span className={s.reserveRule} />
                    <span className={s.reserveNote}>Let&apos;s Cook Technologies · Next in the kitchen</span>
                  </div>
                </div>
              </div>

              <div className={s.readout}>
                <span key={`l${active}`} className={s.metricLabel}>
                  {isYou ? "Next up" : p.metricLabel}
                </span>
                <span className={s.metricMask}>
                  <span key={`v${active}`} className={`${s.metricValue} ${!isYou && p.metricValue.length > 8 ? s.long : ""}`}>
                    {isYou ? "You?" : p.metricValue}
                  </span>
                </span>
                <span key={`t${active}`} className={s.metricTitle}>
                  {isYou ? "Tell us the idea" : p.title}
                </span>
              </div>

              {/* progress ticks */}
              <div className={s.ticks}>
                {Array.from({ length: total }, (_, i) => (
                  <i key={i} className={i === active ? s.tickOn : ""} />
                ))}
              </div>
            </div>
          </div>

          {/* the projects */}
          <ol className={s.entries}>
            {projects.map((proj, i) => (
              <li key={proj.title} className={`${s.entry} ${i === active ? s.on : ""}`} data-entry>
                <span className={s.no}>No. {String(i + 1).padStart(2, "0")}</span>
                <h3>{proj.title}</h3>
                <p className={s.text}>{proj.text}</p>
                <ul className={s.results}>
                  {proj.results.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                {/* phones: screenshot + result inline */}
                {proj.image && (
                  <div className={s.inlineShot}>
                    <Image src={proj.image} alt={`${proj.title} screen`} fill sizes="90vw" />
                  </div>
                )}
                <div className={s.inline} style={{ "--tint": TINTS[i % TINTS.length] } as React.CSSProperties}>
                  <span>{proj.metricLabel}</span>
                  <b>{proj.metricValue}</b>
                </div>
              </li>
            ))}
            {/* last slide: your project */}
            <li className={`${s.entry} ${s.you} ${isYou ? s.on : ""}`} data-entry>
              <span className={s.no}>No. {String(total).padStart(2, "0")}</span>
              <h3>
                Your project
                <br />
                could be <em>next.</em>
              </h3>
              <p className={s.text}>Tell us the idea. We will tell you honestly what it takes to build it, with a fixed quote.</p>
              <div className={s.youCtas}>
                <a href="#contact" className={s.cta} onClick={goContact}>
                  Start a project <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={whatsappLink("Hi Let's cook! I have a project idea. Can we talk?")}
                  className={s.ghost}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </li>
          </ol>
        </div>

      </div>
    </section>
  );
}
