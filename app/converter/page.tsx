"use client";

import dynamic from "next/dynamic";
import { AppBackground } from "@/components/layout/app-background";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function ConverterSkeleton() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-3">
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-foreground/50"
            style={{
              animation: "wave 1.2s ease-in-out infinite",
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground tracking-wide">Loading</p>
      <style>{`
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

const Converter = dynamic(
  () =>
    import("@/components/converter/converter").then((mod) => mod.Converter),
  {
    ssr: false,
    loading: () => <ConverterSkeleton />,
  }
);

export default function ConverterPage() {
  return (
    <AppBackground dotSize={3}>
      <main className="px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <h1 className="mb-2 text-2xl font-semibold text-foreground">
            Convert
          </h1>
          <p className="mb-8 text-muted-foreground">
            Drag a file, pick output format, then convert and download.
          </p>
          <Converter />
        </div>
      </main>
    </AppBackground>
  );
}