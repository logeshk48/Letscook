"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { budgetOptions, navLinks, needOptions, site, whatsappLink } from "@/content/site";
import s from "./Contact.module.css";

type Status = "idle" | "sending" | "sent" | "fallback";
const MARK = ["L", "E", "T", "'", "S", " ", "C", "O", "O", "K"];

/**
 * Contact: heading on top, ways to reach us on the left,
 * an "order ticket" form on the right, and a big LET'S COOK sign-off as the footer.
 */
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
      gsap.from("[data-title] .line > span", {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-title]", start: "top 85%", once: true },
      });
      // reach-us rows, then the ticket, one by one
      gsap.from("[data-in]", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: { trigger: "[data-body]", start: "top 80%", once: true },
      });
      // the sign-off letters rise one by one as you reach the bottom
      gsap.fromTo(
        "[data-ch]",
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "none",
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-mark]", start: "top bottom", end: "bottom bottom", scrub: 0.6 },
        }
      );
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
      /* clipboard blocked: the address is visible to copy by hand */
    }
  };

  const reach = [
    { no: "01", label: "Email", value: site.email, href: `mailto:${site.email}`, ext: false },
    { no: "02", label: "Call / WhatsApp", value: site.phoneDisplay, href: whatsappLink(), ext: true },
    { no: "03", label: "Instagram", value: `@${site.instagram}`, href: `https://instagram.com/${site.instagram}`, ext: true },
    { no: "04", label: "LinkedIn", value: "Let's Cook Technologies", href: site.linkedin, ext: true },
  ];

  return (
    <section ref={root} id="contact" className={s.contact}>
      <div className="wrap">
        {/* heading */}
        <header className={s.head}>
          <p className={s.kicker}>
            <span className={s.dot} aria-hidden="true" />
            Contact
          </p>
          <h2 className={s.title} data-title>
            <span className="line">
              <span>Let&apos;s build</span>
            </span>
            <span className="line">
              <span>
                something <em>great.</em>
              </span>
            </span>
          </h2>
          <p className={s.lede}>
            Tell us what you have in mind. You get a reply within a day, usually with a couple of questions and an honest
            first estimate.
          </p>
        </header>

        <div className={s.body} data-body>
          {/* left: ways to reach us */}
          <div className={s.side}>
            <ol className={s.reach}>
              {reach.map((r) => (
                <li key={r.no} data-in>
                  <span className={s.no}>{r.no}</span>
                  <a href={r.href} {...(r.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    <small>{r.label}</small>
                    <strong className={r.no === "01" ? s.mail : ""}>
                      {r.no === "01" ? (
                        <>
                          letscooktechnologies
                          <wbr />
                          @gmail.com
                        </>
                      ) : (
                        r.value
                      )}
                    </strong>
                  </a>
                  {r.no === "01" ? (
                    <button type="button" className={s.copy} onClick={copyEmail}>
                      {copied ? "Copied" : "Copy"}
                    </button>
                  ) : (
                    <span className={s.arrow} aria-hidden="true">
                      ↗
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <p className={s.facts} data-in>
              <span>{site.location}</span>
              <span>Replies within a day</span>
              <span>Serving clients worldwide</span>
            </p>
          </div>

          {/* right: the order ticket */}
          <form className={s.ticket} onSubmit={onSubmit} noValidate data-in>
            <div className={s.ticketHead}>
              <span>New order</span>
              <span>Table: you</span>
            </div>

            <div className={s.fields}>
              <div className={s.three}>
                <Field id="name" label="Your name *" error={errors.name}>
                  <input id="name" name="name" autoComplete="name" required />
                </Field>
                <Field id="email" label="Email *" error={errors.email}>
                  <input id="email" name="email" type="email" autoComplete="email" required />
                </Field>
                <Field id="phone" label="Phone (optional)">
                  <input id="phone" name="phone" type="tel" autoComplete="tel" />
                </Field>
              </div>

              <div className={s.pair}>
                <fieldset className={s.group}>
                  <legend>What are we cooking?</legend>
                  <div className={s.chips}>
                    {needOptions.map((o) => (
                      <label key={o} className={s.chip}>
                        <input type="radio" name="need" value={o} />
                        <span>{o}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className={s.group}>
                  <legend>Rough budget</legend>
                  <div className={s.chips}>
                    {budgetOptions.map((o, i) => (
                      <label key={o} className={s.chip}>
                        <input type="radio" name="budget" value={o} defaultChecked={i === 0} />
                        <span>{o}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <Field id="idea" label="Tell us about the idea *" error={errors.idea}>
                <textarea id="idea" name="idea" rows={2} required />
              </Field>
            </div>

            <div className={s.ticketFoot}>
              <button className={s.send} type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send to the kitchen"} <span aria-hidden="true">↗</span>
              </button>
              <p className={s.note}>
                Prefer chat?{" "}
                <a href={whatsappLink("Hi Let's cook! I have an idea I'd like to talk about.")} target="_blank" rel="noopener noreferrer">
                  Message us on WhatsApp
                </a>
              </p>

              {status === "sent" && (
                <div className={s.notice} role="status">
                  <span>Thanks, your order reached the kitchen. We reply within a day. Want a faster answer?</span>
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
            </div>
          </form>
        </div>

        {/* footer sign-off */}
        <footer className={s.footer}>
          <nav className={s.links} aria-label="Footer">
            {navLinks.map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(l.id);
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <p className={s.mark} data-mark aria-label="Let's cook">
            {MARK.map((c, i) => (
              <span key={i} className={s.chMask} aria-hidden="true">
                <span data-ch className={i > 5 ? s.hot : ""}>
                  {c === " " ? " " : c}
                </span>
              </span>
            ))}
          </p>

          <div className={s.legal}>
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
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
          </div>
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
