import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lightmark - Photography Notes",
  description:
    "Take note whatever stirs your soul — a color that lifts your spirits, sunlight slipping through a crack in the door, or the fleeting hue of a drifting puff of smoke.",
  keywords: [
    "photography",
    "presets",
    "color profiles",
    "lightroom",
    "photo editing",
  ],
  authors: [{ name: "Bao LE" }],
  creator: "Bao LE",
  openGraph: {
    title: "Lightmark - Photography Notes",
    description: "Professional photography note-taking and organization app",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lightmark - Photography Notes",
    description: "Professional photography note-taking and organization app",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <KeyboardShortcuts />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
