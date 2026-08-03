"use client"

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

type CalendarDay = {
  date: Date
  day: number
  disabled: boolean
  key: string
}

const monthNames = [
  "Styczeń",
  "Luty",
  "Marzec",
  "Kwiecień",
  "Maj",
  "Czerwiec",
  "Lipiec",
  "Sierpień",
  "Wrzesień",
  "Październik",
  "Listopad",
  "Grudzień",
] as const

const weekDayLabels = ["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"] as const
const minimumYear = 1900
const defaultAgeOffset = 25

const getToday = () => {
  const today = new Date()

  return new Date(today.getFullYear(), today.getMonth(), today.getDate())
}

const formatIsoDate = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const parseIsoDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  const date = new Date(year, month - 1, day)

  if (formatIsoDate(date) !== value) {
    return undefined
  }

  return date
}

const formatDisplayDate = (value: string) => {
  const date = parseIsoDate(value)

  if (!date) {
    return "Wybierz datę"
  }

  return date.toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

const getInitialViewDate = (value: string) => {
  const selectedDate = parseIsoDate(value)

  if (selectedDate) {
    return selectedDate
  }

  const today = getToday()

  return new Date(today.getFullYear() - defaultAgeOffset, 0, 1)
}

const getCalendarDays = (viewDate: Date, today: Date) => {
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const firstWeekDayOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const emptyDays = Array.from<undefined>({ length: firstWeekDayOffset })
  const monthDays: CalendarDay[] = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    const date = new Date(year, month, day)

    return {
      date,
      day,
      disabled: date > today || year < minimumYear,
      key: formatIsoDate(date),
    }
  })

  return { emptyDays, monthDays }
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
