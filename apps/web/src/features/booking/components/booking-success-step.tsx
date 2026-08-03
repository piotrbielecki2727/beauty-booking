import { CheckCircle2 } from "lucide-react"

import { SectionCard } from "@/components/common/section-card"
import { AccountInviteCard } from "@/features/booking/components/account-invite-card"
import { BookingSummaryCard } from "@/features/booking/components/booking-summary-card"
import type { AccountInviteVariant, StoredBookingReservation } from "@/features/booking/types/reservation"

type BookingSuccessStepProps = {
  accountInviteVariant?: AccountInviteVariant
  isSoloBusiness: boolean
  reservation: StoredBookingReservation
}

const BookingSuccessStep = ({ accountInviteVariant, isSoloBusiness, reservation }: BookingSuccessStepProps) => (
  <div className="grid gap-5">
    <SectionCard>
      <div className="grid gap-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CheckCircle2 aria-hidden="true" className="size-6" />
        </div>
        <div className="grid gap-2">
          <h2 className="font-heading text-3xl font-semibold leading-tight">Rezerwacja zakończona pomyślnie</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Dziękujemy. Szczegóły wizyty znajdziesz poniżej.
          </p>
        </div>
      </div>
    </SectionCard>

    <BookingSummaryCard
      customerDetails={reservation.customerDetails}
      consents={reservation.consents}
      description={null}
      isCustomerDetailsComplete
      isSoloBusiness={isSoloBusiness}
      selectedService={reservation.service}
      selectedStaffMember={reservation.staffMember}
      selectedTimeSlot={reservation.timeSlot}
    />

    {accountInviteVariant ? <AccountInviteCard reservation={reservation} variant={accountInviteVariant} /> : null}
  </div>
)

export { BookingSuccessStep }
export type { BookingSuccessStepProps }
