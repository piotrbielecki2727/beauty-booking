"use client"

import { Minus, Plus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type AppNumberInputProps = {
  className?: string
  disabled?: boolean
  max?: number
  min?: number
  onChange: (value: number) => void
  step?: number
  value: number
}

const clampNumber = (value: number, min?: number, max?: number) => {
  if (typeof min === "number" && value < min) {
    return min
  }

  if (typeof max === "number" && value > max) {
    return max
  }

  return value
}

const AppNumberInput = ({
  className,
  disabled = false,
  max,
  min,
  onChange,
  step = 1,
  value,
}: AppNumberInputProps) => {
  const updateValue = (nextValue: number) => onChange(clampNumber(nextValue, min, max))
  const decrease = () => updateValue(value - step)
  const increase = () => updateValue(value + step)

  return (
    <div
      className={cn(
        "grid h-9 grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] overflow-hidden rounded-3xl border border-border/70 bg-input/45 transition-colors focus-within:border-primary/70 focus-within:ring-2 focus-within:ring-primary/20 hover:border-primary/35",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <button
        className="grid cursor-pointer place-items-center border-r border-border/70 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:cursor-default disabled:opacity-40"
        disabled={disabled || (typeof min === "number" && value <= min)}
        onClick={decrease}
        type="button"
      >
        <Minus aria-hidden="true" className="size-3.5" />
      </button>
      <Input
        className="h-full rounded-none border-0 bg-transparent px-2 text-center shadow-none ring-0 [appearance:textfield] focus-visible:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        disabled={disabled}
        inputMode="numeric"
        onChange={(event) => {
          const numericValue = Number(event.target.value.replace(/\D/g, ""))

          if (!Number.isNaN(numericValue)) {
            updateValue(numericValue)
          }
        }}
        type="text"
        value={String(value)}
      />
      <button
        className="grid cursor-pointer place-items-center border-l border-border/70 text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary disabled:cursor-default disabled:opacity-40"
        disabled={disabled || (typeof max === "number" && value >= max)}
        onClick={increase}
        type="button"
      >
        <Plus aria-hidden="true" className="size-3.5" />
      </button>
    </div>
  )
}

export { AppNumberInput }
export type { AppNumberInputProps }
