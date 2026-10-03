"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/** Types `text` out once when it scrolls into view. Renders the full text first for SEO / no-JS. */
export default function Typewriter({ text, className, speed = 26 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [shown, setShown] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        for (let i = 0; i <= text.length; i++) {
          if (cancelled) return;
          setShown(text.slice(0, i));
          await new Promise((r) => setTimeout(r, speed));
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [text, speed]);

  return (
    <p ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
      <span className="tw-cursor" aria-hidden="true" />
    </p>
  );
}
