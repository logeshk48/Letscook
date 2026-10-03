"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import Magnetic from "@/components/ui/Magnetic";
import { site, whatsappLink } from "@/content/site";
import s from "./Hero.module.css";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const { introDone, scrollTo } = useApp();

  // 1) Intro: slide the headline up once the preloader is done.
  useGSAP(
    () => {
      if (!introDone || prefersReducedMotion()) return;
      gsap
        .timeline()
        .from("[data-reveal] > span", { yPercent: 110, duration: 1.1, ease: "expo.out", stagger: 0.12 })
        .from("[data-fade]", { y: 30, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08 }, "-=0.7");
    },
    { scope: root, dependencies: [introDone] }
  );

  // 2) As the next section slides over, tilt the hero back and dim it.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to(inner.current, {
        scale: 0.86,
        rotateX: 12,
        opacity: 0.25,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  // 3) Spotlight follows the pointer across the tile wall.
  const onMove = (e: React.PointerEvent) => {
    const r = inner.current!.getBoundingClientRect();
    inner.current!.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    inner.current!.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <section ref={root} className={s.hero} aria-label="Intro" onPointerMove={onMove}>
      <div ref={inner} className={s.inner}>
        <p className={`${s.eyebrow} line`} data-reveal>
          <span>{site.name.toUpperCase()}</span>
        </p>
        <h1 className={s.title}>
          <span className={`line ${s.buildLine}`} data-reveal>
            <span className={s.build}>BUILD</span>
          </span>
          <span className={`line ${s.beyondLine}`} data-reveal>
            <span className={s.beyond}>BEYOND IDEAS</span>
          </span>
        </h1>
        <p className={s.copy} data-fade>
          We turn your ideas into powerful digital solutions: websites, mobile apps and custom applications, built
          properly and handed over in full.
        </p>
        <div className={s.cta} data-fade>
          <Magnetic>
            <a
              className="btn btn--solid"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("contact");
              }}
            >
              Let&apos;s build something <span className="arr">↗</span>
            </a>
          </Magnetic>
          <Magnetic>
            <a
              className="btn"
              href={whatsappLink("Hi Let's cook! I have an idea I'd like to build. Can we talk?")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="dot" />
              Chat on WhatsApp
            </a>
          </Magnetic>
        </div>
        <div className={s.audience} data-fade>
          <span>
            FOR <b>BUSINESSES</b>
          </span>
          <span>
            <b>STARTUPS</b>
          </span>
          <span>
            <b>STUDENTS</b>
          </span>
        </div>
      </div>
    </section>
  );
}
