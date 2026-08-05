import type { AccountSession } from "@/features/account/types/accountSession";
import { bookingSteps } from "@/features/booking/config/bookingSteps";
import type { BookingConsents } from "@/features/booking/types/consents";
import type { BookingCustomerDetails } from "@/features/booking/types/customer";
import type { StoredBookingReservation } from "@/features/booking/types/reservation";
import { getStoredReservationById } from "@/features/booking/utils/reservationStorage";

const bookingTransitionDelay = 900;

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

const getEditableReservation = (
  reservationId: string | undefined,
  accountSession: AccountSession | undefined,
) => {
  if (!reservationId || !accountSession) {
    return undefined;
  }

  // TODO backend: replace direct localStorage lookup with a reservation details API request.
  const reservation = getStoredReservationById(reservationId);

  if (
    !reservation ||
    reservation.accountId !== accountSession.id ||
    reservation.status === "cancelled"
  ) {
    return undefined;
  }

  return reservation;
};

const getVisibleBookingSteps = (
  isStaffCreatedReservation: boolean,
  isSoloBusiness: boolean,
) =>
  bookingSteps.filter((step) => {
    if (step.id === "customer") {
      return isStaffCreatedReservation;
    }

    if (step.id === "staff") {
      return !isSoloBusiness;
    }

    return true;
  });

type ReservationCustomerDetailsOptions = {
  accountSession: AccountSession;
  customerDetails: BookingCustomerDetails;
  isStaffCreatedReservation: boolean;
};

const getReservationCustomerDetails = ({
  accountSession,
  customerDetails,
  isStaffCreatedReservation,
}: ReservationCustomerDetailsOptions) =>
  isStaffCreatedReservation
    ? customerDetails
    : {
        email: accountSession.email,
        firstName: accountSession.firstName,
        lastName: accountSession.lastName,
        note: "",
        phone: accountSession.phone,
      };

type ReservationTransitionCopyOptions = {
  isEditingReservation: boolean;
  isStaffCreatedReservation: boolean;
};

const getReservationTransitionCopy = ({
  isEditingReservation,
  isStaffCreatedReservation,
}: ReservationTransitionCopyOptions) => ({
  description: isEditingReservation
    ? "Aktualizujemy wybraną wizytę."
    : isStaffCreatedReservation
      ? "Zapisujemy szczegóły wizyty w kalendarzu salonu."
      : "Zapisujemy szczegóły wizyty na Twoim koncie.",
  title: isEditingReservation ? "Zapisujemy zmiany" : "Tworzymy rezerwację",
});

const resetNotificationConsents = (consents: BookingConsents) => ({
  ...consents,
  emailNotifications: false,
  phoneNotifications: false,
});

const getManualReservationAccountId = () => `manual-${Date.now()}`;

const getEditedTimeSlotFallback = (
  reservation: StoredBookingReservation | undefined,
) => reservation?.timeSlot;

export {
  bookingTransitionDelay,
  getEditableReservation,
  getEditedTimeSlotFallback,
  getManualReservationAccountId,
  getReservationCustomerDetails,
  getReservationTransitionCopy,
  getVisibleBookingSteps,
  resetNotificationConsents,
  wait,
};
