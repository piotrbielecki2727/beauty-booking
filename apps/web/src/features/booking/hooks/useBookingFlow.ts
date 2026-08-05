"use client";

import { useCallback, useState } from "react";

import { useAccountSession } from "@/features/account/providers/accountProvider";
import { useBusinessSettings } from "@/features/business-settings/hooks/useBusinessSettings";
import { useStoredReservations } from "@/features/booking/hooks/useAccountReservations";
import { useBookingReserveAction } from "@/features/booking/hooks/useBookingReserveAction";
import { useBookingSelectionState } from "@/features/booking/hooks/useBookingSelectionState";
import { useBookingStepNavigation } from "@/features/booking/hooks/useBookingStepNavigation";
import {
  customerDetailsSchema,
  emptyCustomerDetails,
  type BookingCustomerDetails,
} from "@/features/booking/schemas/customerDetailsSchema";
import {
  emptyBookingConsents,
  type BookingConsents,
} from "@/features/booking/types/consents";
import type {
  BookingScreen,
  BookingTransitionState,
} from "@/features/booking/types/flow";
import type { StoredBookingReservation } from "@/features/booking/types/reservation";
import {
  getEditableReservation,
  getVisibleBookingSteps,
  resetNotificationConsents,
} from "@/features/booking/utils/bookingFlowState";

type UseBookingFlowOptions = {
  editReservationId?: string;
  source?: string;
};

