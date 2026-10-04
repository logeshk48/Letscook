"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { whatsappLink } from "@/content/site";
import s from "./Nav.module.css";

/** Sections the nav links to. `id` must match the section's id on the page. */
const LINKS = [
  { id: "services", label: "Services" },
  { id: "recipe", label: "Process" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "faq", label: "FAQ" },
];

/** Floating glass "island" nav. Top-centre on desktop, docked at the bottom on phones. */
export default function Nav() {
  const { scrollTo, stopScroll, startScroll } = useApp();
  const linksRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  // Slide the glass pill under a link (or hide it).
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

  // Hide while scrolling down, show again when scrolling up.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > lastY && y > 240);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Phone menu: lock page scroll while open, close on Esc.
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
    startScroll(); // unlock first (the phone menu locks scrolling)
    scrollTo(id);
  };

  return (
    <>
      <header className={`${s.island} ${hidden && !open ? s.hide : ""} ${solid ? s.solid : ""}`}>
        <a href="#top" className={s.brand} onClick={go("top")} aria-label="Let's cook Technologies, back to top">
          <i className={s.icon} aria-hidden="true" />
          <b>
            Let&apos;s <span>cook</span>
          </b>
        </a>

        <nav ref={linksRef} className={s.links} aria-label="Main" onMouseLeave={() => movePill(active)}>
          <span ref={pillRef} className={s.pill} aria-hidden="true" />
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              data-id={l.id}
              className={active === l.id ? s.on : ""}
              aria-current={active === l.id ? "true" : undefined}
              onMouseEnter={() => movePill(l.id)}
              onClick={go(l.id)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <span className={s.status}>Available</span>

        <a href="#contact" className={s.cta} onClick={go("contact")}>
          Start a project <span className={s.arr} aria-hidden="true">↗</span>
        </a>

        <button
          className={s.burger}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={open ? s.x : ""} />
        </button>
      </header>

      {/* phone menu: slide-up sheet */}
      <div className={`${s.scrim} ${open ? s.show : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <div id="mobile-menu" className={`${s.sheet} ${open ? s.show : ""}`} role="dialog" aria-label="Menu" aria-hidden={!open}>
        <div className={s.grab} aria-hidden="true" />
        <nav className={s.sheetLinks}>
          {LINKS.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? s.on : ""} tabIndex={open ? 0 : -1} onClick={go(l.id)}>
              {l.label}
              <small>{String(i + 1).padStart(2, "0")}</small>
            </a>
          ))}
        </nav>
        <div className={s.chips}>
          <a className={s.chip} href={whatsappLink()} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
            WhatsApp
          </a>
          <a className={`${s.chip} ${s.chipMain}`} href="#contact" tabIndex={open ? 0 : -1} onClick={go("contact")}>
            Start a project ↗
          </a>
        </div>
      </div>
    </>
  );
}