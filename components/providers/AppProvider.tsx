"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type AppCtx = {
  /** true once the preloader has finished (hero waits for this) */
  introDone: boolean;
  finishIntro: () => void;
  scrollTo: (target: string | number | HTMLElement, opts?: { immediate?: boolean }) => void;
  stopScroll: () => void;
  startScroll: () => void;
  onScrollVelocity: (fn: (v: number) => void) => () => void;
};

const Ctx = createContext<AppCtx | null>(null);

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp must be used inside <AppProvider>");
  return c;
}

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const listeners = useRef(new Set<(v: number) => void>());
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;

    lenis.on("scroll", (e: Lenis) => {
      ScrollTrigger.update();
      listeners.current.forEach((fn) => fn(e.velocity));
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Fonts change text sizes, so re-measure scroll positions once they load.
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  const scrollTo = useCallback<AppCtx["scrollTo"]>((target, opts) => {
    const el = typeof target === "string" ? document.getElementById(target.replace("#", "")) : target;
    if (el === null) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el as HTMLElement | number, { immediate: opts?.immediate, duration: 1.4 });
    } else if (typeof el === "number") {
      window.scrollTo({ top: el, behavior: opts?.immediate ? "auto" : "smooth" });
    } else {
      el.scrollIntoView({ behavior: opts?.immediate ? "auto" : "smooth" });
    }
  }, []);

  const value: AppCtx = {
    introDone,
    finishIntro: useCallback(() => setIntroDone(true), []),
    scrollTo,
    stopScroll: useCallback(() => lenisRef.current?.stop(), []),
    startScroll: useCallback(() => lenisRef.current?.start(), []),
    onScrollVelocity: useCallback((fn) => {
      listeners.current.add(fn);
      return () => listeners.current.delete(fn);
    }, []),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
