"use client"

import { CheckCircle2 } from "lucide-react"

import type { BookingStep, BookingStepItem } from "@/features/booking/types/flow"
import { cn } from "@/lib/utils"

type BookingStepHeaderProps = {
  canOpenStep: (step: BookingStep) => boolean
  currentStep: BookingStep
  onStepSelect: (step: BookingStep) => void
  steps: BookingStepItem[]
}

const BookingStepHeader = ({ canOpenStep, currentStep, onStepSelect, steps }: BookingStepHeaderProps) => {
  const currentIndex = steps.findIndex((step) => step.id === currentStep)
  const desktopGridClass = steps.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-5"

  return (
    <ol
      className={cn("grid gap-2 sm:grid-cols-2", desktopGridClass)}
      aria-label="Postęp rezerwacji"
    >
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isComplete = index < currentIndex
        const canOpen = canOpenStep(step.id)

        return (
          <li key={step.id}>
            <button
              className={cn(
                "group/step flex min-h-11 w-full items-center gap-2 rounded-lg border px-3 text-left text-sm font-medium transition-colors disabled:cursor-default focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
                isActive
                  ? "cursor-pointer border-primary bg-primary text-primary-foreground shadow-sm hover:border-primary hover:bg-primary/90"
                  : isComplete
                    ? "cursor-pointer border-primary/30 bg-primary/5 text-foreground hover:border-primary/60 hover:bg-primary/10"
                    : canOpen
                      ? "cursor-pointer border-border bg-card text-muted-foreground hover:border-primary/55 hover:bg-primary/8 hover:text-foreground"
                      : "cursor-default border-border bg-card text-muted-foreground opacity-55"
              )}
              disabled={!canOpen}
              onClick={() => onStepSelect(step.id)}
              type="button"
            >
              <StepIndicator canOpen={canOpen} index={index} isActive={isActive} isComplete={isComplete} />
              {step.label}
            </button>
          </li>
        )
      })}
    </ol>
  )
}

type StepIndicatorProps = {
  canOpen: boolean
  index: number
  isActive: boolean
  isComplete: boolean
}

const StepIndicator = ({ canOpen, index, isActive, isComplete }: StepIndicatorProps) => {
  const className = cn(
    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs transition-colors",
    isComplete
      ? "bg-primary text-primary-foreground"
      : isActive
        ? "bg-primary-foreground text-primary"
        : canOpen
          ? "border border-primary/25 bg-background text-primary group-hover/step:border-primary group-hover/step:bg-primary group-hover/step:text-primary-foreground"
          : "bg-muted text-muted-foreground"
  )

  if (isComplete) {
    return (
      <span aria-hidden="true" className={className}>
        <CheckCircle2 aria-hidden="true" className="size-4" />
      </span>
    )
  }

  return (
    <span aria-hidden="true" className={className}>
      {index + 1}
    </span>
  )
}

export { BookingStepHeader }
export type { BookingStepHeaderProps }
