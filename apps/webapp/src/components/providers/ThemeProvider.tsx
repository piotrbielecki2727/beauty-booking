"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import type { ThemeProviderProps as NextThemeProviderProperties } from "next-themes";

type ThemeProviderProperties = NextThemeProviderProperties;

export const ThemeProvider = ({
  children,
  ...props
}: ThemeProviderProperties) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
