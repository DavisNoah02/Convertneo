'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AppBackground } from '@/components/layout/app-background'
import Link from "next/link";
import { ArrowLeft } from 'lucide-react'

/* ---------- Zod schema ---------- */
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type FormData = z.infer<typeof schema>

/* ---------- Page ---------- */
export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <AppBackground dotSize={2}>

      
    <section className="flex min-h-[80vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
    <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
          <ArrowLeft className="h-4 w-4" />
           Back to home
      </Link>
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Contact Support
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Have a question or issue? We&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-neutral-100/50 dark:bg-zinc-900/60 backdrop-blur-md p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Your name"
                {...register('name')}
                className="bg-white/60 dark:bg-zinc-800/60"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                className="bg-white/60 dark:bg-zinc-800/60"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-1.5">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question..."
                rows={5}
                {...register('message')}
                className="bg-white/60 dark:bg-zinc-800/60 resize-none"
              />
              {errors.message && (
                <p className="text-xs text-red-500">{errors.message.message}</p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full hover:cursor-pointer"
            >
              {status === 'loading' ? 'Sending…' : 'Send message'}
            </Button>

            {/* Feedback */}
            {status === 'success' && (
              <p className="text-center text-sm text-emerald-600 dark:text-emerald-400">
                ✓ Message sent! We&apos;ll be in touch shortly.
              </p>
            )}
            {status === 'error' && (
              <p className="text-center text-sm text-red-500">
                Something went wrong. Please try again.
              </p>
            )}

          </form>
        </div>
      </div>
    </section>
    </AppBackground>
  )
}