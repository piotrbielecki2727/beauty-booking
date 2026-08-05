import { CalendarClock, Clock, Edit3, XCircle } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { AppButton } from "@/components/common/app-button";
import { SectionCard } from "@/components/common/section-card";
import type { StoredBookingReservation } from "@/features/booking/types/reservation";
import {
  formatDuration,
  formatPrice,
  formatPriceFrom,
} from "@/features/booking/utils/serviceFormatters";

type ReservationCardProps = {
  onCancelRequest?: (reservation: StoredBookingReservation) => void;
  reservation: StoredBookingReservation;
  showCustomer?: boolean;
  showRevenue?: boolean;
  variant?: "default" | "highlight";
};

type ReservationMetaItemProps = {
  icon?: ReactNode;
  label: string;
  value: string;
};

type ReservationSectionProps = {
  emptyDescription: string;
  reservations: StoredBookingReservation[];
  showCustomer?: boolean;
  showRevenue?: boolean;
  title: string;
};

const ReservationMetaItem = ({
  icon,
  label,
  value,
}: ReservationMetaItemProps) => (
  <div className="flex gap-3">
    {icon ? (
      <span className="mt-0.5 text-primary [&_svg]:size-4">{icon}</span>
    ) : null}
    <div className="grid min-w-0 gap-0.5">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="min-w-0 [overflow-wrap:anywhere] font-medium">{value}</p>
    </div>
  </div>
);

const ReservationCard = ({
  onCancelRequest,
  reservation,
  showCustomer = false,
  showRevenue = false,
  variant = "default",
}: ReservationCardProps) => (
  <SectionCard
    className={
      variant === "highlight" ? "border-primary/30 bg-primary/5" : undefined
    }
    title={reservation.service.name}
  >
    <div className="grid gap-4">
      <div className="grid gap-4 text-sm md:grid-cols-2">
        <ReservationMetaItem
          icon={<CalendarClock aria-hidden="true" />}
          label="Termin"
          value={`${reservation.timeSlot.dateLabel}, ${reservation.timeSlot.startTime}`}
        />
        <ReservationMetaItem
          icon={<Clock aria-hidden="true" />}
          label={showRevenue ? "Zysk" : "Czas i cena"}
          value={
            showRevenue
              ? formatPrice(reservation.service.priceFrom)
              : `${formatDuration(reservation.service.durationMinutes)} / ${
                  showCustomer
                    ? formatPrice(reservation.service.priceFrom)
                    : formatPriceFrom(reservation.service.priceFrom)
                }`
          }
        />
        {reservation.staffMember ? (
          <ReservationMetaItem
            label="Osoba"
            value={`${reservation.staffMember.name}, ${reservation.staffMember.role}`}
          />
        ) : null}
        {showCustomer ? (
          <ReservationMetaItem
            label="Klient/ka"
            value={`${reservation.customerDetails.firstName} ${reservation.customerDetails.lastName}`.trim()}
          />
        ) : null}
      </div>

      {onCancelRequest ? (
        <div className="grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
          <AppButton
            nativeButton={false}
            render={
              <Link
                href={{ pathname: "/booking", query: { edit: reservation.id } }}
              />
            }
            variant="outline"
          >
            <Edit3 aria-hidden="true" />
            Edytuj
          </AppButton>
          <AppButton
            onClick={() => onCancelRequest(reservation)}
            type="button"
            variant="destructive"
          >
            <XCircle aria-hidden="true" />
            Odwołaj
          </AppButton>
        </div>
      ) : null}
    </div>
  </SectionCard>
);

const ReservationSection = ({
  emptyDescription,
  reservations,
  showCustomer = false,
  showRevenue = false,
  title,
}: ReservationSectionProps) => (
  <section className="grid gap-4">
    <h2 className="text-xl font-semibold tracking-normal">{title}</h2>

    {reservations.length > 0 ? (
      <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        {reservations.map((reservation) => (
          <ReservationCard
            key={reservation.id}
            reservation={reservation}
            showCustomer={showCustomer}
            showRevenue={showRevenue}
          />
        ))}
      </div>
    ) : (
      <SectionCard>
        <p className="text-sm leading-6 text-muted-foreground">
          {emptyDescription}
        </p>
      </SectionCard>
    )}
  </section>
);

export { ReservationCard, ReservationSection };
export type {
  ReservationCardProps,
  ReservationMetaItemProps,
  ReservationSectionProps,
};
