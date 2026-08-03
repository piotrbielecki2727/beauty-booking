import type { BookingStepItem } from "@/features/booking/types/flow"

const bookingSteps: BookingStepItem[] = [
  { id: "service", label: "Usługa" },
  { id: "staff", label: "Pracownik" },
  { id: "datetime", label: "Termin" },
  { id: "customer", label: "Dane" },
  { id: "summary", label: "Podsumowanie" },
]

export { bookingSteps }
