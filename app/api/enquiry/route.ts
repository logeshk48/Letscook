import { NextResponse } from "next/server";
import { site } from "@/content/site";

/**
 * POST /api/enquiry
 * Sends the contact form to your inbox using Resend (https://resend.com).
 * Set RESEND_API_KEY in .env.local (and in Vercel → Settings → Environment Variables).
 * Without a key it returns 503, and the form falls back to WhatsApp.
 */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 120);
  const email = (body.email ?? "").trim().slice(0, 200);
  const idea = (body.idea ?? "").trim().slice(0, 5000);
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !idea) {
    return NextResponse.json({ error: "Name, a valid email and the idea are required." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Email not configured" }, { status: 503 });
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${body.phone || "-"}`,
    `Need: ${body.need || "-"}`,
    `Budget: ${body.budget || "-"}`,
    "",
    idea,
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_FROM ?? "Let's cook website <onboarding@resend.dev>",
      to: [process.env.ENQUIRY_TO ?? site.email],
      reply_to: email,
      subject: `New enquiry from ${name}`,
      text: lines,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Could not send right now" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
