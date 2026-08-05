import type { BookingStepItem } from "@/features/booking/types/flow"

const bookingSteps: BookingStepItem[] = [
  { id: "customer", label: "Klient/ka" },
  { id: "service", label: "Usługa" },
  { id: "staff", label: "Pracownik" },
  { id: "datetime", label: "Termin" },
  { id: "summary", label: "Podsumowanie" },
]

export { bookingSteps }
