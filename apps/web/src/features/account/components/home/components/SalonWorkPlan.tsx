"use client";

import { AppDropdown } from "@/components/common/app-dropdown";
import {
  getPlanVisitStatus,
  planStatusOptions,
  planVisitColumns,
  type PlanVisitColumn,
  type PlanVisitColumnConfig,
} from "@/features/account/components/home/utils/accountHomeUtils";
import type {
  BookingReservationStatus,
  StoredBookingReservation,
} from "@/features/booking/types/reservation";
import { formatPrice } from "@/features/booking/utils/serviceFormatters";

type SalonWorkPlanProps = {
  currentDate: Date;
  onStatusChange: (
    reservation: StoredBookingReservation,
    status: BookingReservationStatus,
  ) => void;
  reservations: StoredBookingReservation[];
};

type PlanVisitColumnProps = {
  column: PlanVisitColumnConfig;
  currentDate: Date;
  onStatusChange: (
    reservation: StoredBookingReservation,
    status: BookingReservationStatus,
  ) => void;
  reservations: StoredBookingReservation[];
};

type SalonPlanRowProps = {
  currentDate: Date;
  onStatusChange: (
    reservation: StoredBookingReservation,
    status: BookingReservationStatus,
  ) => void;
  reservation: StoredBookingReservation;
};

const SalonPlanRow = ({
  currentDate,
  onStatusChange,
  reservation,
}: SalonPlanRowProps) => {
  const customerName =
    `${reservation.customerDetails.firstName} ${reservation.customerDetails.lastName}`.trim();
  const status = getPlanVisitStatus(reservation, currentDate);
  const statusValue = status.column === "active" ? "confirmed" : status.column;
  const isCancelled = status.column === "cancelled";

  return (
    <div
      className={`grid gap-2 rounded-lg border border-border/70 px-3 py-2.5 text-sm shadow-sm ${status.cardClassName}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="grid min-w-0 gap-0.5">
          <p
            className={`text-xs font-medium ${isCancelled ? "text-destructive" : "text-primary"}`}
          >
            {reservation.timeSlot.startTime} - {reservation.timeSlot.endTime}
          </p>
          <p className="min-w-0 [overflow-wrap:anywhere] font-medium leading-5">
            {reservation.service.name}
          </p>
        </div>
        <span className="shrink-0 font-medium">
          {formatPrice(reservation.service.priceFrom)}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 [overflow-wrap:anywhere] text-sm leading-5 text-muted-foreground">
          {customerName}
          {reservation.staffMember ? `, ${reservation.staffMember.name}` : ""}
        </p>
        <AppDropdown
          className={`h-7 w-fit min-w-28 rounded-full px-2.5 text-xs ${status.className}`}
          contentClassName="min-w-44"
          onValueChange={(value) =>
            onStatusChange(reservation, value as BookingReservationStatus)
          }
          options={planStatusOptions}
          value={statusValue}
        />
      </div>
    </div>
  );
};

const PlanVisitColumnCard = ({
  column,
  currentDate,
  onStatusChange,
  reservations,
}: PlanVisitColumnProps) => (
  <div className="grid min-h-[24rem] grid-rows-[auto_minmax(0,1fr)] rounded-lg border border-border/70 bg-background/55">
    <div className="flex items-center justify-between gap-3 border-b border-border/70 px-3 py-2.5">
      <h3 className="font-medium leading-5">{column.title}</h3>
      <span className="rounded-full border border-border bg-card px-2 py-0.5 text-xs font-medium text-muted-foreground">
        {reservations.length}
      </span>
    </div>
    {reservations.length > 0 ? (
      <div className="grid max-h-[38rem] content-start gap-2 overflow-y-auto p-2">
        {reservations.map((reservation) => (
          <SalonPlanRow
            currentDate={currentDate}
            key={reservation.id}
            onStatusChange={onStatusChange}
            reservation={reservation}
          />
        ))}
      </div>
    ) : (
      <p className="px-3 py-3 text-sm leading-6 text-muted-foreground">
        {column.emptyText}
      </p>
    )}
  </div>
);

const SalonWorkPlan = ({
  currentDate,
  onStatusChange,
  reservations,
}: SalonWorkPlanProps) => {
  const reservationsByColumn = planVisitColumns.reduce<
    Record<PlanVisitColumn, StoredBookingReservation[]>
  >(
    (columns, column) => ({
      ...columns,
      [column.id]: reservations.filter(
        (reservation) =>
          getPlanVisitStatus(reservation, currentDate).column === column.id,
      ),
    }),
    {
      active: [],
      cancelled: [],
      completed: [],
    },
  );

  return (
    <section className="rounded-lg border border-border/70 bg-card p-3 shadow-sm sm:p-4">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-1">
          <h2 className="text-xl font-semibold tracking-normal">Wizyty</h2>
        </div>
      </div>
      {reservations.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {planVisitColumns.map((column) => (
            <PlanVisitColumnCard
              column={column}
              currentDate={currentDate}
              key={column.id}
              onStatusChange={onStatusChange}
              reservations={reservationsByColumn[column.id]}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border/70 bg-background/60 px-4 py-4">
          <p className="text-sm leading-6 text-muted-foreground">
            Na wybrany dzień nie ma jeszcze zaplanowanych wizyt.
          </p>
        </div>
      )}
    </section>
  );
};

export { PlanVisitColumnCard, SalonPlanRow, SalonWorkPlan };
export type {
  PlanVisitColumnProps,
  SalonPlanRowProps,
  SalonWorkPlanProps,
};
