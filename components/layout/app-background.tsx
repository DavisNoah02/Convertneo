"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/components/layout/theme-provider";
import DotGrid from "@/components/ui/DotGrid";

type AppBackgroundProps = {
  children: ReactNode;
  dotSize?: number;
};

export function AppBackground({ children, dotSize = 5 }: AppBackgroundProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="relative min-h-screen">
      {/* DotGrid must sit in a positioned container with explicit dimensions */}
      <div
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
        aria-hidden="true"
      >
        <DotGrid
          dotSize={dotSize}
          gap={16}
          baseColor={isDark ? "#271E37" : "#e2e8f0"}
          activeColor={isDark ? "#25e218" : "#10b981"}
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
        />
      </div>

      {/* Page content sits above the grid */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}