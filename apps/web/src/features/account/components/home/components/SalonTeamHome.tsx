"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AppButton } from "@/components/common/app-button";
import { CustomerAppShell } from "@/features/account/components/CustomerAppShell";
import { PlanDayLoading } from "@/features/account/components/home/components/PlanDayLoading";
import { PlanDayMetrics } from "@/features/account/components/home/components/PlanDayMetrics";
import { PlanDayPicker } from "@/features/account/components/home/components/PlanDayPicker";
import { SalonWorkPlan } from "@/features/account/components/home/components/SalonWorkPlan";
import {
  isSameDate,
  mergeReservationsWithMocks,
  parseReservationDate,
  sortReservationsAscending,
  startOfDay,
} from "@/features/account/components/home/utils/accountHomeUtils";
import { createMockSalonDashboardReservations } from "@/features/account/mocks/salonDashboardReservations";
import type { AccountSession } from "@/features/account/types/accountSession";
import { getSalonDashboardSummary } from "@/features/account/utils/salonDashboardMetrics";
import { useStoredReservations } from "@/features/booking/hooks/useAccountReservations";
import type {
  BookingReservationStatus,
  StoredBookingReservation,
} from "@/features/booking/types/reservation";
import { updateStoredReservationStatus } from "@/features/booking/utils/reservationStorage";

type SalonTeamHomeProps = {
  accountSession: AccountSession;
};

const SalonTeamHome = ({ accountSession }: SalonTeamHomeProps) => {
  const storedReservations = useStoredReservations();
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(today));
  const [isDayLoading, setIsDayLoading] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<
    Record<string, BookingReservationStatus>
  >({});
  const mockReservations = useMemo(
    () => createMockSalonDashboardReservations(today),
    [today],
  );
  const baseReservations = useMemo(
    () => mergeReservationsWithMocks(storedReservations, mockReservations),
    [mockReservations, storedReservations],
  );
  const reservations = useMemo(
    () =>
      baseReservations.map((reservation) => ({
        ...reservation,
        status: statusOverrides[reservation.id] ?? reservation.status,
      })),
    [baseReservations, statusOverrides],
  );
  const dashboardSummary = useMemo(
    () => getSalonDashboardSummary(reservations, selectedDate, today),
    [reservations, selectedDate, today],
  );
  const todayPlanReservations = useMemo(
    () =>
      sortReservationsAscending(
        reservations.filter((reservation) => {
          const reservationDate = parseReservationDate(reservation);

          return (
            startOfDay(reservationDate).getTime() ===
            startOfDay(selectedDate).getTime()
          );
        }),
      ),
    [reservations, selectedDate],
  );

  useEffect(() => {
    if (!isDayLoading) {
      return;
    }

    const timeout = window.setTimeout(() => setIsDayLoading(false), 550);

    return () => window.clearTimeout(timeout);
  }, [isDayLoading, selectedDate]);

  const selectDate = (nextDate: Date) => {
    if (isSameDate(nextDate, selectedDate)) {
      return;
    }

    setSelectedDate(startOfDay(nextDate));
    setIsDayLoading(true);
  };

  const updateReservationStatus = (
    reservation: StoredBookingReservation,
    status: BookingReservationStatus,
  ) => {
    const updatedReservation = updateStoredReservationStatus(
      reservation.id,
      status,
    );

    if (!updatedReservation) {
      setStatusOverrides((currentOverrides) => ({
        ...currentOverrides,
        [reservation.id]: status,
      }));
    }
  };

  return (
    <CustomerAppShell
      accountSession={accountSession}
      action={
        <AppButton
          nativeButton={false}
          render={
            <Link href={{ pathname: "/booking", query: { source: "staff" } }} />
          }
        >
          <PlusCircle aria-hidden="true" />
          Utwórz wizytę
        </AppButton>
      }
      actionClassName="pt-6"
      description="Wybierz dzień, sprawdź wizyty i aktualizuj ich status w jednym miejscu."
      title="Plan dnia"
    >
      <div className="grid gap-6">
        <PlanDayPicker
          onDateChange={selectDate}
          selectedDate={selectedDate}
          today={today}
        />

        <div className="min-h-[34rem]">
          {isDayLoading ? (
            <PlanDayLoading />
          ) : (
            <div className="grid gap-6">
              <PlanDayMetrics summary={dashboardSummary} />

              <SalonWorkPlan
                currentDate={today}
                onStatusChange={updateReservationStatus}
                reservations={todayPlanReservations}
              />
            </div>
          )}
        </div>
      </div>
    </CustomerAppShell>
  );
};

export { SalonTeamHome };
export type { SalonTeamHomeProps };
