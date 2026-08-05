import type { BookingTimeSlot } from "@/features/booking/types/timeSlot"

const mockTimeSlots: BookingTimeSlot[] = [
  {
    dateLabel: "Dzisiaj",
    dateValue: "2026-08-03",
    endTime: "10:30",
    id: "slot-manicure-1",
    serviceId: "manicure-hybrid",
    staffMemberIds: ["staff-amelia"],
    startTime: "09:00",
  },
  {
    dateLabel: "Dzisiaj",
    dateValue: "2026-08-03",
    endTime: "15:30",
    id: "slot-manicure-2",
    serviceId: "manicure-hybrid",
    staffMemberIds: ["staff-amelia"],
    startTime: "14:00",
  },
  {
    dateLabel: "Jutro",
    dateValue: "2026-08-04",
    endTime: "13:00",
    id: "slot-lashes-1",
    serviceId: "lashes-light-volume",
    staffMemberIds: ["staff-julia"],
    startTime: "11:00",
  },
  {
    dateLabel: "Jutro",
    dateValue: "2026-08-04",
    endTime: "10:45",
    id: "slot-brows-1",
    serviceId: "brow-styling",
    staffMemberIds: ["staff-julia", "staff-marta"],
    startTime: "10:00",
  },
  {
    dateLabel: "Środa",
    dateValue: "2026-08-05",
    endTime: "17:15",
    id: "slot-makeup-1",
    serviceId: "occasion-makeup",
    staffMemberIds: ["staff-lena", "staff-marta"],
    startTime: "16:00",
  },
  {
    dateLabel: "Środa",
    dateValue: "2026-08-05",
    endTime: "13:00",
    id: "slot-waves-1",
    serviceId: "soft-waves",
    staffMemberIds: ["staff-lena", "staff-marta"],
    startTime: "12:00",
  },
]

export { mockTimeSlots }
