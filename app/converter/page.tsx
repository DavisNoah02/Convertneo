"use client";

import dynamic from "next/dynamic";
import { AppBackground } from "@/components/layout/app-background";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Converter = dynamic(
  () =>
    import("@/components/converter/converter").then((mod) => mod.Converter),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-muted-foreground">Loading converter…</p>
    ),
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
