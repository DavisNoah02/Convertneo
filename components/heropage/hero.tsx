
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BorderBeam } from "@/components/ui/border-beam";

const howItWorksCards = [
  {
    title: "1. Drop your files",
    body: "Drag images, audio, or video straight into the browser. Nothing ever leaves your device.",
  },
  {
    title: "2. Pick a format",
    body: "Choose from modern formats like MP4, WebP, and MP3, or classic ones like JPG and WAV.",
  },
  {
    title: "3. Convert & download",
    body: "Hit convert and instantly download the result. No sign‑ups, limits, or watermarks.",
  },
];

export default function Hero() {
  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          Engine ready • Local conversion
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          Convert your media in seconds.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base"
        >
          Your files, your browser. Convert images, audio, and video with zero
          server uploads and total privacy. Unlimited, secure, and instant with{" "}
          <span className="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary">
            Convert-neo
          </span>
          .
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 flex items-center justify-center gap-3"
        >
          <Link
            href="/converter"
            prefetch
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90"
          >
            Open converter
          </Link>
          <span className="hidden text-xs text-muted-foreground sm:inline">
            No uploads • No limits • Free
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="grid w-full max-w-3xl gap-4 sm:grid-cols-3"
      >
        {howItWorksCards.map((card) => (
          <div
            key={card.title}
            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-[1px]"
          >
           
            <div className="relative z-10 h-full rounded-2xl bg-background/95 px-4 py-5 text-left shadow-sm">
              <h3 className="mb-1 text-sm font-semibold text-foreground">
                {card.title}
              </h3>
              <p className="text-xs text-muted-foreground">{card.body}</p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}



