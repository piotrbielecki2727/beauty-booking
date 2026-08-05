import type { BookingCustomerDetails } from "@/features/booking/types/customer"
import type { BookingConsents } from "@/features/booking/types/consents"
import type { BookingReservationStatus, StoredBookingReservation } from "@/features/booking/types/reservation"
import type { BeautyService } from "@/features/booking/types/service"
import type { BookingStaffMember } from "@/features/booking/types/staff"
import type { BookingTimeSlot } from "@/features/booking/types/timeSlot"

const reservationsStorageKey = "beauty-booking:reservations"
const reservationsChangeEventName = "beauty-booking:reservations-change"

type CreateStoredReservationInput = {
  accountId: string
  consents: BookingConsents
  customerDetails: BookingCustomerDetails
  service: BeautyService
  staffMember?: BookingStaffMember
  timeSlot: BookingTimeSlot
}

type UpdateStoredReservationInput = {
  consents: BookingConsents
  reservationId: string
  service: BeautyService
  staffMember?: BookingStaffMember
  timeSlot: BookingTimeSlot
}

const getStoredReservations = () => {
  if (typeof window === "undefined") {
    return []
  }

  // TODO backend: replace localStorage reads with reservation API queries.
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

const getStoredReservationsByAccountId = (accountId: string) =>
  getStoredReservations().filter((reservation) => reservation.accountId === accountId)

const getStoredReservationById = (reservationId: string) =>
  getStoredReservations().find((reservation) => reservation.id === reservationId)

const createStoredReservation = ({
  accountId,
  consents,
  customerDetails,
  service,
  staffMember,
  timeSlot,
}: CreateStoredReservationInput) => {
  const existingReservations = getStoredReservations()
  const reservation: StoredBookingReservation = {
    accountId,
    consents,
    createdAt: new Date().toISOString(),
    customerDetails,
    id: `reservation-${Date.now()}`,
    service,
    staffMember,
    status: "confirmed",
    timeSlot,
  }

  // TODO backend: replace localStorage writes with a create-reservation API mutation.
  window.localStorage.setItem(reservationsStorageKey, JSON.stringify([...existingReservations, reservation]))
  window.dispatchEvent(new Event(reservationsChangeEventName))

  return {
    isFirstReservation: existingReservations.length === 0,
    reservation,
  }
}

const updateStoredReservationStatus = (reservationId: string, status: BookingReservationStatus) => {
  const reservations = getStoredReservations()
  const nextReservations = reservations.map((reservation) =>
    reservation.id === reservationId
      ? {
          ...reservation,
          status,
        }
      : reservation
  )

  // TODO backend: replace localStorage writes with a reservation status API mutation.
  window.localStorage.setItem(reservationsStorageKey, JSON.stringify(nextReservations))
  window.dispatchEvent(new Event(reservationsChangeEventName))

  return nextReservations.find((reservation) => reservation.id === reservationId)
}

const updateStoredReservation = ({
  consents,
  reservationId,
  service,
  staffMember,
  timeSlot,
}: UpdateStoredReservationInput) => {
  const reservations = getStoredReservations()
  let updatedReservation: StoredBookingReservation | undefined
  const nextReservations = reservations.map((reservation) => {
    if (reservation.id !== reservationId) {
      return reservation
    }

    updatedReservation = {
      ...reservation,
      consents,
      service,
      staffMember,
      status: "confirmed",
      timeSlot,
      updatedAt: new Date().toISOString(),
    }

    return updatedReservation
  })

  // TODO backend: replace localStorage writes with an update-reservation API mutation.
  window.localStorage.setItem(reservationsStorageKey, JSON.stringify(nextReservations))
  window.dispatchEvent(new Event(reservationsChangeEventName))

  return updatedReservation
}

export {
  createStoredReservation,
  getStoredReservationById,
  getStoredReservations,
  getStoredReservationsByAccountId,
  reservationsChangeEventName,
  reservationsStorageKey,
  updateStoredReservation,
  updateStoredReservationStatus,
}
export type { UpdateStoredReservationInput }
