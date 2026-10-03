"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { navLinks, site } from "@/content/site";
import s from "./Nav.module.css";

export default function Nav() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { scrollTo, stopScroll, startScroll } = useApp();

  const { contextSafe } = useGSAP({ scope: root });

  const openMenu = contextSafe(() => {
    setOpen(true);
    stopScroll();
    gsap
      .timeline()
      .set(`.${s.menu}`, { visibility: "visible" })
      .to(`.${s.menu}`, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" })
      .fromTo(`.${s.link}`, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.05, duration: 0.7, ease: "expo.out" }, "-=0.35")
      .fromTo(`.${s.artLogo}`, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 0.9, duration: 0.9, ease: "expo.out" }, "<");
  });

  const closeMenu = contextSafe((instant = false) => {
    setOpen(false);
    const done = () => {
      gsap.set(`.${s.menu}`, { visibility: "hidden" });
      startScroll();
    };
    if (instant) {
      gsap.set(`.${s.menu}`, { clipPath: "inset(0 0 100% 0)" });
      done();
    } else {
      gsap.to(`.${s.menu}`, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut", onComplete: done });
    }
  });

  // Full-screen "loading the section" transition used by menu links.
  const goToSection = contextSafe((id: string, label: string) => {
    gsap
      .timeline()
      .set(`.${s.trans}`, { visibility: "visible", clipPath: "inset(100% 0 0 0)" })
      .set(`.${s.barFill}`, { width: "0%" })
      .call(() => {
        const el = root.current?.querySelector<HTMLElement>(`.${s.transLabel}`);
        if (el) el.textContent = label;
      })
      .to(`.${s.trans}`, { clipPath: "inset(0% 0 0 0)", duration: 0.6, ease: "expo.inOut" })
      .from(`.${s.transLabel}`, { yPercent: 60, opacity: 0, duration: 0.5, ease: "expo.out" }, "-=0.2")
      .to(`.${s.barFill}`, { width: "100%", duration: 0.7, ease: "power2.inOut" })
      .call(() => {
        closeMenu(true);
        scrollTo(id, { immediate: true });
        ScrollTrigger.update();
      })
      .to(`.${s.trans}`, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "expo.inOut" }, "+=0.1")
      .set(`.${s.trans}`, { visibility: "hidden" });
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && open && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeMenu]);

  return (
    <div ref={root}>
      <header className={s.nav}>
        <a
          href="#top"
          className={s.logo}
          aria-label={`${site.name} home`}
          onClick={(e) => {
            e.preventDefault();
            scrollTo("top");
          }}
        />
        <button
          className={`${s.burger} ${open ? s.isOpen : ""}`}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => (open ? closeMenu() : openMenu())}
        >
          <span className={s.burgerText}>{open ? "CLOSE" : "MENU"}</span>
          <span className={s.bars}>
            <i />
            <i />
          </span>
        </button>
      </header>

      <nav id="site-menu" className={s.menu} aria-label="Main" aria-hidden={!open}>
        <div className={s.links}>
          {navLinks.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={s.link}
              tabIndex={open ? 0 : -1}
              onClick={(e) => {
                e.preventDefault();
                goToSection(l.id, l.label);
              }}
            >
              <small>{String(i + 1).padStart(2, "0")}</small>
              {l.label}
            </a>
          ))}
        </div>
        <div className={s.art}>
          <div className={s.artLogo} />
          <div className={s.artMeta}>
            <span>{site.location.toUpperCase()}</span>
            <span>{site.phoneDisplay}</span>
          </div>
        </div>
      </nav>

      <div className={s.trans} aria-hidden="true">
        <div className={s.transLabel}>Home</div>
        <div className={s.bar}>
          <i className={s.barFill} />
        </div>
      </div>
    </div>
  );
}
