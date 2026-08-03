const bookingStepIds = ["service", "staff", "datetime", "customer", "summary"] as const

type BookingStep = (typeof bookingStepIds)[number]
type BookingScreen = BookingStep | "success" | "verification"

type BookingStepItem = {
  id: BookingStep
  label: string
}

type BookingTransitionState = {
  description: string
  title: string
}

export { bookingStepIds }
export type { BookingScreen, BookingStep, BookingStepItem, BookingTransitionState }
