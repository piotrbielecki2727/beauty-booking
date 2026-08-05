import { ArrowRight } from "lucide-react";

import { AppButton } from "@/components/common/app-button";
import { BookingStepShell } from "@/features/booking/components/BookingStepShell";
import { CustomerDetailsForm } from "@/features/booking/components/CustomerDetailsForm";
import type { BookingCustomerDetails } from "@/features/booking/types/customer";

type BookingCustomerStepProps = {
  customerDetails: BookingCustomerDetails;
  isCustomerDetailsComplete: boolean;
  onCustomerDetailsChange: (details: BookingCustomerDetails) => void;
  onNext: () => void;
};

const BookingCustomerStep = ({
  customerDetails,
  isCustomerDetailsComplete,
  onCustomerDetailsChange,
  onNext,
}: BookingCustomerStepProps) => (
  <BookingStepShell
    description="Wpisz dane osoby, dla której tworzysz rezerwację. Możesz użyć numeru telefonu, imienia i nazwiska albo adresu e-mail."
    footer={
      <div className="flex justify-end">
        <AppButton disabled={!isCustomerDetailsComplete} onClick={onNext}>
          Dalej
          <ArrowRight aria-hidden="true" />
        </AppButton>
      </div>
    }
    title="Dane klienta/klientki"
  >
    <CustomerDetailsForm
      details={customerDetails}
      onDetailsChange={onCustomerDetailsChange}
    />
  </BookingStepShell>
);

export { BookingCustomerStep };
export type { BookingCustomerStepProps };
