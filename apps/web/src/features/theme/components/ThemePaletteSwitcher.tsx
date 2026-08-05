"use client"

import { Check, Moon, Palette, Sun } from "lucide-react"
import { useState } from "react"

import { AppButton } from "@/components/common/app-button"
import { Badge } from "@/components/ui/badge"
import type { ThemeColorMode, ThemePaletteId } from "@/features/theme/config/themePalettes"
import { getThemePalette, themePalettes } from "@/features/theme/config/themePalettes"
import { useAppTheme } from "@/features/theme/providers/appThemeProvider"
import { cn } from "@/lib/utils"

const themeModeOptions: { icon: typeof Sun; label: string; value: ThemeColorMode }[] = [
  { icon: Sun, label: "Jasny", value: "light" },
  { icon: Moon, label: "Ciemny", value: "dark" },
]

const previewTokenLabels = [
  { label: "Tło", token: "background" },
  { label: "Tekst", token: "foreground" },
  { label: "Karta", token: "card" },
  { label: "Primary", token: "primary" },
  { label: "Secondary", token: "secondary" },
  { label: "Accent", token: "accent" },
  { label: "Input", token: "input" },
  { label: "Border", token: "border" },
] as const

const ThemePaletteSwitcher = () => {
  const { activePaletteId, mode, setActivePaletteId, setMode } = useAppTheme()
  const [draftPaletteId, setDraftPaletteId] = useState<ThemePaletteId>()
  const [draftMode, setDraftMode] = useState<ThemeColorMode>()
  const selectedPaletteId = draftPaletteId ?? activePaletteId
  const selectedMode = draftMode ?? mode
  const selectedPalette = getThemePalette(selectedPaletteId)
  const hasChanges = selectedPaletteId !== activePaletteId || selectedMode !== mode

  const applyTheme = () => {
    setActivePaletteId(selectedPaletteId)
    setMode(selectedMode)
    setDraftPaletteId(undefined)
    setDraftMode(undefined)
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <Palette aria-hidden="true" className="size-4 text-primary" />
            <h3 className="font-heading text-xl font-medium">Personalizacja palety</h3>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Wybierz wariant kolorów i tryb interfejsu. Po zatwierdzeniu zmiana obejmie całą aplikację.
          </p>
        </div>
        <AppButton disabled={!hasChanges} onClick={applyTheme}>
          <Check aria-hidden="true" />
          Zastosuj
        </AppButton>
      </div>

      <div className="inline-grid w-fit grid-cols-2 gap-1 rounded-lg border border-border bg-muted p-1">
        {themeModeOptions.map((option) => {
          const Icon = option.icon
          const isSelected = option.value === selectedMode

          return (
            <button
              className={cn(
                "flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                isSelected ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              key={option.value}
              onClick={() => setDraftMode(option.value)}
              type="button"
            >
              <Icon aria-hidden="true" className="size-4" />
              {option.label}
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 lg:grid-cols-5">
        {themePalettes.map((palette) => {
          const isActive = palette.id === activePaletteId
          const isSelected = palette.id === selectedPaletteId

          return (
            <button
              className={cn(
                "grid min-h-48 gap-4 rounded-lg border bg-card p-4 text-left text-card-foreground transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
                isSelected
                  ? "border-primary shadow-sm ring-1 ring-primary/20"
                  : "border-border hover:border-primary/55 hover:bg-primary/5"
              )}
              key={palette.id}
              onClick={() => setDraftPaletteId(palette.id)}
              type="button"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="grid gap-1">
                  <span className="font-medium">{palette.name}</span>
                  {isActive ? (
                    <Badge variant="secondary" className="w-fit">
                      Aktywna
                    </Badge>
                  ) : null}
                </div>
                {isSelected ? (
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check aria-hidden="true" className="size-4" />
                  </span>
                ) : null}
              </div>

              <div className="grid grid-cols-4 overflow-hidden rounded-md border border-border">
                {palette.swatches.map((swatch) => (
                  <span
                    aria-hidden="true"
                    className="h-12"
                    key={swatch}
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </div>

              <p className="text-sm leading-6 text-muted-foreground">{palette.description}</p>
            </button>
          )
        })}
      </div>

      <div className="grid gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-medium">Podgląd tokenów</p>
          <Badge variant="outline" className="w-fit">
            {selectedMode === "dark" ? "Dark" : "Light"}
          </Badge>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {previewTokenLabels.map((item) => (
            <div className="flex items-center gap-3 rounded-md border border-border bg-background p-3" key={item.token}>
              <span
                aria-hidden="true"
                className="size-8 shrink-0 rounded-full border border-border"
                style={{ backgroundColor: selectedPalette.tokens[selectedMode][item.token] }}
              />
              <div className="min-w-0">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="truncate text-xs text-muted-foreground">{item.token}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { ThemePaletteSwitcher }
