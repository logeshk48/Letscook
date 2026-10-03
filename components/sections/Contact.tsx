"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import Magnetic from "@/components/ui/Magnetic";
import { budgetOptions, needOptions, site, whatsappLink } from "@/content/site";
import s from "./Contact.module.css";

type Status = "idle" | "sending" | "sent" | "fallback";

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const { scrollTo } = useApp();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [waHref, setWaHref] = useState(whatsappLink());
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        "[data-giant]",
        { xPercent: 20 },
        { xPercent: -6, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } }
      );
      gsap.from("[data-clink]", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: root.current, start: "top 70%", once: true },
      });
    },
    { scope: root }
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const errs = {
      name: !data.name?.trim(),
      email: !/^\S+@\S+\.\S+$/.test(data.email ?? ""),
      idea: !data.idea?.trim(),
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;

    const message = [
      `Hi Let's cook! I'm ${data.name}.`,
      `Need: ${data.need || "Not sure"}`,
      `Budget: ${data.budget}`,
      `Idea: ${data.idea}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    setWaHref(whatsappLink(message));

    setStatus("sending");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "fallback");
      if (res.ok) form.reset();
    } catch {
      setStatus("fallback");
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — the address is visible to copy by hand */
    }
  };

  return (
    <section ref={root} id="contact" className={s.contact}>
      <div className={s.giant} data-giant aria-hidden="true">
        COOK
      </div>
      <div className="wrap">
        <div className={s.grid}>
          <div>
            <p className="label">CONTACT / ENQUIRY</p>
            <h2>Let&apos;s build something amazing</h2>
            <p className={s.lead}>
              Tell us what you have in mind. You will get a reply within a day, usually with a couple of questions and an
              honest first estimate.
            </p>

            <a className={s.clink} href={`mailto:${site.email}`} data-clink>
              <span>
                <small>EMAIL</small>
                <strong className={s.email}>
                  letscooktechnologies@
                  <wbr />
                  gmail.com
                </strong>
              </span>
              <span className={s.arrow}>↗</span>
            </a>
            <button type="button" className={s.copy} onClick={copyEmail}>
              {copied ? "COPIED" : "COPY EMAIL"}
            </button>
            <a className={s.clink} href={whatsappLink()} target="_blank" rel="noopener noreferrer" data-clink>
              <span>
                <small>CALL / WHATSAPP</small>
                <strong>{site.phoneDisplay}</strong>
              </span>
              <span className={s.arrow}>↗</span>
            </a>
            <a className={s.clink} href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer" data-clink>
              <span>
                <small>FOLLOW</small>
                <strong>@{site.instagram}</strong>
              </span>
              <span className={s.arrow}>↗</span>
            </a>

            <div className={s.socials}>
              <Magnetic strength={0.4}>
                <a className={s.soc} href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  IG
                </a>
              </Magnetic>
              <Magnetic strength={0.4}>
                <a className={s.soc} href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  WA
                </a>
              </Magnetic>
            </div>

            <p className={s.coords}>
              <b>LC KITCHEN COORDINATES:</b>
              <br />
              {site.location.toUpperCase()}
              <br />
              {site.coords}
              <br />
              SERVING CLIENTS WORLDWIDE
            </p>
          </div>

          <form className={s.form} onSubmit={onSubmit} noValidate>
            <div className={s.two}>
              <Field id="name" label="Your name *" error={errors.name}>
                <input id="name" name="name" autoComplete="name" required />
              </Field>
              <Field id="email" label="Email *" error={errors.email}>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </Field>
            </div>
            <div className={s.two}>
              <Field id="phone" label="Phone">
                <input id="phone" name="phone" type="tel" autoComplete="tel" />
              </Field>
              <Field id="need" label="What do you need?">
                <select id="need" name="need" defaultValue="">
                  <option value="">Select one</option>
                  {needOptions.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field id="budget" label="Rough budget">
              <select id="budget" name="budget">
                {budgetOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field id="idea" label="Tell us about the idea *" error={errors.idea}>
              <textarea id="idea" name="idea" required />
            </Field>

            <button className="btn btn--solid" type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send my enquiry"} <span className="arr">↗</span>
            </button>

            {status === "sent" && (
              <div className={s.notice} role="status">
                <span>Thanks, your enquiry reached us. We reply within a day. Want a faster answer?</span>
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  Continue on WhatsApp ↗
                </a>
              </div>
            )}
            {status === "fallback" && (
              <div className={s.notice} role="status">
                <span>Your message is ready. Open WhatsApp to send it to us.</span>
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  Open WhatsApp ↗
                </a>
              </div>
            )}
            <p className={s.note}>We reply within a day. Prefer email? Write to {site.email}.</p>
          </form>
        </div>

        <footer className={s.footer}>
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>{site.tagline}</span>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("top");
            }}
          >
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: boolean; children: React.ReactNode }) {
  return (
    <div className={`${s.field} ${error ? s.err : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error && <small className={s.errMsg}>Please fill this in{id === "email" ? " with a valid email" : ""}.</small>}
    </div>
  );
}
