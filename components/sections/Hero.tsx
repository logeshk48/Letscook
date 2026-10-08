"use client";

import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { whatsappLink } from "@/content/site";
import s from "./Hero.module.css";

/** Each letter gets its own small tilt and lift so the word feels hand-drawn (fixed values = no layout jump). */
const TILT: Record<string, [number, number][]> = {
  BUILD: [[-5, 0], [3, -0.03], [-3, 0.02], [4, -0.02], [-2, 0.03]],
  beyond: [[-4, 0.02], [3, -0.03], [-2, 0.02], [4, -0.02], [-3, 0.03], [2, -0.01]],
  "IDEAS.": [[4, 0], [-3, 0.03], [5, -0.02], [-4, 0.02], [2, -0.03], [-3, 0.02]],
};

function Word({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`${s.word} ${className ?? ""}`}>
      {text.split("").map((c, i) => {
        const [r, y] = TILT[text]?.[i] ?? [0, 0];
        return (
          <span key={i} className={s.ch} style={{ rotate: `${r}deg`, translate: `0 ${y}em` }}>
            <span className={s.chIn} data-ch>
              {c}
            </span>
          </span>
        );
      })}
    </span>
  );
}

const WALL = "LET'S COOK • BUILD BEYOND IDEAS • ";
const ROWS = 7;

/**
 * Hero: comic-graffiti "BUILD beyond IDEAS." on an orange typography wall.
 * Letters pop in like stickers, the splat bursts, the wall rows slide sideways
 * (faster while you scroll), and letters hop when you hover them.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { introDone, scrollTo, onScrollVelocity } = useApp();

  // 1) Type wall: rows slide in alternating directions; scrolling speeds them up; paused off-screen
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tweens = gsap.utils.toArray<HTMLElement>("[data-track]").map((el, i) =>
        i % 2
          ? gsap.fromTo(el, { xPercent: -50 }, { xPercent: 0, duration: 60, ease: "none", repeat: -1 })
          : gsap.fromTo(el, { xPercent: 0 }, { xPercent: -50, duration: 60, ease: "none", repeat: -1 })
      );
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => tweens.forEach((t) => (self.isActive ? t.play() : t.pause())),
      });
      // scroll speed only sets a target; one ticker eases toward it (no tweens created per scroll event)
      let target = 1;
      let speed = 1;
      const off = onScrollVelocity((v) => {
        target = Math.max(target, 1 + Math.min(Math.abs(v) * 0.6, 6));
      });
      const tick = () => {
        if (!st.isActive) return;
        speed += (target - speed) * 0.12;
        target += (1 - target) * 0.04;
        tweens.forEach((t) => t.timeScale(speed));
      };
      gsap.ticker.add(tick);
      return () => {
        off();
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: root }
  );

  // 2) Intro after the preloader
  useGSAP(
    () => {
      if (!introDone || prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: "back.out(2.4)" } })
        .from("[data-wall]", { opacity: 0, scale: 1.15, duration: 1.4, ease: "power2.out" }, 0)
        .from("[data-eyebrow]", { y: 14, opacity: 0, duration: 0.6, ease: "power2.out" }, 0.2)
        // letters slap on like stickers
        .from("[data-ch]", { scale: 0, yPercent: 60, rotate: () => gsap.utils.random(-30, 30), duration: 0.7, stagger: 0.05 }, 0.3)
        // the splat bursts
        .from("[data-splat]", { scale: 0, rotate: -40, duration: 0.8, ease: "elastic.out(1, 0.5)" }, 1.0)
        .from("[data-cta]", { y: 30, scale: 0.8, opacity: 0, duration: 0.7, stagger: 0.1 }, 1.2)
        .from("[data-fade]", { y: 20, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 1.4);
    },
    { scope: root, dependencies: [introDone] }
  );

  // 3) Scrolling away: content drifts up and fades (GPU only)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to("[data-content]", {
        yPercent: -10,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
    },
    { scope: root }
  );

  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo("contact");
  };

  return (
    <section ref={root} className={s.hero} aria-label="Intro" data-nav-tone="orange">
      {/* orange typography wall */}
      <div className={s.wall} data-wall aria-hidden="true">
        {Array.from({ length: ROWS }, (_, i) => (
          <div key={i} className={s.row}>
            <div className={s.track} data-track>
              <span>{WALL.repeat(2)}</span>
              <span>{WALL.repeat(2)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className={s.glow} aria-hidden="true" />

      <div className={s.content} data-content>
        <div className={s.center}>
          <p className={s.eyebrow} data-eyebrow>
            Let&apos;s Cook Technologies
          </p>

          <h1 className={s.title} aria-label="Build beyond ideas.">
            <span className={s.stack} aria-hidden="true">
              <Word text="BUILD" />
              <Word text="beyond" className={s.beyond} />
              <Word text="IDEAS." />
            </span>

            {/* paint splat sticker */}
            <span className={s.splat} data-splat aria-hidden="true">
              <svg viewBox="0 0 200 170">
                <path d="M98 14c14 0 18 18 30 20s26-14 36-4-6 24 2 34 26 4 26 18-20 14-22 26 14 22 4 32-24-6-34 2-4 26-20 26-14-20-26-22-22 14-32 4 4-26-6-34-26 0-26-14 18-16 18-28-14-24-2-32 22 6 30-2 8-24 22-24Z" />
                <circle cx="182" cy="20" r="7" />
                <circle cx="16" cy="150" r="9" />
                <circle cx="190" cy="140" r="5" />
                <rect x="92" y="150" width="9" height="18" rx="4.5" />
                <rect x="60" y="140" width="7" height="24" rx="3.5" />
              </svg>
              <span className={s.splatText}>
                Software
                <br />
                kitchen
              </span>
            </span>
          </h1>

          <div className={s.ctas}>
            <a href="#contact" className={s.go} onClick={goContact} data-cta>
              Start a project
              <span className={s.goArr} aria-hidden="true">↗</span>
            </a>
            <a
              href={whatsappLink("Hi Let's cook! I have an idea I'd like to build. Can we talk?")}
              className={s.wa}
              target="_blank"
              rel="noopener noreferrer"
              data-cta
            >
              <svg className={s.waIcon} viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.8-.7 13.7 13.7 0 0 1-5.2-4.6c-.4-.5-1.3-1.7-1.3-3.2s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.6.3 0 .1 0 .7-.2 1.4Z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className={s.bottom}>
          <p className={s.tag} data-fade>
            Fresh software,
            <br />
            served hot.
          </p>
          <p className={s.lede} data-fade>
            Websites, mobile apps and custom software for businesses, startups and students. Scoped honestly, built
            carefully, handed over in full.
          </p>
        </div>
      </div>

      <ul className={s.rail} data-fade>
        <li>
          <b>50+</b> projects served
        </li>
        <li>
          Replies within <b>24h</b>
        </li>
        <li>
          <b>Fixed</b> quotes, upfront
        </li>
        <li>
          You own <b>100%</b> of the code
        </li>
      </ul>
    </section>
  );
}
