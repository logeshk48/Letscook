"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { site, whatsappLink } from "@/content/site";
import s from "./Nav.module.css";

/** Sections the nav links to. `id` must match the section's id on the page. */
const LINKS = [
  { id: "services", label: "Services" },
  { id: "recipe", label: "Process" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
];

/**
 * Split glass nav.
 * - Top of page: logo pill · links pill (sliding highlight) · Start a project.
 * - After scrolling: the links pill folds away and a "Menu" pill appears.
 * - Menu opens a big glass panel: large links + WhatsApp / email / start-a-project cards.
 */
export default function Nav() {
  const { scrollTo, stopScroll, startScroll } = useApp();
  const linksRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const [tone, setTone] = useState<"dark" | "orange" | "light">("dark");

  // Slide the glass highlight under a link (or hide it).
  const movePill = useCallback((id: string | null) => {
    const pill = pillRef.current;
    const link = id ? linksRef.current?.querySelector<HTMLElement>(`[data-id="${id}"]`) : null;
    if (!pill) return;
    if (!link) {
      pill.style.opacity = "0";
      return;
    }
    pill.style.opacity = "1";
    pill.style.left = `${link.offsetLeft}px`;
    pill.style.width = `${link.offsetWidth}px`;
  }, []);

  useEffect(() => movePill(active), [active, movePill]);

  // Which section is in the middle of the screen?
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const id = e.target.id;
          setActive(LINKS.some((l) => l.id === id) ? id : null);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["top", ...LINKS.map((l) => l.id), "contact"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Fold the links into a Menu pill once the visitor starts scrolling.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Match the bar to what is behind it: orange hero, light paper sections, or dark sections.
  useEffect(() => {
    let raf = 0;
    let last = 0;
    const read = () => {
      raf = 0;
      last = performance.now();
      const y = 40; // middle of the bar
      const hits = document.elementsFromPoint(window.innerWidth / 2, y);
      for (const el of hits) {
        if (el.closest("header") || getComputedStyle(el).position === "fixed") continue;
        // walk up to the first element that sets a tone or paints a background
        let node: HTMLElement | null = el as HTMLElement;
        while (node && node !== document.body) {
          const forced = node.dataset.navTone as typeof tone | undefined;
          if (forced) return setTone(forced);
          const bg = getComputedStyle(node).backgroundColor;
          const m = bg.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
          if (m && (m[4] === undefined || parseFloat(m[4]) > 0.5)) {
            const lum = (0.2126 * +m[1] + 0.7152 * +m[2] + 0.0722 * +m[3]) / 255;
            return setTone(lum > 0.6 ? "light" : "dark");
          }
          node = node.parentElement;
        }
      }
      setTone("dark");
    };
    const onScroll = () => {
      if (raf) return;
      // at most ~10 checks a second while scrolling
      const wait = Math.max(0, 100 - (performance.now() - last));
      raf = window.setTimeout(() => requestAnimationFrame(read), wait) as unknown as number;
    };
    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Menu open: lock page scroll, close on Esc.
  useEffect(() => {
    if (!open) return;
    stopScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      startScroll();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, stopScroll, startScroll]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    startScroll(); // unlock first (the menu locks scrolling)
    scrollTo(id);
  };

  return (
    <>
      <header className={`${s.bar} ${condensed ? s.condensed : ""} ${open ? s.isOpen : ""} ${!open && tone !== "dark" ? s[tone] : ""}`}>
        {/* left: logo */}
        <a href="#top" className={`${s.brand} ${s.glass}`} onClick={go("top")} aria-label="Let's cook Technologies, back to top">
          <i className={s.icon} aria-hidden="true" />
        </a>

        {/* centre: links (desktop, top of page) */}
        <nav
          ref={linksRef}
          className={`${s.links} ${s.glass}`}
          aria-label="Main"
          aria-hidden={condensed}
          onMouseLeave={() => movePill(active)}
        >
          <span ref={pillRef} className={s.pill} aria-hidden="true" />
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-id={l.id}
              tabIndex={condensed ? -1 : 0}
              className={active === l.id ? s.on : ""}
              aria-current={active === l.id ? "true" : undefined}
              onMouseEnter={() => movePill(l.id)}
              onClick={go(l.id)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* right: menu pill + CTA */}
        <div className={s.right}>
          <button
            className={`${s.menuBtn} ${s.glass}`}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span className={s.menuLabel}>{open ? "Close" : "Menu"}</span>
            <span className={s.menuIcon} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
          <a href="#contact" className={s.cta} onClick={go("contact")}>
            Start a project <span className={s.arr} aria-hidden="true">↗</span>
          </a>
        </div>
      </header>

      {/* big glass menu */}
      <div className={`${s.scrim} ${open ? s.show : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div id="site-menu" className={`${s.panel} ${s.glass} ${open ? s.show : ""}`} role="dialog" aria-label="Menu" aria-hidden={!open}>
        <nav className={s.bigLinks}>
          {LINKS.map((l, i) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className={active === l.id ? s.on : ""}
              style={{ transitionDelay: open ? `${0.08 + i * 0.04}s` : "0s" }}
              tabIndex={open ? 0 : -1}
              onClick={go(l.id)}
            >
              <small>{String(i + 1).padStart(2, "0")}</small>
              <span>{l.label}</span>
              <em aria-hidden="true">→</em>
            </a>
          ))}
        </nav>

        <div className={s.side}>
          <a className={s.card} href={whatsappLink()} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            WhatsApp
            <b>{site.phoneDisplay}</b>
          </a>
          <a className={s.card} href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>
            Email
            <b>{site.email}</b>
          </a>
          <a className={`${s.card} ${s.cardGo}`} href="#contact" tabIndex={open ? 0 : -1} onClick={go("contact")}>
            Start a project
            <b>Tell us the idea ↗</b>
          </a>
        </div>
      </div>
    </>
  );
}