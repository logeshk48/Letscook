"use client";

import { useEffect, useRef } from "react";

/**
 * "Something cooking behind the page": a flickering burner glow, a glowing pan rim,
 * curling steam that drifts away from the cursor, and a few rising embers.
 * - Canvas 2D with pre-rendered puff sprites (cheap to draw)
 * - Pauses when off-screen or the tab is hidden; lighter on phones; static for reduced motion
 */
export default function SteamCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 700;
    const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);

    let W = 0, H = 0, raf = 0, last = 0, t = 0, frameNo = 0;
    let running = false, visible = true;
    let mx = -9999, my = -9999;

    // pre-render soft puff sprites once
    const sprite = (rgb: string) => {
      const s = document.createElement("canvas");
      s.width = s.height = 128;
      const g = s.getContext("2d")!;
      const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, `rgba(${rgb},1)`);
      gr.addColorStop(0.35, `rgba(${rgb},.55)`);
      gr.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = gr;
      g.fillRect(0, 0, 128, 128);
      return s;
    };
    const cool = sprite("214,228,246");
    const warm = sprite("255,186,140");
    const emberImg = sprite("255,140,60");

    type Puff = { x: number; y: number; r: number; vy: number; drift: number; ph: number; amp: number; life: number; max: number; warm: boolean; ox: number };
    type Ember = { x: number; y: number; vy: number; vx: number; s: number; life: number; max: number; fl: number };
    const steam: Puff[] = [];
    const embers: Ember[] = [];
    const N = small ? 24 : 44;
    const E = small ? 8 : 18;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawnPuff = (p: Partial<Puff> = {}, init = false): Puff => {
      const spread = Math.min(W * 0.62, 900);
      const q = p as Puff;
      q.x = W / 2 + (Math.random() - 0.5) * spread;
      q.y = H + 30 + Math.random() * 40;
      q.r = 26 + Math.random() * 44;
      q.vy = 0.45 + Math.random() * 0.7;
      q.drift = (Math.random() - 0.5) * 0.25;
      q.ph = Math.random() * 6.28;
      q.amp = 0.25 + Math.random() * 0.55;
      q.life = 0;
      q.max = 300 + Math.random() * 260;
      q.warm = Math.random() < 0.3;
      q.ox = 0;
      if (init) {
        q.life = Math.random() * q.max;
        q.y -= q.life * q.vy;
        q.r += q.life * 0.11;
      }
      return q;
    };
    const spawnEmber = (p: Partial<Ember> = {}, init = false): Ember => {
      const spread = Math.min(W * 0.5, 700);
      const e = p as Ember;
      e.x = W / 2 + (Math.random() - 0.5) * spread;
      e.y = H + 10;
      e.vy = 0.8 + Math.random() * 1.4;
      e.vx = (Math.random() - 0.5) * 0.6;
      e.s = 1 + Math.random() * 2.2;
      e.life = 0;
      e.max = 90 + Math.random() * 120;
      e.fl = Math.random() * 6.28;
      if (init) {
        e.life = Math.random() * e.max;
        e.y -= e.life * e.vy;
      }
      return e;
    };

    const draw = (now: number) => {
      const dt = Math.min(3, (now - last) / 16.67 || 1);
      last = now;
      t += dt * 0.016;
      ctx.clearRect(0, 0, W, H);

      // burner glow (flickers)
      const fl = 0.82 + Math.sin(t * 7.3) * 0.06 + Math.sin(t * 13.1) * 0.04 + Math.sin(t * 2.1) * 0.05;
      const gw = Math.min(W * 0.75, 1100);
      const gy = H + gw * 0.18;
      const glow = ctx.createRadialGradient(W / 2, gy, 0, W / 2, gy, gw * 0.62);
      glow.addColorStop(0, `rgba(255,110,40,${0.42 * fl})`);
      glow.addColorStop(0.35, `rgba(255,90,31,${0.16 * fl})`);
      glow.addColorStop(1, "rgba(255,90,31,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, H - gw * 0.7, W, gw * 0.7);

      // pan rim
      ctx.save();
      ctx.strokeStyle = "rgba(255,170,120,.55)";
      ctx.beginPath();
      ctx.ellipse(W / 2, H + Math.min(W * 0.07, 70), Math.min(W * 0.42, 640), Math.min(W * 0.11, 110), 0, Math.PI * 1.04, Math.PI * 1.96);
      ctx.globalAlpha = 0.55 * fl;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.globalAlpha = 0.18 * fl;
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.restore();

      // steam
      for (const p of steam) {
        p.life += dt;
        const k = p.life / p.max;
        p.y -= p.vy * dt * (1 - k * 0.35);
        p.r += 0.11 * dt;
        const curl = Math.sin(p.ph + p.life * 0.022) * p.amp * (0.4 + k * 2.2);
        const dx = p.x + p.ox - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < 26000) p.ox += (dx / Math.sqrt(d2 + 1)) * (1 - d2 / 26000) * 1.6 * dt; // drift away from cursor
        p.ox *= 0.985;
        p.x += (p.drift + curl) * dt;
        const fadeTop = 1 - Math.max(0, (H * 0.25 - p.y) / (H * 0.25));
        const a = Math.sin(Math.min(k, 1) * Math.PI) * (p.warm ? 0.22 : 0.28) * fadeTop;
        if (a > 0.002) {
          ctx.globalAlpha = a;
          const sz = p.r * 2.6;
          ctx.drawImage(p.warm && k < 0.45 ? warm : cool, p.x + p.ox - sz / 2, p.y - sz / 2, sz, sz);
        }
        if (p.life > p.max || p.y < -p.r * 2) spawnPuff(p);
      }

      // embers
      for (const e of embers) {
        e.life += dt;
        const q = e.life / e.max;
        e.y -= e.vy * dt;
        e.x += (e.vx + Math.sin(e.fl + e.life * 0.08) * 0.4) * dt;
        const ea = (1 - q) * (0.55 + 0.45 * Math.sin(e.fl + e.life * 0.4));
        if (ea > 0) {
          ctx.globalAlpha = ea;
          const es = e.s * 7;
          ctx.drawImage(emberImg, e.x - es / 2, e.y - es / 2, es, es);
        }
        if (e.life > e.max) spawnEmber(e);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      frameNo++;
      if (small && frameNo % 2) return; // ~30fps on phones to save battery
      draw(now);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const sync = () => (visible && !document.hidden ? start() : stop());

    size();
    for (let i = 0; i < N; i++) steam.push(spawnPuff({}, true));
    for (let i = 0; i < E; i++) embers.push(spawnEmber({}, true));
    draw(performance.now()); // first frame right away (and the only frame for reduced motion)

    const onResize = () => size();
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(canvas);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}