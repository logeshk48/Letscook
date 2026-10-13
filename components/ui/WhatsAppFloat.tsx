"use client";

import { useEffect, useState } from "react";
import { whatsappLink } from "@/content/site";
import s from "./WhatsAppFloat.module.css";

/** Round WhatsApp button in the bottom-right corner. Appears once the visitor scrolls past the hero. */
export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => setShow(window.scrollY > window.innerHeight * 0.8);
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  return (
    <a
      className={`${s.wa} ${show ? s.on : ""}`}
      href={whatsappLink("Hi Let's cook! I have a question.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
    >
      {/* slowly turning ring of text, like a badge */}
      <svg className={s.ring} viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <path id="wa-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <text>
          <textPath href="#wa-ring" startOffset="0" textLength="236" lengthAdjust="spacing">
            CHAT ON WHATSAPP • LET&apos;S COOK •
          </textPath>
        </text>
      </svg>
      <span className={s.core}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1a17 17 0 0 1-1.8-.7 13.7 13.7 0 0 1-5.2-4.6c-.4-.5-1.3-1.7-1.3-3.2s.8-2.2 1.1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.2.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.2 1.4 2.5 1.6.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.6.3 0 .1 0 .7-.2 1.4Z" />
        </svg>
      </span>
    </a>
  );
}
