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

  try {
    await saveContactMessage({
      name,
      email,
      message,
      ipAddress: ip,
      userAgent: req.headers.get("user-agent") || undefined,
    });
  } catch {
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }

  const contactEmail = process.env.CONTACT_EMAIL;
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!contactEmail || !resendApiKey) {
    return NextResponse.json(
      {
        success: true,
        message: "Message saved",
        warning: "Message stored, but email notifications are not configured.",
        rateLimit: {
          remaining: rateLimit.remaining,
        },
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
  }

  let emailFailed = false;

  try {
    const { error } = await resend.emails.send({
      from: "Convert-neo <onboarding@resend.dev>",
      to: contactEmail,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    emailFailed = Boolean(error);
  } catch {
    emailFailed = true;
  }

  if (emailFailed) {
    return NextResponse.json(
      {
        success: true,
        message: "Message saved",
        warning: "Message stored, but email delivery failed.",
        rateLimit: {
          remaining: rateLimit.remaining,
        },
      },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      },
    );
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
      status: 201,
      headers: {
        "X-RateLimit-Remaining": String(rateLimit.remaining),
      },
    },
  );
}
