import { CheckCircle2 } from "lucide-react"

import { SectionCard } from "@/components/common/section-card"
import { BookingSummaryCard } from "@/features/booking/components/BookingSummaryCard"
import type { StoredBookingReservation } from "@/features/booking/types/reservation"

type BookingSuccessStepProps = {
  isEditingReservation?: boolean
  isSoloBusiness: boolean
  reservation: StoredBookingReservation
}

const BookingSuccessStep = ({
  isEditingReservation = false,
  isSoloBusiness,
  reservation,
}: BookingSuccessStepProps) => (
  <div className="grid gap-5">
    <SectionCard>
      <div className="grid gap-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 aria-hidden="true" className="size-6" />
        </div>
        <div className="grid gap-2">
          <h2 className="font-heading text-3xl font-semibold leading-tight">
            {isEditingReservation ? "Zmiany zostały zapisane" : "Rezerwacja zakończona pomyślnie"}
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {isEditingReservation
              ? "Zaktualizowane szczegóły wizyty znajdziesz poniżej."
              : "Dziękujemy. Szczegóły wizyty znajdziesz poniżej."}
          </p>
        </div>
      </div>
    </SectionCard>

    <BookingSummaryCard
      accountEmail={reservation.customerDetails.email}
      accountName={`${reservation.customerDetails.firstName} ${reservation.customerDetails.lastName}`.trim()}
      accountPhone={reservation.customerDetails.phone}
      consents={reservation.consents}
      description={null}
      isCustomerDetailsComplete
      isSoloBusiness={isSoloBusiness}
      selectedService={reservation.service}
      selectedStaffMember={reservation.staffMember}
      selectedTimeSlot={reservation.timeSlot}
    />
  </div>
)

export { BookingSuccessStep }
export type { BookingSuccessStepProps }
