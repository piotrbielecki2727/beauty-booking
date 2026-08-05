import { useCallback, type Dispatch, type SetStateAction } from "react";

import type {
  BookingScreen,
  BookingStep,
} from "@/features/booking/types/flow";
import type { BeautyService } from "@/features/booking/types/service";
import type { BookingStaffMember } from "@/features/booking/types/staff";
import type { BookingTimeSlot } from "@/features/booking/types/timeSlot";

type UseBookingStepNavigationOptions = {
  isCustomerDetailsComplete: boolean;
  isSoloBusiness: boolean;
  isStaffCreatedReservation: boolean;
  selectedService?: BeautyService;
  selectedServiceId?: string;
  selectedStaffMember?: BookingStaffMember;
  selectedTimeSlot?: BookingTimeSlot;
  setCurrentScreen: Dispatch<SetStateAction<BookingScreen>>;
};

const useBookingStepNavigation = ({
  isCustomerDetailsComplete,
  isSoloBusiness,
  isStaffCreatedReservation,
  selectedService,
  selectedServiceId,
  selectedStaffMember,
  selectedTimeSlot,
  setCurrentScreen,
}: UseBookingStepNavigationOptions) => {
  const goToNextStepAfterCustomer = useCallback(() => {
    if (isCustomerDetailsComplete) {
      setCurrentScreen("service");
    }
  }, [isCustomerDetailsComplete, setCurrentScreen]);

  const goToNextStepAfterService = useCallback(() => {
    if (selectedServiceId) {
      setCurrentScreen(isSoloBusiness ? "datetime" : "staff");
    }
  }, [isSoloBusiness, selectedServiceId, setCurrentScreen]);

  const canOpenStep = useCallback(
    (step: BookingStep) => {
      if (step === "customer") {
        return isStaffCreatedReservation;
      }

      if (step === "service") {
        return !isStaffCreatedReservation || isCustomerDetailsComplete;
      }

      if (step === "staff") {
        return (
          Boolean(selectedService) &&
          (!isStaffCreatedReservation || isCustomerDetailsComplete)
        );
      }

      if (step === "datetime") {
        return (
          Boolean(selectedService) &&
          (isSoloBusiness || Boolean(selectedStaffMember)) &&
          (!isStaffCreatedReservation || isCustomerDetailsComplete)
        );
      }

      if (step === "summary") {
        return Boolean(selectedTimeSlot);
      }

      return false;
    },
    [
      isCustomerDetailsComplete,
      isSoloBusiness,
      isStaffCreatedReservation,
      selectedService,
      selectedStaffMember,
      selectedTimeSlot,
    ],
  );

  const openStep = useCallback(
    (step: BookingStep) => {
      if (canOpenStep(step)) {
        setCurrentScreen(step);
      }
    },
    [canOpenStep, setCurrentScreen],
  );

  const setCurrentStep = useCallback(
    (step: BookingStep) => {
      setCurrentScreen(step);
    },
    [setCurrentScreen],
  );

  return {
    canOpenStep,
    goToNextStepAfterCustomer,
    goToNextStepAfterService,
    openStep,
    setCurrentStep,
  };
};

export { useBookingStepNavigation };
export type { UseBookingStepNavigationOptions };
