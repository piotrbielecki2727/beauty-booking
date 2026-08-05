import { useCallback, type Dispatch, type SetStateAction } from "react";

import type { AccountSession } from "@/features/account/types/accountSession";
import type { BookingConsents } from "@/features/booking/types/consents";
import type { BookingCustomerDetails } from "@/features/booking/types/customer";
import type {
  BookingScreen,
  BookingTransitionState,
} from "@/features/booking/types/flow";
import type { StoredBookingReservation } from "@/features/booking/types/reservation";
import type { BeautyService } from "@/features/booking/types/service";
import type { BookingStaffMember } from "@/features/booking/types/staff";
import type { BookingTimeSlot } from "@/features/booking/types/timeSlot";
import {
  bookingTransitionDelay,
  getManualReservationAccountId,
  getReservationCustomerDetails,
  getReservationTransitionCopy,
  wait,
} from "@/features/booking/utils/bookingFlowState";
import {
  createStoredReservation,
  updateStoredReservation,
} from "@/features/booking/utils/reservationStorage";

type UseBookingReserveActionOptions = {
  accountSession?: AccountSession;
  bookingConsents: BookingConsents;
  customerDetails: BookingCustomerDetails;
  editingReservationId?: string;
  isBookingReady: boolean;
  isEditingReservation: boolean;
  isSoloBusiness: boolean;
  isStaffCreatedReservation: boolean;
  selectedService?: BeautyService;
  selectedStaffMember?: BookingStaffMember;
  selectedTimeSlot?: BookingTimeSlot;
  setCompletedReservation: Dispatch<
    SetStateAction<StoredBookingReservation | undefined>
  >;
  setCurrentScreen: Dispatch<SetStateAction<BookingScreen>>;
  setTransitionState: Dispatch<SetStateAction<BookingTransitionState | undefined>>;
};

const useBookingReserveAction = ({
  accountSession,
  bookingConsents,
  customerDetails,
  editingReservationId,
  isBookingReady,
  isEditingReservation,
  isSoloBusiness,
  isStaffCreatedReservation,
  selectedService,
  selectedStaffMember,
  selectedTimeSlot,
  setCompletedReservation,
  setCurrentScreen,
  setTransitionState,
}: UseBookingReserveActionOptions) =>
  useCallback(async () => {
    if (
      !isBookingReady ||
      !accountSession ||
      !selectedService ||
      !selectedTimeSlot ||
      (!isSoloBusiness && !selectedStaffMember)
    ) {
      return;
    }

    setTransitionState(
      getReservationTransitionCopy({
        isEditingReservation,
        isStaffCreatedReservation,
      }),
    );

    await wait(bookingTransitionDelay);

    const reservation = editingReservationId
      ? updateStoredReservation({
          consents: bookingConsents,
          reservationId: editingReservationId,
          service: selectedService,
          staffMember: selectedStaffMember,
          timeSlot: selectedTimeSlot,
        })
      : createStoredReservation({
          accountId: isStaffCreatedReservation
            ? getManualReservationAccountId()
            : accountSession.id,
          consents: bookingConsents,
          customerDetails: getReservationCustomerDetails({
            accountSession,
            customerDetails,
            isStaffCreatedReservation,
          }),
          service: selectedService,
          staffMember: selectedStaffMember,
          timeSlot: selectedTimeSlot,
        }).reservation;

    if (!reservation) {
      setTransitionState(undefined);
      return;
    }

    setCompletedReservation(reservation);
    setCurrentScreen("success");
    setTransitionState(undefined);
  }, [
    accountSession,
    bookingConsents,
    customerDetails,
    editingReservationId,
    isBookingReady,
    isEditingReservation,
    isSoloBusiness,
    isStaffCreatedReservation,
    selectedService,
    selectedStaffMember,
    selectedTimeSlot,
    setCompletedReservation,
    setCurrentScreen,
    setTransitionState,
  ]);

export { useBookingReserveAction };
export type { UseBookingReserveActionOptions };
