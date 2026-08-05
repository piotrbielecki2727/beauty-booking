import { ArrowLeft, ArrowRight } from "lucide-react";

import { AppButton } from "@/components/common/app-button";
import { BookingStepShell } from "@/features/booking/components/BookingStepShell";
import { DateTimePicker } from "@/features/booking/components/DateTimePicker";
import { StepFooter } from "@/features/booking/components/StepFooter";
import type { BookingStep } from "@/features/booking/types/flow";
import type { BookingTimeSlot } from "@/features/booking/types/timeSlot";

type BookingDateTimeStepProps = {
  isStaffCreatedReservation: boolean;
  isSoloBusiness: boolean;
  onBack: (step: BookingStep) => void;
  onNext: () => void;
  onTimeSlotSelect: (timeSlotId: string) => void;
  selectedTimeSlotId?: string;
  timeSlots: BookingTimeSlot[];
};

const BookingDateTimeStep = ({
  isStaffCreatedReservation,
  isSoloBusiness,
  onBack,
  onNext,
  onTimeSlotSelect,
  selectedTimeSlotId,
  timeSlots,
}: BookingDateTimeStepProps) => (
  <BookingStepShell
    description={
      isStaffCreatedReservation
        ? "Wybierz datę i godzinę uzgodnioną z klientem/klientką."
        : "Wybierz dogodną datę i godzinę wizyty."
    }
    footer={
      <StepFooter>
        <AppButton
          onClick={() => onBack(isSoloBusiness ? "service" : "staff")}
          variant="outline"
        >
          <ArrowLeft aria-hidden="true" />
          Wróć
        </AppButton>
        <AppButton disabled={!selectedTimeSlotId} onClick={onNext}>
          Dalej
          <ArrowRight aria-hidden="true" />
        </AppButton>
      </StepFooter>
    }
    title="Wybierz termin"
  >
    <DateTimePicker
      onTimeSlotSelect={onTimeSlotSelect}
      selectedTimeSlotId={selectedTimeSlotId}
      timeSlots={timeSlots}
    />
  </BookingStepShell>
);

export { BookingDateTimeStep };
export type { BookingDateTimeStepProps };
