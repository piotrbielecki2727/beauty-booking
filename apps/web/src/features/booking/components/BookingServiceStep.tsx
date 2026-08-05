import { ArrowLeft, ArrowRight } from "lucide-react";

import { AppButton } from "@/components/common/app-button";
import { BookingStepShell } from "@/features/booking/components/BookingStepShell";
import { ServicePicker } from "@/features/booking/components/ServicePicker";
import { StepFooter } from "@/features/booking/components/StepFooter";
import type { BeautyService } from "@/features/booking/types/service";

type BookingServiceStepProps = {
  isStaffCreatedReservation: boolean;
  isSoloBusiness: boolean;
  onBackToCustomer: () => void;
  onNext: () => void;
  onServiceSelect: (serviceId: string) => void;
  selectedServiceId?: string;
  services: BeautyService[];
};

const BookingServiceStep = ({
  isStaffCreatedReservation,
  isSoloBusiness,
  onBackToCustomer,
  onNext,
  onServiceSelect,
  selectedServiceId,
  services,
}: BookingServiceStepProps) => (
  <BookingStepShell
    description={
      isStaffCreatedReservation
        ? "Wybierz usługę, o którą prosi klient/ka."
        : isSoloBusiness
          ? "Wybierz usługę, którą chcesz zarezerwować."
          : "Wybierz usługę, a następnie osobę, która wykona wizytę."
    }
    footer={
      <StepFooter>
        {isStaffCreatedReservation ? (
          <AppButton onClick={onBackToCustomer} variant="outline">
            <ArrowLeft aria-hidden="true" />
            Wróć
          </AppButton>
        ) : (
          <span />
        )}
        <AppButton disabled={!selectedServiceId} onClick={onNext}>
          Dalej
          <ArrowRight aria-hidden="true" />
        </AppButton>
      </StepFooter>
    }
    title="Wybierz usługę"
  >
    <ServicePicker
      onServiceSelect={onServiceSelect}
      selectedServiceId={selectedServiceId}
      services={services}
    />
  </BookingStepShell>
);

export { BookingServiceStep };
export type { BookingServiceStepProps };
