import { ArrowLeft } from "lucide-react";

import { AppButton } from "@/components/common/app-button";
import { BookingStepShell } from "@/features/booking/components/BookingStepShell";
import {
  BookingSummaryCard,
  type BookingSummaryCardProps,
} from "@/features/booking/components/BookingSummaryCard";

type BookingSummaryStepProps = {
  onBack: () => void;
  summaryProps: BookingSummaryCardProps;
};

const BookingSummaryStep = ({
  onBack,
  summaryProps,
}: BookingSummaryStepProps) => (
  <BookingStepShell
    description="Sprawdź szczegóły wizyty przed utworzeniem rezerwacji."
    footer={
      <div className="flex">
        <AppButton onClick={onBack} variant="outline">
          <ArrowLeft aria-hidden="true" />
          Wróć
        </AppButton>
      </div>
    }
    title="Podsumowanie"
  >
    <BookingSummaryCard {...summaryProps} />
  </BookingStepShell>
);

export { BookingSummaryStep };
export type { BookingSummaryStepProps };
