import type { BookingTimeSlot } from "@/features/booking/types/timeSlot"

type DateGroup = {
  dateLabel: string
  dateValue: string
  slots: BookingTimeSlot[]
}

type MonthGroup = {
  dates: DateGroup[]
  monthKey: string
  monthLabel: string
}

type DayPart = "afternoon" | "evening" | "morning"

type DayPartOption = {
  id: DayPart
  label: string
}

const dayPartOptions: DayPartOption[] = [
  {
    id: "morning",
    label: "Rano",
  },
  {
    id: "afternoon",
    label: "Po południu",
  },
  {
    id: "evening",
    label: "Wieczorem",
  },
]

const monthFormatter = new Intl.DateTimeFormat("pl-PL", {
  month: "long",
  year: "numeric",
})

const dayNumberFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "2-digit",
})

const weekdayShortFormatter = new Intl.DateTimeFormat("pl-PL", {
  weekday: "short",
})

const formatMonthLabel = (value: string) =>
  `${value.charAt(0).toUpperCase()}${value.slice(1)}`

const timeToMinutes = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":")

  return Number(hours) * 60 + Number(minutes)
}

const getDayPart = (time: string): DayPart => {
  const minutes = timeToMinutes(time)

  if (minutes < 12 * 60) {
    return "morning"
  }

  if (minutes < 17 * 60) {
    return "afternoon"
  }

  return "evening"
}

const getAvailabilityIndicatorClassName = (slotsCount: number) => {
  if (slotsCount <= 2) {
    return "bg-destructive"
  }

  if (slotsCount < 5) {
    return "bg-amber-500"
  }

  return "bg-emerald-500"
}

const groupTimeSlotsByMonth = (timeSlots: BookingTimeSlot[]) => {
  const dateGroups = timeSlots.reduce<DateGroup[]>((groups, slot) => {
    const existingGroup = groups.find(
      (group) => group.dateValue === slot.dateValue
    )

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

  return dateGroups.reduce<MonthGroup[]>((groups, dateGroup) => {
    const date = new Date(`${dateGroup.dateValue}T00:00:00`)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const existingGroup = groups.find((group) => group.monthKey === monthKey)

    if (existingGroup) {
      existingGroup.dates.push(dateGroup)
      return groups
    }

    groups.push({
      dates: [dateGroup],
      monthKey,
      monthLabel: monthFormatter.format(date),
    })

    return groups
  }, [])
}

export {
  dayNumberFormatter,
  dayPartOptions,
  formatMonthLabel,
  getAvailabilityIndicatorClassName,
  getDayPart,
  groupTimeSlotsByMonth,
  weekdayShortFormatter,
}
export type { DateGroup, DayPart, DayPartOption, MonthGroup }
