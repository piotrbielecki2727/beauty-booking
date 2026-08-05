import type { Metadata } from "next"
import { Suspense } from "react"

import { BookingFlow } from "@/features/booking/components/BookingFlow"

export const metadata: Metadata = {
  title: "Rezerwacja | Beauty Booking",
  description: "Wybierz usługę, termin i potwierdź rezerwację wizyty.",
}

const BookingPage = () => (
  <Suspense fallback={<main className="min-h-screen bg-background" />}>
    <BookingFlow />
  </Suspense>
)

export default BookingPage
