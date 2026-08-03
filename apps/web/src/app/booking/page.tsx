import type { Metadata } from "next"

import { PageContainer } from "@/components/layout/page-container"
import { BookingFlow } from "@/features/booking/components/booking-flow"

export const metadata: Metadata = {
  title: "Rezerwacja | Beauty Booking",
  description: "Wybierz usługę, termin i potwierdź rezerwację wizyty.",
}

const BookingPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <PageContainer className="grid gap-8 py-8 sm:py-10">
        <BookingFlow />
      </PageContainer>
    </main>
  )
}

export default BookingPage
