"use client";

import { useState } from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { faqs } from "@/content/site";
import s from "./Faq.module.css";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpen((cur) => (cur === i ? null : i));
    setTimeout(() => ScrollTrigger.refresh(), 550); // page got taller/shorter
  };

  return (
    <section className={s.faq}>
      <div className={`wrap ${s.grid}`}>
        <div>
          <p className="label">GOOD TO KNOW</p>
          <h2>Questions we get all the time</h2>
        </div>
        <div>
          {faqs.map((f, i) => (
            <div key={f.q} className={`${s.qa} ${open === i ? s.open : ""}`}>
              <button aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => toggle(i)}>
                {f.q}
                <span className={s.pm} aria-hidden="true" />
              </button>
              <div className={s.ans} id={`faq-${i}`}>
                <div>
                  <p>{f.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
