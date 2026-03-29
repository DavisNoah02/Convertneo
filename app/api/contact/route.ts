import { NextResponse } from "next/server";
import { Resend } from "resend";

import { saveContactMessage } from "@/lib/server/contact-message-store";
import { getClientIp, rateLimitByKey } from "@/lib/server/rate-limit";
import { contactSchema } from "@/lib/validations/contact";

const resend = new Resend(process.env.RESEND_API_KEY);

const CONTACT_RATE_LIMIT = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
};

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = rateLimitByKey(`contact:${ip}`, CONTACT_RATE_LIMIT);

  if (!rateLimit.allowed) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
    );

    return NextResponse.json(
      {
        error: "Too many requests. Please wait before sending another message.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfterSec),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid request body",
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const { name, email, message } = parsed.data;

  await saveContactMessage({
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
    ipAddress: ip,
    userAgent: req.headers.get("user-agent") || undefined,
  });

  const contactEmail = process.env.CONTACT_EMAIL;
  if (!contactEmail || !process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: "Email service is not configured" },
      { status: 500 },
    );
  }

  const { error } = await resend.emails.send({
    from: "Convert-neo <onboarding@resend.dev>",
    to: contactEmail,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      message: "Message received",
      rateLimit: {
        remaining: rateLimit.remaining,
      },
    },
    {
      headers: {
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    },
  );
}
