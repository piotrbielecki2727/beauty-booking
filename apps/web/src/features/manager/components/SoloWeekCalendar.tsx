import { ChevronLeft, ChevronRight, MoreHorizontal, Plus } from "lucide-react"

import { AppButton } from "@/components/common/app-button"
import { Badge } from "@/components/ui/badge"
import {
  calendarDays,
  calendarHourHeightRem,
  calendarHours,
  calendarSlotHeightRem,
  calendarSlotsCount,
  calendarStartHour,
  eventStatusClasses,
} from "@/features/manager/config/managerCalendarConfig"
import { soloCalendarEvents } from "@/features/manager/mocks/managerCalendarEvents"
import type { ManagerCalendarDay, SoloCalendarEvent } from "@/features/manager/types/managerCalendar"
import { formatManagerBookingDuration } from "@/features/manager/utils/managerBookingFormatters"
import {
  getDurationSlots,
  getSlotOffset,
} from "@/features/manager/utils/managerCalendarLayout"
import { cn } from "@/lib/utils"

type DayHeaderProps = {
  day: ManagerCalendarDay
}

type DayColumnProps = {
  day: ManagerCalendarDay
}

type CalendarEventCardProps = {
  event: SoloCalendarEvent
}

type LegendItemProps = {
  color: string
  label: string
}

const SoloWeekCalendar = () => (
  <div className="grid min-h-screen grid-rows-[auto_auto_minmax(0,1fr)]">
    <header className="grid gap-5 border-b border-border bg-card px-4 py-5 sm:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="grid gap-1">
          <p className="text-sm font-medium text-primary">Panel managera</p>
          <h1 className="font-heading text-3xl font-semibold leading-tight">
            Kalendarz
          </h1>
          <p className="text-sm text-muted-foreground">
            Tydzień 3-9 sierpnia 2026
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl />
          <DateControls />
          <AppButton variant="outline">Dzisiaj</AppButton>
          <AppButton>
            <Plus aria-hidden="true" />
            Dodaj wizytę
          </AppButton>
          <AppButton size="icon" variant="outline">
            <MoreHorizontal aria-hidden="true" />
          </AppButton>
        </div>
      </div>
    </header>

    <CalendarLegend />

    <div className="min-w-0">
      <div className="grid w-full grid-cols-[3rem_repeat(7,minmax(0,1fr))]">
        <div className="sticky left-0 z-20 border-b border-r border-border bg-card" />
        {calendarDays.map((day) => (
          <DayHeader day={day} key={day.date} />
        ))}

        <TimeGutter />
        {calendarDays.map((day) => (
          <DayColumn day={day} key={day.date} />
        ))}
      </div>
    </div>
  </div>
)

