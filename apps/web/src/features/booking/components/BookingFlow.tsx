"use client"

import { useSearchParams } from "next/navigation"

import { ConfirmationDialog } from "@/components/common/confirmation-dialog"
import { CustomerAppShell } from "@/features/account/components/CustomerAppShell"
import { BookingAccessRequired } from "@/features/booking/components/BookingAccessRequired"
import { BookingFlowScreens } from "@/features/booking/components/BookingFlowScreens"
import { BookingLoadingOverlay } from "@/features/booking/components/BookingLoadingOverlay"
import { BookingStepHeader } from "@/features/booking/components/BookingStepHeader"
import { useBookingFlow } from "@/features/booking/hooks/useBookingFlow"
import { useBookingNavigationGuard } from "@/features/booking/hooks/useBookingNavigationGuard"
import { bookingStepIds, type BookingStep } from "@/features/booking/types/flow"
import {
  createBookingSummaryProps,
  hasBookingFormProgress,
} from "@/features/booking/utils/bookingFlowPresentation"
import { useClientHydrated } from "@/hooks/use-client-hydrated"

const isBookingStep = (screen: string): screen is BookingStep =>
  bookingStepIds.includes(screen as BookingStep)

const BookingFlow = () => {
  const isHydrated = useClientHydrated()

  if (!isHydrated) {
    return <BookingPageLoading />
  }

  return <BookingFlowContent />
}

const BookingFlowContent = () => {
  const searchParams = useSearchParams()
  const editReservationId = searchParams.get("edit") ?? undefined
  const source = searchParams.get("source") ?? undefined
  const flow = useBookingFlow({ editReservationId, source })
  const {
    actions,
    accountSession,
    bookingConsents,
    currentScreen,
    customerDetails,
    isBookingReady,
    isCustomerDetailsComplete,
    isEditingReservation,
    isSoloBusiness,
    isStaffCreatedReservation,
    reservationSubmitLabel,
    selectedService,
    selectedServiceId,
    selectedStaffMember,
    selectedStaffMemberId,
    selectedTimeSlot,
    selectedTimeSlotId,
    transitionState,
    visibleSteps,
  } = flow
  const currentStep = isBookingStep(currentScreen) ? currentScreen : undefined
  const hasStartedReservation = hasBookingFormProgress({
    bookingConsents,
    currentScreen,
    customerDetails,
    isStaffCreatedReservation,
    selectedServiceId,
    selectedStaffMemberId,
    selectedTimeSlotId,
  })
  const navigationGuard = useBookingNavigationGuard({
    shouldGuard: hasStartedReservation,
  })
  const summaryProps = createBookingSummaryProps({
    accountSession,
    bookingConsents,
    customerDetails,
    isBookingReady,
    isCustomerDetailsComplete,
    isSoloBusiness,
    isStaffCreatedReservation,
    onConsentChange: actions.updateBookingConsents,
    onReserve: actions.reserve,
    reservationSubmitLabel,
    selectedService,
    selectedStaffMember,
    selectedTimeSlot,
  })

  if (!accountSession) {
    return <BookingAccessRequired />
  }

  return (
    <CustomerAppShell
      accountSession={accountSession}
      action={
        currentStep ? (
          <BookingStepHeader
            canOpenStep={actions.canOpenStep}
            className="w-full max-w-[50rem]"
            currentStep={currentStep}
            onStepSelect={actions.openStep}
            steps={visibleSteps}
          />
        ) : null
      }
      actionClassName="hidden flex-1 justify-end pl-14 lg:flex"
      contentClassName="max-w-[96rem]"
      description={
        isStaffCreatedReservation
          ? "Wpisz dane klienta lub klientki, wybierz usługę, termin i zapisz wizytę w kalendarzu."
          : "Wybierz usługę, termin i potwierdź szczegóły wizyty."
      }
      headerContentClassName="max-w-[96rem]"
      onNavigateRequest={navigationGuard.requestNavigation}
      title={isEditingReservation ? "Edytuj wizytę" : "Nowa rezerwacja"}
    >
      <section className="grid w-full min-w-0 gap-5">
        {currentStep ? (
          <div className="lg:hidden">
            <BookingStepHeader
              canOpenStep={actions.canOpenStep}
              currentStep={currentStep}
              onStepSelect={actions.openStep}
              steps={visibleSteps}
            />
          </div>
        ) : null}

        <BookingFlowScreens flow={flow} summaryProps={summaryProps} />
      </section>

      {transitionState ? <BookingLoadingOverlay {...transitionState} /> : null}
      <ConfirmationDialog
        description="Masz rozpoczętą rezerwację. Jeśli opuścisz formularz, aktualny wybór nie zostanie zachowany."
        isOpen={navigationGuard.isNavigationGuardOpen}
        onCancel={navigationGuard.cancelPendingNavigation}
        onConfirm={navigationGuard.confirmPendingNavigation}
        title="Opuścić rezerwację?"
      />
    </CustomerAppShell>
  )
}

const BookingPageLoading = () => <main className="min-h-screen bg-background" />

export { BookingFlow }
