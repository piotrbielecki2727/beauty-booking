import { Geist_Mono, Manrope } from "next/font/google";
import "./globals.css";

import { AppProviders } from "@/components/providers/AppProviders";
import { cn } from "@/lib/utils";
import { ACTIVE_THEME } from "@/theme";

import type { Metadata } from "next";
import type { ReactNode } from "react";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Beauty Booking",
  description: "Beauty booking application",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="pl"
      suppressHydrationWarning
      data-palette={ACTIVE_THEME}
      className={cn(
        "h-full antialiased font-sans",
        geistMono.variable,
        manrope.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
