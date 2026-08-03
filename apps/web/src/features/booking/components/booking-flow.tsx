"use client"

import type { ReactNode } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { AppButton } from "@/components/common/app-button"
import { BookingLoadingOverlay } from "@/features/booking/components/booking-loading-overlay"
import { BookingStepHeader } from "@/features/booking/components/booking-step-header"
import { BookingStepShell } from "@/features/booking/components/booking-step-shell"
import { BookingSummaryCard } from "@/features/booking/components/booking-summary-card"
import { BookingSuccessStep } from "@/features/booking/components/booking-success-step"
import { CustomerDetailsForm } from "@/features/booking/components/customer-details-form"
import { DateTimePicker } from "@/features/booking/components/date-time-picker"
import { ServicePicker } from "@/features/booking/components/service-picker"
import { SmsVerificationStep } from "@/features/booking/components/sms-verification-step"
import { StaffPicker } from "@/features/booking/components/staff-picker"
import { useBookingFlow } from "@/features/booking/hooks/use-booking-flow"
import { useDebouncedValue } from "@/features/booking/hooks/use-debounced-value"
import { bookingStepIds } from "@/features/booking/types/flow"
import type { BookingStep } from "@/features/booking/types/flow"

const isBookingStep = (screen: string): screen is BookingStep =>
  bookingStepIds.includes(screen as BookingStep)

