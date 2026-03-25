import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const { error } = await resend.emails.send({
    from: 'Convert-neo <onboarding@resend.dev>', // use your domain once verified
    to: process.env.CONTACT_EMAIL!,
    subject: `New message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}