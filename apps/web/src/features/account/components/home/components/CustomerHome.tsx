"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { AppButton } from "@/components/common/app-button";
import { ConfirmationDialog } from "@/components/common/confirmation-dialog";
import { SectionCard } from "@/components/common/section-card";
import { CustomerAppShell } from "@/features/account/components/CustomerAppShell";
import { AccountDashboardHeader } from "@/features/account/components/home/components/AccountDashboardHeader";
import {
  ReservationCard,
  ReservationSection,
} from "@/features/account/components/home/components/ReservationCards";
import {
  getGreeting,
  getLastVisitText,
  getUpcomingVisitText,
  parseReservationDate,
  sortReservationsAscending,
  sortReservationsDescending,
  startOfDay,
  todayFormatter,
} from "@/features/account/components/home/utils/accountHomeUtils";
import type { AccountSession } from "@/features/account/types/accountSession";
import { useAccountReservations } from "@/features/booking/hooks/useAccountReservations";
import type { StoredBookingReservation } from "@/features/booking/types/reservation";
import { updateStoredReservationStatus } from "@/features/booking/utils/reservationStorage";

type CustomerHomeProps = {
  accountSession: AccountSession;
};

const CustomerHome = ({ accountSession }: CustomerHomeProps) => {
  const reservations = useAccountReservations(accountSession.id);
  const [reservationToCancel, setReservationToCancel] =
    useState<StoredBookingReservation>();
  const today = useMemo(() => new Date(), []);
  const todayLabel = useMemo(() => todayFormatter.format(today), [today]);
  const activeReservations = useMemo(
    () =>
      sortReservationsAscending(
        reservations.filter((reservation) => {
          const reservationDate = parseReservationDate(reservation);

          return (
            (reservation.status === "confirmed" ||
              reservation.status === "pending") &&
            reservationDate >= startOfDay(today)
          );
        }),
      ),
    [reservations, today],
  );
  const historicalReservations = useMemo(
    () =>
      sortReservationsDescending(
        reservations.filter((reservation) => {
          const reservationDate = parseReservationDate(reservation);

          return reservationDate < startOfDay(today);
        }),
      ).slice(0, 2),
    [reservations, today],
  );
  const nextReservation = activeReservations[0];
  const lastHistoricalReservation = historicalReservations[0];

  const confirmCancelReservation = () => {
    if (reservationToCancel) {
      updateStoredReservationStatus(reservationToCancel.id, "cancelled");
    }

    setReservationToCancel(undefined);
  };

  return (
    <CustomerAppShell
      accountSession={accountSession}
      action={
        <AppButton nativeButton={false} render={<Link href="/booking" />}>
          <PlusCircle aria-hidden="true" />
          Nowa rezerwacja
        </AppButton>
      }
      title="Główny panel"
    >
      <div className="grid gap-6">
        <AccountDashboardHeader
          facts={[
            {
              label: "Najbliższa wizyta",
              value: getUpcomingVisitText(nextReservation, today),
            },
            {
              label: "Historia",
              value: getLastVisitText(lastHistoricalReservation, today),
            },
          ]}
          greeting={getGreeting(accountSession)}
          subtitle={`${todayLabel.charAt(0).toUpperCase()}${todayLabel.slice(1)}`}
          title="Twój plan wizyt"
        />

        <section className="grid gap-4">
          <h2 className="text-xl font-semibold tracking-normal">
            Najbliższa wizyta
          </h2>
          {nextReservation ? (
            <ReservationCard
              onCancelRequest={setReservationToCancel}
              reservation={nextReservation}
              variant="highlight"
            />
          ) : (
            <SectionCard>
              <div className="grid gap-4 text-sm text-muted-foreground">
                <p>Nie masz jeszcze zaplanowanej wizyty.</p>
                <div className="flex">
                  <AppButton
                    nativeButton={false}
                    render={<Link href="/booking" />}
                  >
                    Umów wizytę
                    <PlusCircle aria-hidden="true" />
                  </AppButton>
                </div>
              </div>
            </SectionCard>
          )}
        </section>

        <ReservationSection
          emptyDescription="Historia wizyt pojawi się tutaj po zakończonych rezerwacjach."
          reservations={historicalReservations}
          title="Ostatnie wizyty"
        />
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
  );
};

export { CustomerHome };
export type { CustomerHomeProps };
