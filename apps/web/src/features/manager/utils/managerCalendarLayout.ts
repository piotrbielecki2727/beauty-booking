import {
  calendarSlotMinutes,
  calendarStartHour,
} from "@/features/manager/config/managerCalendarConfig"

const getSlotOffset = (time: string) => {
  const [hour = "0", minute = "0"] = time.split(":")
  const minutesFromStart =
    (Number(hour) - calendarStartHour) * 60 + Number(minute)

  return Math.max(minutesFromStart / calendarSlotMinutes, 0)
}

const getDurationSlots = (durationMinutes: number) =>
  Math.max(durationMinutes / calendarSlotMinutes, 2)

export { getDurationSlots, getSlotOffset }
