
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../components/theme-provider";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useMemo } from "react";

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  const dotPatternColors = useMemo(
    () => ({
      baseColor: isDark ? "#404040" : "#d4d4d4",
      glowColor: isDark ? "#22d3ee" : "#10b981",
    }),
    [isDark]
  );

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <DotPattern
        key={theme}
        className="absolute inset-0 -z-10"
        dotSize={2}
        gap={24}
        baseColor={dotPatternColors.baseColor}
        glowColor={dotPatternColors.glowColor}
        proximity={120}
        glowIntensity={1}
        waveSpeed={0.5}
      />
        <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
          <span className="hidden text-[11px] font-medium sm:inline">
            {isDark ? "Dark" : "Light"} mode
          </span>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-card text-foreground shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
            aria-label="Toggle color theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-300" />
            ) : (
              <Moon className="h-4 w-4 text-sky-500" />
            )}
          </button>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-lg text-center text-muted-foreground"
        >
          Your files, your browser. Convert images, audio, and video with zero
          server uploads and total privacy. Unlimited, secure, and instant with{" "}
          <span className="font-semibold text-emerald-600 hover:text-emerald-400 dark:text-primary">
            Convert-neo 😍
          </span>
          .
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <Link
            href="/converter"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Open converter
          </Link>
        </motion.div>
    </main>
  );
}

