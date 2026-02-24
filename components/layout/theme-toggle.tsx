"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/layout/theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur">
      <span className="hidden text-[11px] font-medium sm:inline">
        {isDark ? "Dark" : "Light"} mode
      </span>
      <button
        type="button"
        onClick={toggleTheme}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-card text-foreground shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
        // aria-label="Toggle color theme"
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-300" />
        ) : (
          <Moon className="h-4 w-4 text-sky-500" />
        )}
      </button>
    </div>
  );
}

