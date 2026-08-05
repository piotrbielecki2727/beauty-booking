import type { BookingCustomerDetails } from "@/features/booking/types/customer"
import type { BookingConsents } from "@/features/booking/types/consents"
import type { BeautyService } from "@/features/booking/types/service"
import type { BookingStaffMember } from "@/features/booking/types/staff"
import type { BookingTimeSlot } from "@/features/booking/types/timeSlot"

type StoredBookingReservation = {
  accountId: string
  createdAt: string
  consents: BookingConsents
  customerDetails: BookingCustomerDetails
  id: string
  service: BeautyService
  staffMember?: BookingStaffMember
  status: BookingReservationStatus
  timeSlot: BookingTimeSlot
  updatedAt?: string
}

type BookingReservationStatus = "cancelled" | "completed" | "confirmed" | "pending"

export type { BookingReservationStatus, StoredBookingReservation }
