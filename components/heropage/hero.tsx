"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";

import { useTheme } from "@/components/layout/theme-provider";
import { StarButton } from "@/components/ui/star-button";
import ShinyText from "@/components/ui/ShinyText";
import { BorderBeam } from "@/components/ui/border-beam";

/* ---------------- Cards Data ---------------- */

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
    body: "Hit convert and instantly download the result. No sign-ups, limits, or watermarks.",
  },
];

/* ---------------- Ripple Component ---------------- */

function RippleButton({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme: string;
}) {
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([]);

  function createRipple(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) =>
        prev.filter((r) => r.id !== id),
      );
    }, 600);
  }

  return (
    <div
      onClick={createRipple}
      className="relative overflow-hidden rounded-lg"
    >
      {children}

      {/* Ripples */}
      {ripples.map((r) => (
        <span
          key={r.id}
          style={{
            left: r.x,
            top: r.y,
          }}
          className={`absolute h-24 w-24 -translate-x-1/2 -translate-y-1/2 animate-ripple rounded-full
            ${
              theme === "dark"
                ? "bg-white/30"
                : "bg-rose-500/30"
            }
          `}
        />
      ))}
    </div>
  );
}

/* ---------------- Hero Component ---------------- */

export default function Hero() {
  const { theme } = useTheme();

  // Star glow color
  const lightColor =
    theme === "dark" ? "#FAFAFA" : "#FF2056";

  return (
    <div className="flex w-full flex-col items-center gap-8 text-center">
      {/* ================= Header ================= */}
      <div className="space-y-4">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-emerald-500/30"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
          Engine ready • Local conversion
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        >
          <ShinyText
            text="✨ Convert your media in seconds."
            speed={2}
            delay={0}
            color="#b5b5b5"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </motion.h1>

        {/* Description */}
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

        {/* ================= CTA ================= */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-4 flex items-center justify-center gap-3"
        >
          {/* Animated Wrapper */}
          <motion.div
            whileHover={{
              scale: 1.05,
              boxShadow:
                theme === "dark"
                  ? "0 0 25px rgba(250,250,250,0.4)"
                  : "0 0 25px rgba(255,32,86,0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
            }}
            className="relative"
          >
            <StarButton
              lightColor={lightColor}
              className="group relative overflow-hidden rounded-lg"
            >
              <RippleButton theme={theme}>
                <Link
                  href="/converter"
                  prefetch
                  className={`relative z-10 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium transition-colors
                    ${
                      theme === "dark"
                        ? "text-white"
                        : "text-zinc-900"
                    }
                  `}
                >
                  Open converter
                </Link>
              </RippleButton>
            </StarButton>
          </motion.div>

          <span className="hidden text-xs text-muted-foreground sm:inline">
            No uploads • No limits • Free
          </span>
        </motion.div>
      </div>

      {/* ================= Cards ================= */}
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

              <p className="text-xs text-muted-foreground">
                {card.body}
              </p>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}