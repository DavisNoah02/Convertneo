import { AppBackground } from "@/components/layout/app-background";
import Hero from "@/components/heropage/hero";

export default function Home() {
  return (
    <AppBackground dotSize={2}>
      <main className="flex min-h-screen flex-col items-center justify-center px-6">
        <Hero />
      </main>
    </AppBackground>
  );
}