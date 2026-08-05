import type { Metadata } from "next";
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";

import { AccountProvider } from "@/features/account/providers/accountProvider";
import { AuthProvider } from "@/features/auth/providers/authProvider";
import { AppThemeProvider } from "@/features/theme/providers/appThemeProvider";
import { cn } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  display: "swap",
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  display: "swap",
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beauty Booking",
  description: "System rezerwacji dla branży beauty.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="pl"
      className={cn(
        "h-full antialiased font-sans",
        inter.variable,
        playfair.variable,
        geistMono.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppThemeProvider>
          <AuthProvider>
            <AccountProvider>{children}</AccountProvider>
          </AuthProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
