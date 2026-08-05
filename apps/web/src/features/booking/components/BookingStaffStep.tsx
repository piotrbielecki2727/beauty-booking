import { ArrowLeft, ArrowRight } from "lucide-react";

import { AppButton } from "@/components/common/app-button";
import { BookingStepShell } from "@/features/booking/components/BookingStepShell";
import { StaffPicker } from "@/features/booking/components/StaffPicker";
import { StepFooter } from "@/features/booking/components/StepFooter";
import type { BookingStaffMember } from "@/features/booking/types/staff";
import type { StaffServiceDisplayDetails } from "@/features/booking/utils/availability";

type BookingStaffStepProps = {
  onBack: () => void;
  onNext: () => void;
  onStaffSelect: (staffMemberId: string) => void;
  selectedStaffMemberId?: string;
  serviceDetailsByStaffId: Record<string, StaffServiceDisplayDetails>;
  staffMembers: BookingStaffMember[];
};

const BookingStaffStep = ({
  onBack,
  onNext,
  onStaffSelect,
  selectedStaffMemberId,
  serviceDetailsByStaffId,
  staffMembers,
}: BookingStaffStepProps) => (
  <BookingStepShell
    description="Wybierz osobę dostępną dla wybranej usługi."
    footer={
      <StepFooter>
        <AppButton onClick={onBack} variant="outline">
          <ArrowLeft aria-hidden="true" />
          Wróć
        </AppButton>
        <AppButton disabled={!selectedStaffMemberId} onClick={onNext}>
          Dalej
          <ArrowRight aria-hidden="true" />
        </AppButton>
      </StepFooter>
    }
    title="Wybierz pracownika"
  >
    <StaffPicker
      onStaffSelect={onStaffSelect}
      selectedStaffMemberId={selectedStaffMemberId}
      serviceDetailsByStaffId={serviceDetailsByStaffId}
      staffMembers={staffMembers}
    />
  </BookingStepShell>
);

export { BookingStaffStep };
export type { BookingStaffStepProps };
