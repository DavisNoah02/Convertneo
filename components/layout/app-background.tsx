"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import { DotPattern } from "@/components/ui/dot-pattern";
import { useTheme } from "@/components/layout/theme-provider";

type AppBackgroundProps = {
  children: ReactNode;
  /** Optional dot size so pages can slightly customize the look */
  dotSize?: number;
};

export function AppBackground({ children, dotSize = 2 }: AppBackgroundProps) {
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
    <div className="relative min-h-screen">
      <DotPattern
        key={theme}
        className="absolute inset-0 -z-10"
        dotSize={dotSize}
        gap={24}
        baseColor={dotPatternColors.baseColor}
        glowColor={dotPatternColors.glowColor}
        proximity={120}
        glowIntensity={1}
        waveSpeed={0.5}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

