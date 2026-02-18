"use client";

import { Converter } from "@/components/converter";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useTheme } from "@/components/theme-provider";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ConverterPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const dotPatternColors = useMemo(
    () => ({
      baseColor: isDark ? "#404040" : "#d4d4d4",
      glowColor: isDark ? "#22d3ee" : "#10b981",
    }),
    [isDark]
  );

  return (
    <main className="relative min-h-screen px-4 py-8 sm:px-6">
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
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Convert
          </h1>
          <p className="text-muted-foreground mb-8">
            Drag a file, pick output format, then convert and download.
          </p>
          <Converter />
        </div>
    </main>
  );
}
