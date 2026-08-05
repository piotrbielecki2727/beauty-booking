import type { ManagerCalendarDay } from "@/features/manager/types/managerCalendar"

const calendarStartHour = 6
const calendarEndHour = 22
const calendarSlotMinutes = 15
const calendarSlotHeightRem = 1.15
const calendarHourHeightRem = calendarSlotHeightRem * 4
const calendarSlotsCount =
  ((calendarEndHour - calendarStartHour) * 60) / calendarSlotMinutes
const calendarHours = Array.from(
  { length: calendarEndHour - calendarStartHour + 1 },
  (_, index) => calendarStartHour + index
)

const calendarDays: ManagerCalendarDay[] = [
  { date: "2026-08-03", isToday: true, label: "Poniedziałek", shortLabel: "Pon" },
  { date: "2026-08-04", label: "Wtorek", shortLabel: "Wt" },
  { date: "2026-08-05", label: "Środa", shortLabel: "Śr" },
  { date: "2026-08-06", label: "Czwartek", shortLabel: "Czw" },
  { date: "2026-08-07", label: "Piątek", shortLabel: "Pt" },
  { date: "2026-08-08", label: "Sobota", shortLabel: "Sob" },
  { date: "2026-08-09", label: "Niedziela", shortLabel: "Nd" },
]

const eventStatusClasses = {
  blocked: "border-neutral-900 bg-neutral-950 text-white shadow-sm",
  cancelled: "border-rose-300 bg-rose-100 text-rose-950 shadow-sm",
  completed: "border-neutral-300 bg-neutral-100 text-neutral-700 shadow-sm",
  confirmed: "border-emerald-300 bg-emerald-100 text-emerald-950 shadow-sm",
  new: "border-amber-300 bg-amber-100 text-amber-950 shadow-sm",
}

export {
  calendarDays,
  calendarEndHour,
  calendarHourHeightRem,
  calendarHours,
  calendarSlotHeightRem,
  calendarSlotMinutes,
  calendarSlotsCount,
  calendarStartHour,
  eventStatusClasses,
}
