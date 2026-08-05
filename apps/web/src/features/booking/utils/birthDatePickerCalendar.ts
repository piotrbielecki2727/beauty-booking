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
  const monthDays: CalendarDay[] = Array.from(
    { length: daysInMonth },
    (_, index) => {
      const day = index + 1
      const date = new Date(year, month, day)

      return {
        date,
        day,
        disabled: date > today || year < minimumYear,
        key: formatIsoDate(date),
      }
    }
  )

  return { emptyDays, monthDays }
}

export {
  formatDisplayDate,
  formatIsoDate,
  getCalendarDays,
  getInitialViewDate,
  getToday,
  minimumYear,
  monthNames,
  parseIsoDate,
  weekDayLabels,
}
export type { CalendarDay }
