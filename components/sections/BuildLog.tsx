"use client";

import { useEffect, useRef, useState } from "react";
import { buildLog } from "@/content/site";
import { prefersReducedMotion } from "@/lib/gsap";
import s from "./Services.module.css";

/** A fake terminal that types the build steps when it scrolls into view. */
export default function BuildLog() {
  const ref = useRef<HTMLDivElement>(null);
  // Start fully written (good for SEO / no-JS); retype when seen.
  const [typed, setTyped] = useState<string[]>(buildLog.map((l) => l.text));
  const [done, setDone] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;

    const run = async () => {
      setDone(false);
      const out = buildLog.map(() => "");
      setTyped([...out]);
      for (let li = 0; li < buildLog.length; li++) {
        const { text, tone } = buildLog[li];
        for (let c = 0; c <= text.length; c++) {
          if (cancelled) return;
          out[li] = text.slice(0, c);
          setTyped([...out]);
          await new Promise((r) => setTimeout(r, tone === "dim" ? 28 : 12));
        }
        await new Promise((r) => setTimeout(r, 220));
      }
      setDone(true);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  return (
    <div className={s.monitor} data-monitor data-cursor="big" aria-label="How a project runs">
      <i className={`${s.corner} ${s.tl}`} />
      <i className={`${s.corner} ${s.tr}`} />
      <i className={`${s.corner} ${s.bl}`} />
      <i className={`${s.corner} ${s.br}`} />

      {/* window bar */}
      <div className={s.bar}>
        <span className={s.dots} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className={s.monMeta}>kitchen.log</span>
        <span className={s.rec}>● ON THE STOVE</span>
      </div>

      <div ref={ref} className={s.term}>
        {buildLog.map((l, i) =>
          typed[i] ? (
            <p key={i} className={s[l.tone]}>
              {typed[i]}
            </p>
          ) : null
        )}
        {done && <span className={s.caret} />}
      </div>
    </div>
  );
}