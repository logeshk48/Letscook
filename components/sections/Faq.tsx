"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { faqs, site, whatsappLink } from "@/content/site";
import s from "./Faq.module.css";

/**
 * FAQ: heading + a small "still curious?" card on the left (stays in view on desktop),
 * numbered questions on the right. The first answer starts open.
 */
export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(0);

  const toggle = (i: number) => {
    setOpen((cur) => (cur === i ? null : i));
    setTimeout(() => ScrollTrigger.refresh(), 550); // page got taller/shorter
  };

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
      gsap.from("[data-q]", {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: { trigger: "[data-list]", start: "top 82%", once: true },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} id="faq" className={s.faq}>
      <div className={`wrap ${s.grid}`}>
        <aside className={s.side}>
          <div className={s.sideIn}>
            <p className={s.kicker}>
              <span className={s.dot} aria-hidden="true" />
              Good to know
            </p>
            <h2 className={s.title} data-title>
              <span className="line">
                <span>Questions,</span>
              </span>
              <span className="line">
                <span className={s.hot}>answered.</span>
              </span>
            </h2>
            <p className={s.lede}>The things people usually ask before we start cooking.</p>

            <div className={s.ask}>
              <p className={s.askTitle}>Still curious?</p>
              <p className={s.askText}>Ask us directly. A real person replies, usually within a few hours.</p>
              <div className={s.askLinks}>
                <a href={whatsappLink("Hi Let's cook! I have a question.")} target="_blank" rel="noopener noreferrer" className={s.askBtn}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.8-.7 13.7 13.7 0 0 1-5.2-4.6c-.4-.5-1.3-1.7-1.3-3.2s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.6.3 0 .1 0 .7-.2 1.4Z" />
                  </svg>
                  WhatsApp
                </a>
                <a href={`mailto:${site.email}`} className={s.askMail}>
                  {site.email}
                </a>
              </div>
            </div>
          </div>
        </aside>

        <ol className={s.list} data-list>
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className={`${s.qa} ${isOpen ? s.open : ""}`} data-q>
                <button aria-expanded={isOpen} aria-controls={`faq-${i}`} onClick={() => toggle(i)}>
                  <span className={s.no}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.q}>{f.q}</span>
                  <span className={s.pm} aria-hidden="true" />
                </button>
                <div className={s.ans} id={`faq-${i}`}>
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
