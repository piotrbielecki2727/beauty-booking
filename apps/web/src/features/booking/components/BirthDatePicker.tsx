"use client"

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  formatDisplayDate,
  formatIsoDate,
  getCalendarDays,
  getInitialViewDate,
  getToday,
  minimumYear,
  monthNames,
  parseIsoDate,
  weekDayLabels,
} from "@/features/booking/utils/birthDatePickerCalendar"
import { cn } from "@/lib/utils"

type BirthDatePickerProps = {
  "aria-describedby"?: string
  "aria-invalid"?: boolean | "false" | "true"
  id?: string
  name?: string
  onBlur?: () => void
  onChange: (value: string) => void
  required?: boolean
  value: string
}

const BirthDatePicker = ({
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  id,
  name,
  onBlur,
  onChange,
  required,
  value,
}: BirthDatePickerProps) => {
  const [today] = useState(() => getToday())
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => getInitialViewDate(value))
  const isInvalid = invalid === true || invalid === "true"
  const years = useMemo(
    () => Array.from({ length: today.getFullYear() - minimumYear + 1 }, (_, index) => today.getFullYear() - index),
    [today]
  )
  const selectedDate = parseIsoDate(value)
  const { emptyDays, monthDays } = getCalendarDays(viewDate, today)

  const changeMonth = (offset: number) => {
    setViewDate((currentDate) => new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1))
  }

  const changeViewMonth = (month: number) => {
    setViewDate((currentDate) => new Date(currentDate.getFullYear(), month, 1))
  }

  const changeViewYear = (year: number) => {
    setViewDate((currentDate) => new Date(year, currentDate.getMonth(), 1))
  }

  const selectDate = (date: Date) => {
    onChange(formatIsoDate(date))
    setIsOpen(false)
    onBlur?.()
  }

  const handleOpenChange = (nextOpen: boolean) => {
    const nextDate = parseIsoDate(value)

    setIsOpen(nextOpen)

    if (nextOpen && nextDate) {
      setViewDate(nextDate)
    }

    if (!nextOpen) {
      onBlur?.()
    }
  }

  return (
    <Popover
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <input name={name} readOnly required={required} type="hidden" value={value} />
      <PopoverTrigger
        aria-describedby={describedBy}
        aria-invalid={invalid}
        className={cn(
          "flex h-9 w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-left text-base transition-[color,box-shadow,background-color] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 md:text-sm",
          isInvalid && "border-destructive ring-3 ring-destructive/20",
          !value && "text-muted-foreground"
        )}
        id={id}
        type="button"
      >
        <span>{formatDisplayDate(value)}</span>
        <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-primary" />
      </PopoverTrigger>

      <PopoverContent className="w-[min(calc(100vw-2rem),22rem)]">
        <div className="flex items-center justify-between gap-2">
          <Button
            aria-label="Poprzedni miesiąc"
            onClick={() => changeMonth(-1)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronLeft aria-hidden="true" />
          </Button>

          <div className="grid flex-1 grid-cols-[1fr_5.5rem] gap-2">
            <select
              aria-label="Miesiąc"
              className="h-9 rounded-3xl border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              onChange={(event) => changeViewMonth(Number(event.target.value))}
              value={viewDate.getMonth()}
            >
              {monthNames.map((month, index) => (
                <option key={month} value={index}>
                  {month}
                </option>
              ))}
            </select>

            <select
              aria-label="Rok"
              className="h-9 rounded-3xl border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30"
              onChange={(event) => changeViewYear(Number(event.target.value))}
              value={viewDate.getFullYear()}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <Button
            aria-label="Następny miesiąc"
            disabled={new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1) > today}
            onClick={() => changeMonth(1)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weekDayLabels.map((dayLabel) => (
            <span className="grid h-8 place-items-center text-xs font-medium text-muted-foreground" key={dayLabel}>
              {dayLabel}
            </span>
          ))}
          {emptyDays.map((_, index) => (
            <span aria-hidden="true" className="h-9" key={`empty-${index}`} />
          ))}
          {monthDays.map((calendarDay) => {
            const isSelected = selectedDate ? formatIsoDate(selectedDate) === calendarDay.key : false

            return (
              <Button
                aria-pressed={isSelected}
                className={cn(
                  "h-9 rounded-full px-0",
                  isSelected && "bg-primary text-primary-foreground hover:bg-primary"
                )}
                disabled={calendarDay.disabled}
                key={calendarDay.key}
                onClick={() => selectDate(calendarDay.date)}
                type="button"
                variant={isSelected ? "default" : "ghost"}
              >
                {calendarDay.day}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { BirthDatePicker }
export type { BirthDatePickerProps }