const SegmentedControl = () => (
  <div className="inline-grid grid-cols-3 rounded-lg border border-border bg-background p-1">
    {["Dzień", "Tydzień", "Miesiąc"].map((label, index) => (
      <button
        className={cn(
          "h-8 rounded-md px-3 text-sm font-medium transition-colors",
          index === 1
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
        key={label}
        type="button"
      >
        {label}
      </button>
    ))}
  </div>
)

const DateControls = () => (
  <div className="inline-flex items-center rounded-lg border border-border bg-background">
    <button
      className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground"
      type="button"
    >
      <ChevronLeft aria-hidden="true" className="size-4" />
    </button>
    <div className="border-x border-border px-4 text-sm font-medium">
      3-9 sierpnia 2026
    </div>
    <button
      className="flex size-9 items-center justify-center text-muted-foreground hover:text-foreground"
      type="button"
    >
      <ChevronRight aria-hidden="true" className="size-4" />
    </button>
  </div>
)

const CalendarLegend = () => (
  <div className="flex flex-wrap items-center gap-4 border-b border-border bg-card px-4 py-3 text-xs text-muted-foreground sm:px-6">
    <LegendItem color="bg-emerald-500" label="Potwierdzona" />
    <LegendItem color="bg-amber-400" label="Oczekująca" />
    <LegendItem color="bg-rose-400" label="Odwołana" />
    <LegendItem color="bg-neutral-900" label="Przerwa / blokada" />
  </div>
)

const DayHeader = ({ day }: DayHeaderProps) => (
  <div
    className={cn(
      "grid min-h-16 content-center gap-1 border-b border-r border-border bg-card px-3",
      day.isToday && "bg-primary/5"
    )}
  >
    <div className="flex items-center gap-2">
      <p className="font-medium">{day.shortLabel}</p>
      {day.isToday ? <Badge variant="secondary">Dzisiaj</Badge> : null}
    </div>
    <p className="text-xs text-muted-foreground">{day.date.slice(8, 10)}.08</p>
  </div>
)

const TimeGutter = () => (
  <div
    className="sticky left-0 z-10 border-r border-border bg-card"
    style={{ height: `${calendarSlotsCount * calendarSlotHeightRem}rem` }}
  >
    {calendarHours.map((hour) => {
      const isFirstHour = hour === calendarStartHour
      const isLastHour = hour === calendarHours[calendarHours.length - 1]

      return (
        <div
          className={cn(
            "absolute left-0 right-0 px-2 text-xs text-muted-foreground",
            isFirstHour && "pt-1",
            isLastHour && "-translate-y-4",
            !isFirstHour && !isLastHour && "-translate-y-2"
          )}
          key={hour}
          style={{
            top: `${(hour - calendarStartHour) * 4 * calendarSlotHeightRem}rem`,
          }}
        >
          {String(hour).padStart(2, "0")}:00
        </div>
      )
    })}
  </div>
)

const DayColumn = ({ day }: DayColumnProps) => {
  // TODO backend: replace soloCalendarEvents with manager calendar events returned by the API.
  const dayEvents = soloCalendarEvents.filter((event) => event.date === day.date)

  return (
    <div
      className={cn(
        "relative isolate border-r border-border bg-background",
        day.isToday && "bg-primary/[0.025]"
      )}
      style={{
        height: `${calendarSlotsCount * calendarSlotHeightRem}rem`,
      }}
    >
      {calendarHours.slice(1).map((hour) => (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 right-0 z-0 border-t border-border/70"
          key={hour}
          style={{ top: `${(hour - calendarStartHour) * calendarHourHeightRem}rem` }}
        />
      ))}
      {dayEvents.map((event) => (
        <CalendarEventCard event={event} key={event.id} />
      ))}
    </div>
  )
}

const CalendarEventCard = ({ event }: CalendarEventCardProps) => {
  const offsetSlots = getSlotOffset(event.startTime)
  const durationSlots = getDurationSlots(event.durationMinutes)

  return (
    <button
      className={cn(
        "absolute left-1.5 right-1.5 z-30 grid cursor-pointer content-start gap-0.5 overflow-hidden rounded-md border bg-clip-padding p-2 text-left text-xs leading-4 shadow-sm ring-1 ring-background/70 transition-[border-color,box-shadow,filter] hover:brightness-[0.98] hover:shadow-md",
        event.isBlocked
          ? eventStatusClasses.blocked
          : eventStatusClasses[event.status]
      )}
      style={{
        height: `calc(${durationSlots * calendarSlotHeightRem}rem - 0.35rem)`,
        top: `calc(${offsetSlots * calendarSlotHeightRem}rem + 0.18rem)`,
      }}
      type="button"
    >
      <span className="opacity-75">
        {event.startTime} - {event.endTime}
      </span>
      <span className="font-medium">{event.clientName}</span>
      <span className="opacity-85">{event.note ?? event.serviceName}</span>
      <span className="mt-auto text-[0.68rem] opacity-75">
        {formatManagerBookingDuration(event.durationMinutes)}
      </span>
    </button>
  )
}

const LegendItem = ({ color, label }: LegendItemProps) => (
  <span className="inline-flex items-center gap-2">
    <span className={cn("size-2 rounded-full", color)} />
    {label}
  </span>
)

export { SoloWeekCalendar }
