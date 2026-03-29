"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "theme";
const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";

function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

function getPreferredTheme(): Theme {
  const stored = readStoredTheme();
  if (stored) {
    return stored;
  }

  if (typeof window === "undefined") return "light";

  const prefersDark = window.matchMedia?.(
    THEME_MEDIA_QUERY,
  ).matches;

  return prefersDark ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(THEME_MEDIA_QUERY);
  const handleChange = () => callback();

  window.addEventListener("storage", handleChange);
  window.addEventListener("theme-change", handleChange);
  mediaQuery.addEventListener("change", handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener("theme-change", handleChange);
    mediaQuery.removeEventListener("change", handleChange);
  };
}

function persistTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new Event("theme-change"));
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    subscribeToTheme,
    getPreferredTheme,
    () => "light",
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme: () =>
        persistTheme(theme === "dark" ? "light" : "dark"),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return ctx;
}

