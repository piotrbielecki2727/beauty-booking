import type { ManagerBooking } from "@/features/manager/types/managerBooking"

type ManagerCalendarDay = {
  date: string
  isToday?: boolean
  label: string
  shortLabel: string
}

type SoloCalendarEvent = ManagerBooking & {
  endTime: string
  isBlocked?: boolean
  note?: string
}

export type { ManagerCalendarDay, SoloCalendarEvent }
