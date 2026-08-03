import type { BookingCustomerDetails } from "@/features/booking/types/customer"
import type { BookingConsents } from "@/features/booking/types/consents"
import type { BeautyService } from "@/features/booking/types/service"
import type { BookingStaffMember } from "@/features/booking/types/staff"
import type { BookingTimeSlot } from "@/features/booking/types/time-slot"

type StoredBookingReservation = {
  createdAt: string
  consents: BookingConsents
  customerDetails: BookingCustomerDetails
  id: string
  service: BeautyService
  staffMember?: BookingStaffMember
  timeSlot: BookingTimeSlot
}

type AccountInviteVariant = "with-email" | "without-email"

export type { AccountInviteVariant, StoredBookingReservation }
