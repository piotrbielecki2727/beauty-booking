"use client"

import { CalendarClock, Clock, Edit3, PlusCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"

import { AppButton } from "@/components/common/app-button"
import { ConfirmationDialog } from "@/components/common/confirmation-dialog"
import { SectionCard } from "@/components/common/section-card"
import { Badge } from "@/components/ui/badge"
import { CustomerAppShell } from "@/features/account/components/CustomerAppShell"
import { useAccountSession } from "@/features/account/hooks/useAccountSession"
import { useAccountReservations } from "@/features/booking/hooks/useAccountReservations"
import type { BookingReservationStatus, StoredBookingReservation } from "@/features/booking/types/reservation"
import { updateStoredReservationStatus } from "@/features/booking/utils/reservationStorage"
import { formatDuration, formatPriceFrom } from "@/features/booking/utils/serviceFormatters"
import { useClientHydrated } from "@/hooks/use-client-hydrated"

const reservationStatusLabels: Record<BookingReservationStatus, string> = {
  cancelled: "Odwołana",
  completed: "Zakończona",
  confirmed: "Potwierdzona",
  pending: "Oczekuje potwierdzenia",
}

const reservationStatusBadgeVariants: Record<BookingReservationStatus, "destructive" | "secondary"> = {
  cancelled: "destructive",
  completed: "secondary",
  confirmed: "secondary",
  pending: "secondary",
}

const sortReservationsByDate = (reservations: StoredBookingReservation[]) =>
  [...reservations].sort((firstReservation, secondReservation) => {
    const firstTime = `${firstReservation.timeSlot.dateValue}T${firstReservation.timeSlot.startTime}`
    const secondTime = `${secondReservation.timeSlot.dateValue}T${secondReservation.timeSlot.startTime}`

    return firstTime.localeCompare(secondTime)
  })

const CustomerVisitsPage = () => {
  const isHydrated = useClientHydrated()

  if (!isHydrated) {
    return <VisitsLoading />
  }

  return <CustomerVisitsContent />
}

const CustomerVisitsContent = () => {
  const accountSession = useAccountSession()
  const reservations = useAccountReservations(accountSession?.id ?? "")
  const [reservationToCancel, setReservationToCancel] = useState<StoredBookingReservation>()
  const activeReservations = useMemo(
    () =>
      sortReservationsByDate(
        reservations.filter((reservation) => reservation.status === "confirmed" || reservation.status === "pending")
      ),
    [reservations]
  )
  const cancelledReservations = useMemo(
    () => sortReservationsByDate(reservations.filter((reservation) => reservation.status === "cancelled")),
    [reservations]
  )

  if (!accountSession) {
    return <VisitsLoginRequired />
  }

  const confirmCancelReservation = () => {
    if (reservationToCancel) {
      updateStoredReservationStatus(reservationToCancel.id, "cancelled")
    }

    setReservationToCancel(undefined)
  }

  return (
    <CustomerAppShell
      accountSession={accountSession}
      action={
        <AppButton nativeButton={false} render={<Link href="/booking" />}>
          <PlusCircle aria-hidden="true" />
          Nowa rezerwacja
        </AppButton>
      }
      description="Sprawdź nadchodzące terminy, edytuj wizytę albo odwołaj rezerwację."
      title="Moje wizyty"
    >
      <div className="grid gap-6">
        <VisitsSection
          emptyDescription="Nie masz jeszcze aktywnych wizyt. Możesz od razu umówić nowy termin."
          onCancelRequest={setReservationToCancel}
          reservations={activeReservations}
          title="Aktualne rezerwacje"
        />

        {cancelledReservations.length > 0 ? (
          <VisitsSection
            emptyDescription=""
            onCancelRequest={setReservationToCancel}
            reservations={cancelledReservations}
            title="Odwołane wizyty"
          />
        ) : null}
      </div>

      <ConfirmationDialog
        confirmLabel="Odwołaj wizytę"
        description={
          reservationToCancel
            ? `Odwołasz wizytę ${reservationToCancel.service.name} w terminie ${reservationToCancel.timeSlot.dateLabel}, ${reservationToCancel.timeSlot.startTime}.`
            : ""
        }
        isOpen={Boolean(reservationToCancel)}
        onCancel={() => setReservationToCancel(undefined)}
        onConfirm={confirmCancelReservation}
        title="Odwołać wybraną wizytę?"
      />
    </CustomerAppShell>
  )
}

const VisitsLoading = () => <main className="min-h-screen bg-background" />

type VisitsSectionProps = {
  emptyDescription: string
  onCancelRequest: (reservation: StoredBookingReservation) => void
  reservations: StoredBookingReservation[]
  title: string
}

const VisitsSection = ({ emptyDescription, onCancelRequest, reservations, title }: VisitsSectionProps) => (
  <section className="grid gap-4">
    <h2 className="font-heading text-2xl font-medium">{title}</h2>

    {reservations.length > 0 ? (
      <div className="grid gap-4 md:grid-cols-2">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            onCancelRequest={onCancelRequest}
            reservation={reservation}
          />
        ))}
      </div>
    ) : (
      <SectionCard>
        <div className="grid gap-4 text-sm text-muted-foreground">
          <p>{emptyDescription}</p>
          <div className="flex">
            <AppButton nativeButton={false} render={<Link href="/booking" />}>
              Umów wizytę
              <PlusCircle aria-hidden="true" />
            </AppButton>
          </div>
        </div>
      </SectionCard>
    )}
  </section>
)

