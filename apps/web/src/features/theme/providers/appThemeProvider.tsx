"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"

import {
  defaultThemePaletteId,
  getThemePalette,
  type ThemeColorMode,
  type ThemePaletteId,
} from "@/features/theme/config/themePalettes"

type AppThemeContextValue = {
  activePaletteId: ThemePaletteId
  mode: ThemeColorMode
  setActivePaletteId: (paletteId: ThemePaletteId) => void
  setMode: (mode: ThemeColorMode) => void
}

type AppThemeProviderProps = {
  children: ReactNode
}

const paletteStorageKey = "beauty-booking:theme-palette"
const themeModeStorageKey = "beauty-booking:theme-mode"
const AppThemeContext = createContext<AppThemeContextValue | undefined>(undefined)

const getStoredPaletteId = () => {
  if (typeof window === "undefined") {
    return defaultThemePaletteId
  }

  const storedPaletteId = window.localStorage.getItem(paletteStorageKey)

  return getThemePalette(storedPaletteId).id
}

const getStoredMode = () => {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.localStorage.getItem(themeModeStorageKey) === "dark" ? "dark" : "light"
}

const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const [activePaletteId, setActivePaletteIdState] = useState<ThemePaletteId>(defaultThemePaletteId)
  const [mode, setModeState] = useState<ThemeColorMode>("light")

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setActivePaletteIdState(getStoredPaletteId())
      setModeState(getStoredMode())
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [])

  useEffect(() => {
    const palette = getThemePalette(activePaletteId)
    const root = document.documentElement

    root.dataset.palette = palette.id
    root.classList.toggle("dark", mode === "dark")

    Object.entries(palette.tokens[mode]).forEach(([tokenName, tokenValue]) => {
      root.style.setProperty(`--${tokenName}`, tokenValue)
    })
  }, [activePaletteId, mode])

  const setActivePaletteId = useCallback((paletteId: ThemePaletteId) => {
    setActivePaletteIdState(paletteId)
    try {
      window.localStorage.setItem(paletteStorageKey, paletteId)
    } catch {
      return
    }
  }, [])

  const setMode = useCallback((nextMode: ThemeColorMode) => {
    setModeState(nextMode)

    try {
      window.localStorage.setItem(themeModeStorageKey, nextMode)
    } catch {
      return
    }
  }, [])

  const value = useMemo<AppThemeContextValue>(
    () => ({
      activePaletteId,
      mode,
      setActivePaletteId,
      setMode,
    }),
    [activePaletteId, mode, setActivePaletteId, setMode]
  )

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
}

const useAppTheme = () => {
  const context = useContext(AppThemeContext)

  if (!context) {
    throw new Error("useAppTheme must be used within AppThemeProvider")
  }

  return context
}

export { AppThemeProvider, paletteStorageKey, themeModeStorageKey, useAppTheme }
export type { AppThemeContextValue, AppThemeProviderProps }
