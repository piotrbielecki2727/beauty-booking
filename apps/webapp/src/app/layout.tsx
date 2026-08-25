import {
  Geist_Mono,
  GFS_Didot,
  Bodoni_Moda,
  Manrope,
  Pacifico,
  Nunito,
  Raleway,
  Lora,
  Cormorant_Garamond,
} from "next/font/google";
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

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const gfsDidot = GFS_Didot({
  variable: "--font-gfs-didot",
  subsets: ["latin"],
  weight: "400",
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin", "latin-ext"],
  weight: "400",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin", "latin-ext"],
  weight: "400",
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
        pacifico.variable,
        nunito.variable,
        raleway.variable,
        lora.variable,
        gfsDidot.variable,
        bodoniModa.variable,
        cormorantGaramond.variable,
      )}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