const useBookingFlow = ({
  editReservationId,
  source,
}: UseBookingFlowOptions = {}) => {
  const businessSettings = useBusinessSettings();
  const isSoloBusiness = businessSettings.booking.isSoloBusiness;
  const isStaffCreatedReservation = source === "staff";
  const accountSession = useAccountSession();
  const reservations = useStoredReservations();
  const initialEditedReservation = getEditableReservation(
    editReservationId,
    accountSession,
  );
  const [editingReservationId] = useState(initialEditedReservation?.id);
  const [bookingConsents, setBookingConsents] = useState<BookingConsents>(
    initialEditedReservation?.consents ?? emptyBookingConsents,
  );
  const [customerDetails, setCustomerDetails] =
    useState<BookingCustomerDetails>(
      initialEditedReservation?.customerDetails ?? emptyCustomerDetails,
    );
  const [completedReservation, setCompletedReservation] =
    useState<StoredBookingReservation>();
  const [currentScreen, setCurrentScreen] = useState<BookingScreen>(
    initialEditedReservation
      ? "summary"
      : isStaffCreatedReservation
        ? "customer"
        : "service",
  );
  const [selectedServiceId, setSelectedServiceId] = useState<
    string | undefined
  >(initialEditedReservation?.service.id);
  const [selectedStaffMemberId, setSelectedStaffMemberId] = useState<
    string | undefined
  >(initialEditedReservation?.staffMember?.id);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<
    string | undefined
  >(initialEditedReservation?.timeSlot.id);
  const [transitionState, setTransitionState] =
    useState<BookingTransitionState>();

  const bookingSelection = useBookingSelectionState({
    businessSettings,
    editingReservationId,
    initialEditedReservation,
    isSoloBusiness,
    reservations,
    selectedServiceId,
    selectedStaffMemberId,
    selectedTimeSlotId,
  });
  const {
    availableStaffMembers,
    availableTimeSlots,
    selectedService,
    selectedStaffMember,
    selectedTimeSlot,
    services,
    staffServiceDetails,
  } = bookingSelection;
  const visibleSteps = getVisibleBookingSteps(
    isStaffCreatedReservation,
    isSoloBusiness,
  );
  const isAuthenticated = Boolean(accountSession);
  const isCustomerDetailsComplete = isStaffCreatedReservation
    ? customerDetailsSchema.safeParse(customerDetails).success
    : isAuthenticated;
  const isEditingReservation = Boolean(editingReservationId);
  const isReservationDetailsComplete =
    Boolean(selectedService) &&
    (isSoloBusiness || Boolean(selectedStaffMember)) &&
    Boolean(selectedTimeSlot);
  const isBookingReady =
    isAuthenticated &&
    isCustomerDetailsComplete &&
    isReservationDetailsComplete &&
    bookingConsents.termsAccepted;

  const resetAfterServiceChange = useCallback(() => {
    setSelectedStaffMemberId(undefined);
    setSelectedTimeSlotId(undefined);
    setBookingConsents(resetNotificationConsents);
    setCompletedReservation(undefined);
  }, [
    setBookingConsents,
    setCompletedReservation,
    setSelectedStaffMemberId,
    setSelectedTimeSlotId,
  ]);

  const selectService = useCallback(
    (serviceId: string) => {
      if (serviceId === selectedServiceId) {
        return;
      }

      setSelectedServiceId(serviceId);
      resetAfterServiceChange();
    },
    [resetAfterServiceChange, selectedServiceId, setSelectedServiceId],
  );

  const selectStaffMember = useCallback(
    (staffMemberId: string) => {
      if (staffMemberId === selectedStaffMemberId) {
        return;
      }

      setSelectedStaffMemberId(staffMemberId);
      setSelectedTimeSlotId(undefined);
      setBookingConsents(resetNotificationConsents);
      setCompletedReservation(undefined);
    },
    [
      selectedStaffMemberId,
      setBookingConsents,
      setCompletedReservation,
      setSelectedStaffMemberId,
      setSelectedTimeSlotId,
    ],
  );

  const selectTimeSlot = useCallback((timeSlotId: string) => {
    setSelectedTimeSlotId(timeSlotId);
    setCompletedReservation(undefined);
  }, [setCompletedReservation, setSelectedTimeSlotId]);

  const updateBookingConsents = useCallback((consents: BookingConsents) => {
    setBookingConsents({
      ...resetNotificationConsents(consents),
    });
    setCompletedReservation(undefined);
  }, [setBookingConsents, setCompletedReservation]);

  const updateCustomerDetails = useCallback(
    (details: BookingCustomerDetails) => {
      setCustomerDetails(details);
      setCompletedReservation(undefined);
    },
    [setCompletedReservation, setCustomerDetails],
  );

  const stepNavigation = useBookingStepNavigation({
    isCustomerDetailsComplete,
    isSoloBusiness,
    isStaffCreatedReservation,
    selectedService,
    selectedServiceId,
    selectedStaffMember,
    selectedTimeSlot,
    setCurrentScreen,
  });

  const reserve = useBookingReserveAction({
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
  });

  return {
    actions: {
      canOpenStep: stepNavigation.canOpenStep,
      goToNextStepAfterCustomer: stepNavigation.goToNextStepAfterCustomer,
      goToNextStepAfterService: stepNavigation.goToNextStepAfterService,
      openStep: stepNavigation.openStep,
      reserve,
      selectService,
      selectStaffMember,
      selectTimeSlot,
      setCurrentStep: stepNavigation.setCurrentStep,
      updateBookingConsents,
      updateCustomerDetails,
    },
    accountSession,
    availableStaffMembers,
    availableTimeSlots,
    bookingConsents,
    completedReservation,
    currentScreen,
    customerDetails,
    isBookingReady,
    isCustomerDetailsComplete,
    isEditingReservation,
    isReservationDetailsComplete,
    isSoloBusiness,
    isStaffCreatedReservation,
    reservationSubmitLabel: isEditingReservation
      ? "Zapisz zmiany"
      : "Zarezerwuj",
    services,
    staffServiceDetails,
    selectedService,
    selectedServiceId,
    selectedStaffMember,
    selectedStaffMemberId,
    selectedTimeSlot,
    selectedTimeSlotId,
    transitionState,
    visibleSteps,
  };
};

export { useBookingFlow };
export type { UseBookingFlowOptions };
export type UseBookingFlowReturn = ReturnType<typeof useBookingFlow>;
