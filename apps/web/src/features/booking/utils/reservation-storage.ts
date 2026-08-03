import type { BookingCustomerDetails } from "@/features/booking/types/customer"
import type { BookingConsents } from "@/features/booking/types/consents"
import type { StoredBookingReservation } from "@/features/booking/types/reservation"
import type { BeautyService } from "@/features/booking/types/service"
import type { BookingStaffMember } from "@/features/booking/types/staff"
import type { BookingTimeSlot } from "@/features/booking/types/time-slot"

const reservationsStorageKey = "beauty-booking:reservations"

type CreateStoredReservationInput = {
  consents: BookingConsents
  customerDetails: BookingCustomerDetails
  service: BeautyService
  staffMember?: BookingStaffMember
  timeSlot: BookingTimeSlot
}

const getStoredReservations = () => {
  if (typeof window === "undefined") {
    return []
  }

  const storedValue = window.localStorage.getItem(reservationsStorageKey)

  if (!storedValue) {
    return []
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)

    return Array.isArray(parsedValue) ? (parsedValue as StoredBookingReservation[]) : []
  } catch {
    return []
  }
}

const createStoredReservation = ({
  consents,
  customerDetails,
  service,
  staffMember,
  timeSlot,
}: CreateStoredReservationInput) => {
  const existingReservations = getStoredReservations()
  const reservation: StoredBookingReservation = {
    consents,
    createdAt: new Date().toISOString(),
    customerDetails,
    id: `reservation-${Date.now()}`,
    service,
    staffMember,
    timeSlot,
  }

  window.localStorage.setItem(reservationsStorageKey, JSON.stringify([...existingReservations, reservation]))

  return {
    isFirstReservation: existingReservations.length === 0,
    reservation,
  }
}

export { createStoredReservation, getStoredReservations, reservationsStorageKey }
