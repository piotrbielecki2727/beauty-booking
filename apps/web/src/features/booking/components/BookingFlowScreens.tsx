import {
  BookingCustomerStep,
  BookingDateTimeStep,
  BookingServiceStep,
  BookingStaffStep,
  BookingSummaryStep,
} from "@/features/booking/components/BookingStepViews";
import { BookingSuccessStep } from "@/features/booking/components/BookingSuccessStep";
import type { UseBookingFlowReturn } from "@/features/booking/hooks/useBookingFlow";
import type { BookingSummaryCardProps } from "@/features/booking/components/BookingSummaryCard";

type BookingFlowScreensProps = {
  flow: UseBookingFlowReturn;
  summaryProps: BookingSummaryCardProps;
};

const BookingFlowScreens = ({
  flow,
  summaryProps,
}: BookingFlowScreensProps) => {
  const {
    actions,
    availableStaffMembers,
    availableTimeSlots,
    completedReservation,
    currentScreen,
    customerDetails,
    isCustomerDetailsComplete,
    isEditingReservation,
    isSoloBusiness,
    isStaffCreatedReservation,
    selectedServiceId,
    selectedStaffMemberId,
    selectedTimeSlotId,
    staffServiceDetails,
  } = flow;

  return (
    <>
      {currentScreen === "customer" ? (
        <BookingCustomerStep
          customerDetails={customerDetails}
          isCustomerDetailsComplete={isCustomerDetailsComplete}
          onCustomerDetailsChange={actions.updateCustomerDetails}
          onNext={actions.goToNextStepAfterCustomer}
        />
      ) : null}

      {currentScreen === "service" ? (
        <BookingServiceStep
          isSoloBusiness={isSoloBusiness}
          isStaffCreatedReservation={isStaffCreatedReservation}
          onBackToCustomer={() => actions.setCurrentStep("customer")}
          onNext={actions.goToNextStepAfterService}
          onServiceSelect={actions.selectService}
          selectedServiceId={selectedServiceId}
          services={flow.services}
        />
      ) : null}

      {currentScreen === "staff" ? (
        <BookingStaffStep
          onBack={() => actions.setCurrentStep("service")}
          onNext={() => actions.setCurrentStep("datetime")}
          onStaffSelect={actions.selectStaffMember}
          selectedStaffMemberId={selectedStaffMemberId}
          serviceDetailsByStaffId={staffServiceDetails}
          staffMembers={availableStaffMembers}
        />
      ) : null}

      {currentScreen === "datetime" ? (
        <BookingDateTimeStep
          isSoloBusiness={isSoloBusiness}
          isStaffCreatedReservation={isStaffCreatedReservation}
          onBack={actions.setCurrentStep}
          onNext={() => actions.setCurrentStep("summary")}
          onTimeSlotSelect={actions.selectTimeSlot}
          selectedTimeSlotId={selectedTimeSlotId}
          timeSlots={availableTimeSlots}
        />
      ) : null}

      {currentScreen === "summary" ? (
        <BookingSummaryStep
          onBack={() => actions.setCurrentStep("datetime")}
          summaryProps={summaryProps}
        />
      ) : null}

      {currentScreen === "success" && completedReservation ? (
        <BookingSuccessStep
          isEditingReservation={isEditingReservation}
          isSoloBusiness={isSoloBusiness}
          reservation={completedReservation}
        />
      ) : null}
    </>
  );
};

export { BookingFlowScreens };
export type { BookingFlowScreensProps };