const BookingFlow = () => {
  const flow = useBookingFlow()
  const {
    actions,
    accountInviteVariant,
    availableStaffMembers,
    availableTimeSlots,
    bookingConsents,
    bookingDraftRestoreKey,
    completedReservation,
    currentScreen,
    customerDetails,
    isBookingReady,
    isBookingDraftHydrated,
    isCustomerDetailsComplete,
    isReservationDetailsComplete,
    isSoloBusiness,
    selectedServiceId,
    selectedStaffMember,
    selectedStaffMemberId,
    selectedService,
    selectedTimeSlot,
    selectedTimeSlotId,
    transitionState,
    visibleSteps,
  } = flow
  const currentStep = isBookingStep(currentScreen) ? currentScreen : undefined
  const summaryCustomerDetails = useDebouncedValue(customerDetails, 250)
  const loadingState = isBookingDraftHydrated
    ? transitionState
    : {
        description: "Sprawdzamy zapisany szkic i ustawiamy ostatni wybrany krok.",
        title: "Przywracamy rezerwację",
      }

  const summaryProps = {
    canUseEmailNotifications: Boolean(customerDetails.email),
    consents: bookingConsents,
    customerDetails: summaryCustomerDetails,
    isBookingReady,
    isCustomerDetailsComplete,
    isSoloBusiness,
    onConsentChange: actions.updateBookingConsents,
    onReserve: actions.reserve,
    selectedService,
    selectedStaffMember,
    selectedTimeSlot,
  }

  return (
    <>
      {currentStep ? <BookingIntroHeader /> : null}

      <div className="mx-auto grid w-full max-w-3xl gap-6 lg:items-start">
        <section className="grid min-w-0 gap-5">
          {currentStep ? (
            <BookingStepHeader
              canOpenStep={actions.canOpenStep}
              currentStep={currentStep}
              onStepSelect={actions.openStep}
              steps={visibleSteps}
            />
          ) : null}

        {currentScreen === "service" ? (
          <BookingStepShell
            description={
              isSoloBusiness
                ? "Wybierz usługę, która najlepiej odpowiada Twoim potrzebom."
                : "Wybierz usługę, a następnie osobę, która wykona wizytę."
            }
            footer={
              <div className="flex justify-end">
                <AppButton disabled={!selectedServiceId} onClick={actions.goToNextStepAfterService}>
                  Dalej
                  <ArrowRight aria-hidden="true" />
                </AppButton>
              </div>
            }
            title="Wybierz usługę"
          >
            <ServicePicker
              onServiceSelect={actions.selectService}
              selectedServiceId={selectedServiceId}
              services={flow.services}
            />
          </BookingStepShell>
        ) : null}

        {currentScreen === "staff" ? (
          <BookingStepShell
            description="Wybierz specjalistkę lub specjalistę dostępnego dla wybranej usługi."
            footer={
              <StepFooter>
                <AppButton onClick={() => actions.setCurrentStep("service")} variant="outline">
                  <ArrowLeft aria-hidden="true" />
                  Wróć
                </AppButton>
                <AppButton disabled={!selectedStaffMemberId} onClick={() => actions.setCurrentStep("datetime")}>
                  Dalej
                  <ArrowRight aria-hidden="true" />
                </AppButton>
              </StepFooter>
            }
            title="Wybierz pracownika"
          >
            <StaffPicker
              onStaffSelect={actions.selectStaffMember}
              selectedStaffMemberId={selectedStaffMemberId}
              staffMembers={availableStaffMembers}
            />
          </BookingStepShell>
        ) : null}

        {currentScreen === "datetime" ? (
          <BookingStepShell
            description="Wybierz dogodną datę i godzinę wizyty."
            footer={
              <StepFooter>
                <AppButton
                  onClick={() => actions.setCurrentStep(isSoloBusiness ? "service" : "staff")}
                  variant="outline"
                >
                  <ArrowLeft aria-hidden="true" />
                  Wróć
                </AppButton>
                <AppButton disabled={!selectedTimeSlotId} onClick={() => actions.setCurrentStep("customer")}>
                  Dalej
                  <ArrowRight aria-hidden="true" />
                </AppButton>
              </StepFooter>
            }
            title="Wybierz termin"
          >
            <DateTimePicker
              onTimeSlotSelect={actions.selectTimeSlot}
              selectedTimeSlotId={selectedTimeSlotId}
              timeSlots={availableTimeSlots}
            />
          </BookingStepShell>
        ) : null}

        {currentScreen === "customer" ? (
          <BookingStepShell
            description="Podaj dane kontaktowe potrzebne do potwierdzenia wizyty."
            footer={
              <StepFooter>
                <AppButton onClick={() => actions.setCurrentStep("datetime")} variant="outline">
                  <ArrowLeft aria-hidden="true" />
                  Wróć
                </AppButton>
                <AppButton disabled={!isReservationDetailsComplete} onClick={() => actions.setCurrentStep("summary")}>
                  Dalej
                  <ArrowRight aria-hidden="true" />
                </AppButton>
              </StepFooter>
            }
            title="Dane klientki"
          >
            <CustomerDetailsForm
              details={customerDetails}
              key={bookingDraftRestoreKey}
              onDetailsChange={actions.updateCustomerDetails}
            />
          </BookingStepShell>
        ) : null}

        {currentScreen === "summary" ? (
          <BookingStepShell
            description="Sprawdź szczegóły wizyty przed wysłaniem rezerwacji."
            footer={
              <div className="flex">
                <AppButton onClick={() => actions.setCurrentStep("customer")} variant="outline">
                  <ArrowLeft aria-hidden="true" />
                  Wróć
                </AppButton>
              </div>
            }
            title="Podsumowanie"
          >
            <BookingSummaryCard {...summaryProps} />
          </BookingStepShell>
        ) : null}

        {currentScreen === "verification" ? (
          <BookingStepShell
            description="Potwierdź numer telefonu, aby zabezpieczyć rezerwację i zakończyć proces."
            title="Weryfikacja SMS"
          >
            <SmsVerificationStep
              onResendCode={actions.resendSmsCode}
              onVerify={actions.verifySmsCode}
              phone={customerDetails.phone}
            />
          </BookingStepShell>
        ) : null}

        {currentScreen === "success" && completedReservation ? (
          <BookingSuccessStep
            accountInviteVariant={accountInviteVariant}
            isSoloBusiness={isSoloBusiness}
            reservation={completedReservation}
          />
        ) : null}
        </section>

        {loadingState ? <BookingLoadingOverlay {...loadingState} /> : null}
      </div>
    </>
  )
}

const BookingIntroHeader = () => (
  <header className="mx-auto grid w-full max-w-3xl gap-3">
    <p className="text-sm font-medium text-primary">Rezerwacja online</p>
    <div className="grid gap-2">
      <h1 className="font-heading text-4xl font-semibold leading-tight sm:text-5xl">
        Umów wizytę w kilku krokach
      </h1>
      <p className="text-base leading-7 text-muted-foreground">
        Wybierz usługę, dogodny termin i zostaw dane kontaktowe. Całość zajmie tylko chwilę.
      </p>
    </div>
  </header>
)

type StepFooterProps = {
  children: ReactNode
}

const StepFooter = ({ children }: StepFooterProps) => (
  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">{children}</div>
)

export { BookingFlow }
