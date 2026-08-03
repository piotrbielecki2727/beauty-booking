"use client"

import { CalendarDays, Check, Clock } from "lucide-react"

import { EmptyState } from "@/components/common/empty-state"
import { ErrorState } from "@/components/common/error-state"
import { LoadingState } from "@/components/common/loading-state"
import { Badge } from "@/components/ui/badge"
import type { BookingTimeSlot } from "@/features/booking/types/time-slot"
import { cn } from "@/lib/utils"

type DateTimePickerProps = {
  className?: string
  errorMessage?: string
  isError?: boolean
  isLoading?: boolean
  onTimeSlotSelect: (timeSlotId: string) => void
  selectedTimeSlotId?: string
  timeSlots: BookingTimeSlot[]
}

const DateTimePicker = ({
  className,
  errorMessage,
  isError = false,
  isLoading = false,
  onTimeSlotSelect,
  selectedTimeSlotId,
  timeSlots,
}: DateTimePickerProps) => {
  if (isLoading) {
    return <LoadingState className={className} message="Ładowanie terminów" variant="skeleton" />
  }

  if (isError) {
    return (
      <ErrorState
        className={className}
        description={errorMessage ?? "Spróbuj odświeżyć stronę albo wybierz inną usługę."}
        title="Nie udało się wyświetlić terminów"
      />
    )
  }

  if (timeSlots.length === 0) {
    return (
      <EmptyState
        className={className}
        description="Wybierz inną usługę lub wróć później, aby sprawdzić nowe dostępne godziny."
        icon={<CalendarDays aria-hidden="true" />}
        title="Brak wolnych terminów"
      />
    )
  }

  const groupedSlots = groupTimeSlotsByDate(timeSlots)

  return (
    <div className={cn("grid gap-4", className)} role="radiogroup" aria-label="Wybór terminu">
      {groupedSlots.map((group) => (
        <section className="grid gap-2" key={group.dateValue}>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{group.dateLabel}</Badge>
            <span className="text-sm text-muted-foreground">{group.dateValue}</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {group.slots.map((slot) => {
              const isSelected = slot.id === selectedTimeSlotId

              return (
                <button
                  aria-checked={isSelected}
                  className={cn(
                    "flex min-h-16 w-full cursor-pointer items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-left text-card-foreground transition-colors hover:border-primary/45 hover:bg-accent/20 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
                    isSelected ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border"
                  )}
                  key={slot.id}
                  onClick={() => onTimeSlotSelect(slot.id)}
                  role="radio"
                  type="button"
                >
                  <span className="inline-flex items-center gap-2">
                    <Clock aria-hidden="true" className="size-4 text-primary" />
                    <span className="font-medium">
                      {slot.startTime} - {slot.endTime}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-transparent"
                    )}
                  >
                    <Check className="size-4" />
                  </span>
                </button>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

const groupTimeSlotsByDate = (timeSlots: BookingTimeSlot[]) => {
  return timeSlots.reduce<Array<{ dateLabel: string; dateValue: string; slots: BookingTimeSlot[] }>>((groups, slot) => {
    const existingGroup = groups.find((group) => group.dateValue === slot.dateValue)

    if (existingGroup) {
      existingGroup.slots.push(slot)
      return groups
    }

    groups.push({
      dateLabel: slot.dateLabel,
      dateValue: slot.dateValue,
      slots: [slot],
    })

    return groups
  }, [])
}

export { DateTimePicker }
export type { DateTimePickerProps }