type ReservationCardProps = {
  onCancelRequest: (reservation: StoredBookingReservation) => void
  reservation: StoredBookingReservation
}

const ReservationCard = ({ onCancelRequest, reservation }: ReservationCardProps) => {
  const status = reservation.status ?? "confirmed"
  const isCancelled = status === "cancelled"
  const isCompleted = status === "completed"

  return (
    <SectionCard
      action={<Badge variant={reservationStatusBadgeVariants[status]}>{reservationStatusLabels[status]}</Badge>}
      title={reservation.service.name}
    >
      <div className="grid gap-4">
        <div className="grid gap-3 text-sm">
          <ReservationMetaItem
            icon={<CalendarClock aria-hidden="true" />}
            label="Termin"
            value={`${reservation.timeSlot.dateLabel}, ${reservation.timeSlot.startTime}`}
          />
          <ReservationMetaItem
            icon={<Clock aria-hidden="true" />}
            label="Czas i cena"
            value={`${formatDuration(reservation.service.durationMinutes)} / ${formatPriceFrom(reservation.service.priceFrom)}`}
          />
          {reservation.staffMember ? (
            <ReservationMetaItem label="Osoba" value={`${reservation.staffMember.name}, ${reservation.staffMember.role}`} />
          ) : null}
        </div>

        <div className="grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
          <AppButton
            disabled={isCancelled || isCompleted}
            nativeButton={false}
            render={<Link href={{ pathname: "/booking", query: { edit: reservation.id } }} />}
            variant="outline"
          >
            <Edit3 aria-hidden="true" />
            Edytuj
          </AppButton>
          <AppButton
            disabled={isCancelled || isCompleted}
            onClick={() => onCancelRequest(reservation)}
            type="button"
            variant="destructive"
          >
            <XCircle aria-hidden="true" />
            Odwołaj
          </AppButton>
        </div>
      </div>
    </SectionCard>
  )
}

type ReservationMetaItemProps = {
  icon?: ReactNode
  label: string
  value: string
}

const ReservationMetaItem = ({ icon, label, value }: ReservationMetaItemProps) => (
  <div className="flex gap-3">
    {icon ? <span className="mt-0.5 text-primary [&_svg]:size-4">{icon}</span> : null}
    <div className="grid gap-0.5">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
)

const VisitsLoginRequired = () => (
  <main className="grid min-h-screen place-items-center bg-background px-4 py-8">
    <SectionCard title="Zaloguj się, aby zobaczyć wizyty">
      <div className="grid gap-4">
        <p className="text-sm leading-6 text-muted-foreground">
          Lista rezerwacji jest dostępna po zalogowaniu do konta klientki.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <AppButton nativeButton={false} render={<Link href="/login" />}>
            Zaloguj się
          </AppButton>
          <AppButton nativeButton={false} render={<Link href="/register/form" />} variant="outline">
            Załóż konto
          </AppButton>
        </div>
      </div>
    </SectionCard>
  </main>
)

export { CustomerVisitsPage }
