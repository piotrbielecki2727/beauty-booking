import type { ReactNode } from "react"

import { AppButton } from "@/components/common/app-button"
import { SectionCard } from "@/components/common/section-card"
import { Badge } from "@/components/ui/badge"
import { BookingConsentsForm } from "@/features/booking/components/BookingConsentsForm"
import type { BookingConsents } from "@/features/booking/types/consents"
import type { BookingCustomerDetails } from "@/features/booking/types/customer"
import type { BeautyService } from "@/features/booking/types/service"
import type { BookingStaffMember } from "@/features/booking/types/staff"
import type { BookingTimeSlot } from "@/features/booking/types/timeSlot"
import { formatPolishPhoneNumber } from "@/features/booking/utils/customerDetailsFormatters"
import { formatDuration, formatPriceFrom } from "@/features/booking/utils/serviceFormatters"
import { cn } from "@/lib/utils"

type BookingSummaryCardProps = {
  accountEmail?: string
  accountName?: string
  accountPhone?: string
  canUseEmailNotifications?: boolean
  consents?: BookingConsents
  customerDetails?: BookingCustomerDetails
  description?: ReactNode
  isBookingReady?: boolean
  isCustomerDetailsComplete: boolean
  isSoloBusiness: boolean
  onConsentChange?: (consents: BookingConsents) => void
  onReserve?: () => Promise<void> | void
  selectedService?: BeautyService
  selectedStaffMember?: BookingStaffMember
  selectedTimeSlot?: BookingTimeSlot
  submitLabel?: string
  title?: string
}

type SummaryItemProps = {
  className?: string
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
  accountEmail,
  accountName,
  accountPhone,
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
  submitLabel = "Zarezerwuj",
  title = "Twoja rezerwacja",
}: BookingSummaryCardProps) => (
  <SectionCard title={title} description={description} className="[--card-spacing:--spacing(4)]">
    <div className="grid gap-3">
      <div className="grid gap-3 lg:grid-cols-3 2xl:grid-cols-4">
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

        {accountEmail ? (
          <SummaryItem
            details={
              <>
                <SummaryDetailLine label="E-mail" value={accountEmail} />
                {accountPhone ? <SummaryDetailLine label="Telefon" value={formatPolishPhoneNumber(accountPhone)} /> : null}
              </>
            }
            label="Konto"
            title={accountName || accountEmail}
            value="Zalogowane konto"
          />
        ) : isCustomerDetailsComplete && customerDetails ? (
          <SummaryItem
            details={
              customerDetails.email || customerDetails.note ? (
                <>
                  {customerDetails.email ? <SummaryDetailLine label="E-mail" value={customerDetails.email} /> : null}
                  {customerDetails.note ? <SummaryDetailLine label="Notatka" value={customerDetails.note} /> : null}
                </>
              ) : undefined
            }
            label="Klient/ka"
            title={`${customerDetails.firstName.trim()} ${customerDetails.lastName.trim()}`}
            value={formatPolishPhoneNumber(customerDetails.phone)}
          />
        ) : (
          <EmptySummaryItem label="Konto" value="Zaloguj się, aby dokończyć rezerwację" />
        )}
      </div>

      {consents && onConsentChange ? (
        <div className="rounded-lg border border-border/70 bg-muted/20 px-3 py-2">
          <BookingConsentsForm
            canUseEmailNotifications={canUseEmailNotifications}
            consents={consents}
            onConsentChange={onConsentChange}
            showNotificationConsents={false}
          />
        </div>
      ) : null}

      {onReserve ? (
        <div className="flex flex-col gap-2 border-t border-border pt-3 sm:items-end">
          <AppButton className="w-full sm:w-56" disabled={!isBookingReady} onClick={onReserve}>
            {submitLabel}
          </AppButton>
          <p className="text-xs leading-5 text-muted-foreground">
            Przycisk będzie aktywny po uzupełnieniu wymaganych danych i akceptacji regulaminu.
          </p>
        </div>
      ) : null}
    </div>
  </SectionCard>
)

const SummaryItem = ({ className, details, label, title, value }: SummaryItemProps) => (
  <div className={cn("grid min-w-0 gap-1 rounded-lg border border-border/70 bg-background/70 p-3", className)}>
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
  <div className="grid min-w-0 gap-1 rounded-lg border border-border/70 bg-background/70 p-3">
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

export { BookingSummaryCard }
export type { BookingSummaryCardProps }
