import type { AccountSession } from "@/features/account/types/accountSession"
import type { BookingSummaryCardProps } from "@/features/booking/components/BookingSummaryCard"
import type { BookingConsents } from "@/features/booking/types/consents"
import type { BookingCustomerDetails } from "@/features/booking/types/customer"
import type { BookingScreen } from "@/features/booking/types/flow"
import type { BeautyService } from "@/features/booking/types/service"
import type { BookingStaffMember } from "@/features/booking/types/staff"
import type { BookingTimeSlot } from "@/features/booking/types/timeSlot"

type HasBookingFormProgressInput = {
  bookingConsents: BookingConsents
  currentScreen: BookingScreen
  customerDetails: BookingCustomerDetails
  isStaffCreatedReservation: boolean
  selectedServiceId?: string
  selectedStaffMemberId?: string
  selectedTimeSlotId?: string
}

type CreateBookingSummaryPropsInput = {
  accountSession?: AccountSession
  bookingConsents: BookingConsents
  customerDetails: BookingCustomerDetails
  isBookingReady: boolean
  isCustomerDetailsComplete: boolean
  isSoloBusiness: boolean
  isStaffCreatedReservation: boolean
  onConsentChange: BookingSummaryCardProps["onConsentChange"]
  onReserve: BookingSummaryCardProps["onReserve"]
  reservationSubmitLabel: string
  selectedService?: BeautyService
  selectedStaffMember?: BookingStaffMember
  selectedTimeSlot?: BookingTimeSlot
}

const hasBookingFormProgress = ({
  bookingConsents,
  currentScreen,
  customerDetails,
  isStaffCreatedReservation,
  selectedServiceId,
  selectedStaffMemberId,
  selectedTimeSlotId,
}: HasBookingFormProgressInput) =>
  currentScreen !== "success" &&
  Boolean(
    selectedServiceId ||
      selectedStaffMemberId ||
      selectedTimeSlotId ||
      bookingConsents.termsAccepted ||
      (isStaffCreatedReservation &&
        (customerDetails.firstName ||
          customerDetails.lastName ||
          customerDetails.phone ||
          customerDetails.email ||
          customerDetails.note))
  )

const createBookingSummaryProps = ({
  accountSession,
  bookingConsents,
  customerDetails,
  isBookingReady,
  isCustomerDetailsComplete,
  isSoloBusiness,
  isStaffCreatedReservation,
  onConsentChange,
  onReserve,
  reservationSubmitLabel,
  selectedService,
  selectedStaffMember,
  selectedTimeSlot,
}: CreateBookingSummaryPropsInput): BookingSummaryCardProps => ({
  accountEmail: isStaffCreatedReservation ? undefined : accountSession?.email,
  accountName: isStaffCreatedReservation
    ? undefined
    : accountSession
      ? `${accountSession.firstName} ${accountSession.lastName}`.trim()
      : undefined,
  accountPhone: isStaffCreatedReservation ? undefined : accountSession?.phone,
  canUseEmailNotifications: false,
  consents: bookingConsents,
  customerDetails: isStaffCreatedReservation ? customerDetails : undefined,
  description: isStaffCreatedReservation
    ? "Sprawdź szczegóły przed zapisaniem wizyty w kalendarzu."
    : "Sprawdź szczegóły przed potwierdzeniem.",
  isBookingReady,
  isCustomerDetailsComplete,
  isSoloBusiness,
  onConsentChange,
  onReserve,
  selectedService,
  selectedStaffMember,
  selectedTimeSlot,
  submitLabel: reservationSubmitLabel,
  title: isStaffCreatedReservation ? "Rezerwacja" : "Twoja rezerwacja",
})

export { createBookingSummaryProps, hasBookingFormProgress }
export type {
  CreateBookingSummaryPropsInput,
  HasBookingFormProgressInput,
}
