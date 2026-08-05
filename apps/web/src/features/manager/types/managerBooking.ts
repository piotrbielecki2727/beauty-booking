type ManagerBookingStatus = "cancelled" | "completed" | "confirmed" | "new"

type ManagerBooking = {
  clientName: string
  clientPhone: string
  date: string
  durationMinutes: number
  id: string
  priceFrom: number
  serviceName: string
  staffName?: string
  startTime: string
  status: ManagerBookingStatus
}

export type { ManagerBooking, ManagerBookingStatus }
