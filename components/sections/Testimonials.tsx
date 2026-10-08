"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { testimonials } from "@/content/site";
import s from "./Testimonials.module.css";

/**
 * Kind words: one quote at a time.
 * Desktop: the section stays on screen while you scroll; each quote's words
 * light up as you read, then the next quote takes its place.
 * Phones: the quotes are stacked and light up as they scroll in.
 */
export default function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const mm = gsap.matchMedia();

      mm.add("(min-width: 901px)", () => {
        const quotes = gsap.utils.toArray<HTMLElement>("[data-quote]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * quotes.length * 1.1}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setActive(Math.min(quotes.length - 1, Math.floor(self.progress * quotes.length * 0.999))),
          },
        });

        quotes.forEach((q, i) => {
          const words = q.querySelectorAll("[data-w]");
          if (i > 0) tl.fromTo(q, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.25 });
          tl.fromTo(words, { opacity: 0.16 }, { opacity: 1, stagger: 0.9 / words.length, duration: 0.1 });
          tl.fromTo(q.querySelector("[data-who]"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.2 }, "<0.6");
          tl.to({}, { duration: 0.3 }); // hold so the quote can be read
          if (i < quotes.length - 1) tl.to(q, { autoAlpha: 0, y: -40, duration: 0.25 });
        });
        gsap.set(quotes.slice(1), { autoAlpha: 0 });
      });

      mm.add("(max-width: 900px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-quote]").forEach((q) =>
          gsap.fromTo(
            q.querySelectorAll("[data-w]"),
            { opacity: 0.16 },
            { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: q, start: "top 80%", end: "bottom 60%", scrub: true } }
          )
        );
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section ref={root} className={s.words} aria-label="What clients say">
      <div className={`wrap ${s.inner}`}>
        <aside className={s.side}>
          
          <h2 className={s.title}>
            What people say after <span>handover.</span>
          </h2>

          {/* who is speaking (desktop progress) */}
          <ol className={s.names} aria-hidden="true">
            {testimonials.map((t, i) => (
              <li key={t.name} className={i === active ? s.nameOn : ""}>
                <span className={s.nameNo}>{String(i + 1).padStart(2, "0")}</span>
                <span>{t.name}</span>
              </li>
            ))}
          </ol>
        </aside>

        <div className={s.stage}>
          {testimonials.map((t) => (
            <figure key={t.name} className={s.quote} data-quote>
              <span className={s.mark} aria-hidden="true">
                “
              </span>
              <blockquote>
                {t.quote.split(" ").map((w, i) => (
                  <span key={i} data-w>
                    {w}{" "}
                  </span>
                ))}
              </blockquote>
              <figcaption className={s.who} data-who>
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
