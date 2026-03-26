import { AppBackground } from "@/components/layout/app-background";
import Link from "next/link";
import { ArrowLeft, Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <AppBackground dotSize={2}>
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-500">
          <Settings className="h-3.5 w-3.5" />
          Settings
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Settings Coming Soon
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          This page is ready for preferences like default conversion format,
          quality presets, and notification options.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg border bg-background/70 px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
      </main>
    </AppBackground>
  );
}
