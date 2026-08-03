import type { ReactNode } from "react"

import { AppButton } from "@/components/common/app-button"
import { SectionCard } from "@/components/common/section-card"
import { Badge } from "@/components/ui/badge"
import { BookingConsentsForm } from "@/features/booking/components/booking-consents-form"
import type { BookingConsents } from "@/features/booking/types/consents"
import type { BookingCustomerDetails } from "@/features/booking/types/customer"
import type { BeautyService } from "@/features/booking/types/service"
import type { BookingStaffMember } from "@/features/booking/types/staff"
import type { BookingTimeSlot } from "@/features/booking/types/time-slot"
import { formatPolishPhoneNumber } from "@/features/booking/utils/customer-details-formatters"
import { formatDuration, formatPriceFrom } from "@/features/booking/utils/service-formatters"

type BookingSummaryCardProps = {
  canUseEmailNotifications?: boolean
  consents?: BookingConsents
  customerDetails: BookingCustomerDetails
  description?: ReactNode
  isCustomerDetailsComplete: boolean
  isSoloBusiness: boolean
  isBookingReady?: boolean
  onConsentChange?: (consents: BookingConsents) => void
  onReserve?: () => Promise<void> | void
  selectedService?: BeautyService
  selectedStaffMember?: BookingStaffMember
  selectedTimeSlot?: BookingTimeSlot
}

type SummaryItemProps = {
  details?: ReactNode
  label: string
  title: string
  value: ReactNode
}

type EmptySummaryItemProps = {
  label: string
  value: string
}

type SummaryDetailLineProps = {
  label: string
  value: string
}

const BookingSummaryCard = ({
  canUseEmailNotifications = false,
  consents,
  customerDetails,
  description = "Sprawdź szczegóły przed potwierdzeniem.",
  isBookingReady,
  isCustomerDetailsComplete,
  isSoloBusiness,
  onConsentChange,
  onReserve,
  selectedService,
  selectedStaffMember,
  selectedTimeSlot,
}: BookingSummaryCardProps) => (
  <SectionCard title="Twoja rezerwacja" description={description}>
    <div className="grid gap-4">
      {selectedService ? (
        <SummaryItem
          label="Usługa"
          title={selectedService.name}
          value={`${formatDuration(selectedService.durationMinutes)} / ${formatPriceFrom(selectedService.priceFrom)}`}
        />
      ) : (
        <EmptySummaryItem label="Usługa" value="Nie wybrano jeszcze usługi" />
      )}

      {!isSoloBusiness ? (
        selectedStaffMember ? (
          <SummaryItem label="Pracownik" title={selectedStaffMember.name} value={selectedStaffMember.role} />
        ) : (
          <EmptySummaryItem label="Pracownik" value="Wybór pojawi się w drugim kroku" />
        )
      ) : null}

      {selectedTimeSlot ? (
        <SummaryItem
          label="Termin"
          title={`${selectedTimeSlot.dateLabel}, ${selectedTimeSlot.startTime}`}
          value={selectedTimeSlot.dateValue}
        />
      ) : (
        <EmptySummaryItem label="Termin" value="Nie wybrano jeszcze terminu" />
      )}

      {isCustomerDetailsComplete ? (
        <SummaryItem
          details={
            customerDetails.email || customerDetails.note ? (
              <>
                {customerDetails.email ? <SummaryDetailLine label="E-mail" value={customerDetails.email} /> : null}
                {customerDetails.note ? <SummaryDetailLine label="Notatka" value={customerDetails.note} /> : null}
              </>
            ) : undefined
          }
          label="Klientka"
          title={`${customerDetails.firstName.trim()} ${customerDetails.lastName.trim()}`}
          value={formatPolishPhoneNumber(customerDetails.phone)}
        />
      ) : (
        <EmptySummaryItem label="Klientka" value="Uzupełnij dane w ostatnim kroku" />
      )}

      {consents && onConsentChange ? (
        <BookingConsentsForm
          canUseEmailNotifications={canUseEmailNotifications}
          consents={consents}
          onConsentChange={onConsentChange}
        />
      ) : null}

      {consents && !onConsentChange ? <ConsentsSummary consents={consents} /> : null}

      {onReserve ? (
        <div className="grid gap-2 border-t border-border pt-4">
          <AppButton disabled={!isBookingReady} fullWidth onClick={onReserve}>
            Zarezerwuj
          </AppButton>
          <p className="text-xs leading-5 text-muted-foreground">
            Przycisk będzie aktywny po uzupełnieniu wymaganych danych i akceptacji regulaminu.
          </p>
        </div>
      ) : null}
    </div>
  </SectionCard>
)

const SummaryItem = ({ details, label, title, value }: SummaryItemProps) => (
  <div className="grid min-w-0 gap-1 border-t border-border pt-4 first:border-t-0 first:pt-0">
    <Badge variant="secondary" className="w-fit">
      {label}
    </Badge>
    <p className="min-w-0 [overflow-wrap:anywhere] font-medium">{title}</p>
    <p className="min-w-0 [overflow-wrap:anywhere] text-sm text-muted-foreground">{value}</p>
    {details ? (
      <div className="grid min-w-0 gap-1 text-sm leading-6 text-muted-foreground">{details}</div>
    ) : null}
  </div>
)

const EmptySummaryItem = ({ label, value }: EmptySummaryItemProps) => (
  <div className="grid min-w-0 gap-1 border-t border-border pt-4 first:border-t-0 first:pt-0">
    <Badge variant="outline" className="w-fit">
      {label}
    </Badge>
    <p className="min-w-0 [overflow-wrap:anywhere] text-sm text-muted-foreground">{value}</p>
  </div>
)

const SummaryDetailLine = ({ label, value }: SummaryDetailLineProps) => (
  <p className="min-w-0 [overflow-wrap:anywhere]">
    <span className="font-medium text-foreground">{label}: </span>
    <span>{value}</span>
  </p>
)

const ConsentsSummary = ({ consents }: { consents: BookingConsents }) => (
  <div className="grid min-w-0 gap-2 border-t border-border pt-4">
    <Badge variant="secondary" className="w-fit">
      Zgody
    </Badge>
    <div className="grid gap-1 text-sm leading-6 text-muted-foreground">
      <p>
        Powiadomienia SMS:{" "}
        {consents.phoneNotifications ? "wyrażono zgodę." : "nie wyrażono zgody."}
      </p>
      <p>
        Powiadomienia e-mail:{" "}
        {consents.emailNotifications ? "wyrażono zgodę." : "nie wyrażono zgody."}
      </p>
    </div>
  </div>
)

export { BookingSummaryCard }
export type { BookingSummaryCardProps }
