"use client";

import { prefersReducedMotion } from "./gsap";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";
const KEEP = new Set([" ", "&", "/", "."]);
const timers = new WeakMap<HTMLElement, number>();

/** Cycles random letters, then settles left-to-right on the element's data-text. */
export function scramble(el: HTMLElement | null, frames = 22) {
  if (!el || prefersReducedMotion()) return;
  const final = el.dataset.text ?? el.textContent ?? "";
  el.dataset.text = final;
  window.clearInterval(timers.get(el));
  let f = 0;
  const id = window.setInterval(() => {
    f++;
    el.textContent = final
      .split("")
      .map((c, i) => (KEEP.has(c) || i < (f / frames) * final.length ? c : CHARS[(Math.random() * CHARS.length) | 0]))
      .join("");
    if (f >= frames) {
      window.clearInterval(id);
      el.textContent = final;
    }
  }, 30);
  timers.set(el, id);
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
