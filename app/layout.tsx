import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Toaster} from "sonner";
import Footer from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
// import ScrollToTop from "@/components/scroll-to-top";
import ThemeToggle from "@/components/layout/theme-toggle";
import { LogoImage } from "@/components/logo-image";
// import Demo from"@/components/layout/demo";
import BottomDock from "@/components/layout/bottom-dock";




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Convert-neo App",
  description: "Converting images, audio, and video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <div className="fixed left-8 top-4 z-50">
            <LogoImage />
          </div>
          
          <ThemeToggle />
          <div className="pt-16">{children}</div>
          {/* <Demo/> */}
          <BottomDock />
          <Footer />
          {/* <ScrollToTop /> */}
        </ThemeProvider>

        <Toaster
          position="bottom-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}
