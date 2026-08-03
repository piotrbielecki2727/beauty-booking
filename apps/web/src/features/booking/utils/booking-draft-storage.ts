import type { BookingConsents } from "@/features/booking/types/consents"
import type { BookingCustomerDetails } from "@/features/booking/types/customer"
import { bookingStepIds } from "@/features/booking/types/flow"
import type { BookingStep } from "@/features/booking/types/flow"

const bookingDraftStorageKey = "beauty-booking:booking-draft:v1"

type BookingDraft = {
  bookingConsents: BookingConsents
  currentStep: BookingStep
  customerDetails: BookingCustomerDetails
  selectedServiceId?: string
  selectedStaffMemberId?: string
  selectedTimeSlotId?: string
  updatedAt: string
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null

const readString = (value: unknown) => (typeof value === "string" ? value : "")

const readOptionalString = (value: unknown) => {
  const stringValue = readString(value)

  return stringValue || undefined
}

const readBoolean = (value: unknown) => (typeof value === "boolean" ? value : false)

const readBookingDraft = () => {
  if (typeof window === "undefined") {
    return undefined
  }

  try {
    const rawDraft = window.sessionStorage.getItem(bookingDraftStorageKey)

    if (!rawDraft) {
      return undefined
    }

    const parsedDraft: unknown = JSON.parse(rawDraft)

    if (!isRecord(parsedDraft)) {
      return undefined
    }

    const currentStep = bookingStepIds.includes(parsedDraft.currentStep as BookingStep)
      ? (parsedDraft.currentStep as BookingStep)
      : "service"
    const rawCustomerDetails = isRecord(parsedDraft.customerDetails) ? parsedDraft.customerDetails : {}
    const rawConsents = isRecord(parsedDraft.bookingConsents) ? parsedDraft.bookingConsents : {}

    return {
      bookingConsents: {
        emailNotifications: readBoolean(rawConsents.emailNotifications),
        phoneNotifications: readBoolean(rawConsents.phoneNotifications),
        termsAccepted: readBoolean(rawConsents.termsAccepted),
      },
      currentStep,
      customerDetails: {
        email: readString(rawCustomerDetails.email),
        firstName: readString(rawCustomerDetails.firstName),
        lastName: readString(rawCustomerDetails.lastName),
        note: readString(rawCustomerDetails.note),
        phone: readString(rawCustomerDetails.phone),
      },
      selectedServiceId: readOptionalString(parsedDraft.selectedServiceId),
      selectedStaffMemberId: readOptionalString(parsedDraft.selectedStaffMemberId),
      selectedTimeSlotId: readOptionalString(parsedDraft.selectedTimeSlotId),
      updatedAt: readString(parsedDraft.updatedAt),
    } satisfies BookingDraft
  } catch {
    return undefined
  }
}

const saveBookingDraft = (draft: Omit<BookingDraft, "updatedAt">) => {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.sessionStorage.setItem(
      bookingDraftStorageKey,
      JSON.stringify({
        ...draft,
        updatedAt: new Date().toISOString(),
      })
    )
  } catch {
    return
  }
}

const clearBookingDraft = () => {
  if (typeof window === "undefined") {
    return
  }

  try {
    window.sessionStorage.removeItem(bookingDraftStorageKey)
  } catch {
    return
  }
}

export { clearBookingDraft, readBookingDraft, saveBookingDraft }
export type { BookingDraft }
