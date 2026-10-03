"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import Magnetic from "@/components/ui/Magnetic";
import s from "./InkCta.module.css";

/** An orange circle grows from a dot to fill the screen as you scroll. */
export default function InkCta() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useApp();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const st = { trigger: root.current, start: "top top", end: "center top", scrub: true };
      gsap.fromTo("[data-ink]", { clipPath: "circle(6% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "none", scrollTrigger: st });
      gsap.fromTo("[data-ink] h2", { scale: 1.4 }, { scale: 1, ease: "none", scrollTrigger: st });
      gsap.to("[data-hint]", { opacity: 0, scrollTrigger: { trigger: root.current, start: "top top", end: "15% top", scrub: true } });
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.ink} aria-label="Start a project">
      <div className={s.stick}>
        <p className={s.hint} data-hint>
          KEEP SCROLLING
        </p>
        <div className={s.layer} data-ink>
          <p className="label">BUILD BEYOND IDEAS</p>
          <h2>
            Have an idea?
            <br />
            Let&apos;s cook it.
          </h2>
          <p>
            One message is all it takes to find out what your project would really involve: scope, timeline and a fixed
            price, with no obligation.
          </p>
          <Magnetic>
            <a
              className="btn btn--ink"
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollTo("contact");
              }}
            >
              Start a project <span className="arr">↗</span>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
