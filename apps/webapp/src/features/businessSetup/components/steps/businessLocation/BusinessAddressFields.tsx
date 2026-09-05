"use client";

import { useTranslations } from "next-intl";

import { InputControl, TextareaControl } from "@/components/controlled";
import {
  businessSetupFieldClassNames,
  businessSetupFieldRowClassNames,
  businessSetupFeedbackMode,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import {
  formatApartmentNumberValue,
  formatBuildingNumberValue,
  formatCityValue,
  formatPostalCodeValue,
  formatStreetValue,
} from "@/features/businessSetup/components/steps/businessLocation/businessLocationFormUtils";
import { cn } from "@/lib/utils";

import type { Control } from "react-hook-form";
import type { BusinessLocationForm } from "@beauty-booking/shared";

type BusinessAddressFieldsProperties = {
  control: Control<BusinessLocationForm>;
  index: number;
};

export const BusinessAddressFields = ({
  control,
  index,
}: BusinessAddressFieldsProperties) => {
  const t = useTranslations();
  const fieldPrefix = `locations.${index}` as const;

  return (
    <section className="grid content-start gap-5">
      <h3 className="border-b border-line pb-3 font-brand text-xl font-semibold text-brand">
        {t("businessSetup.location.sections.address")}
      </h3>
      <div
        className={cn(
          businessSetupFieldRowClassNames,
          "@min-[48rem]/step:grid-cols-12",
        )}
      >
        <InputControl
          containerClassName="@min-[48rem]/step:col-span-7"
          control={control}
          feedbackMode={businessSetupFeedbackMode}
          formatValue={formatCityValue}
          inputClassName={businessSetupFieldClassNames}
          isRequired
          label={t("businessSetup.location.fields.city")}
          maxLength={50}
          name={`${fieldPrefix}.city`}
          placeholder={t("businessSetup.location.placeholders.city")}
        />
        <InputControl
          containerClassName="@min-[48rem]/step:col-span-5"
          control={control}
          feedbackMode={businessSetupFeedbackMode}
          formatValue={formatPostalCodeValue}
          inputClassName={businessSetupFieldClassNames}
          inputMode="numeric"
          isRequired
          label={t("businessSetup.location.fields.postalCode")}
          maxLength={6}
          name={`${fieldPrefix}.postalCode`}
          placeholder={t("businessSetup.location.placeholders.postalCode")}
        />
        <InputControl
          containerClassName="@min-[48rem]/step:col-span-7"
          control={control}
          feedbackMode={businessSetupFeedbackMode}
          formatValue={formatStreetValue}
          inputClassName={businessSetupFieldClassNames}
          label={t("businessSetup.location.fields.street")}
          maxLength={60}
          name={`${fieldPrefix}.street`}
          placeholder={t("businessSetup.location.placeholders.street")}
        />
        <InputControl
          containerClassName="@min-[48rem]/step:col-span-3"
          control={control}
          feedbackMode={businessSetupFeedbackMode}
          formatValue={formatBuildingNumberValue}
          inputClassName={businessSetupFieldClassNames}
          isRequired
          label={t("businessSetup.location.fields.buildingNumber")}
          maxLength={6}
          name={`${fieldPrefix}.buildingNumber`}
          placeholder={t(
            "businessSetup.location.placeholders.buildingNumber",
          )}
        />
        <InputControl
          containerClassName="@min-[48rem]/step:col-span-2"
          control={control}
          feedbackMode={businessSetupFeedbackMode}
          formatValue={formatApartmentNumberValue}
          inputClassName={businessSetupFieldClassNames}
          inputMode="numeric"
          label={t("businessSetup.location.fields.apartmentNumber")}
          maxLength={4}
          name={`${fieldPrefix}.apartmentNumber`}
          placeholder={t(
            "businessSetup.location.placeholders.apartmentNumber",
          )}
        />
      </div>

      <TextareaControl
        control={control}
        feedbackMode={businessSetupFeedbackMode}
        label={t("businessSetup.location.fields.parkingNote")}
        maxLength={500}
        name={`${fieldPrefix}.parkingNote`}
        placeholder={t("businessSetup.location.placeholders.parkingNote")}
        textareaClassName={cn(
          businessSetupFieldClassNames,
          "min-h-24 resize-none",
        )}
      />

      <TextareaControl
        control={control}
        feedbackMode={businessSetupFeedbackMode}
        label={t("businessSetup.location.fields.locationNote")}
        maxLength={500}
        name={`${fieldPrefix}.locationNote`}
        placeholder={t("businessSetup.location.placeholders.locationNote")}
        textareaClassName={cn(
          businessSetupFieldClassNames,
          "min-h-24 resize-none",
        )}
      />
    </section>
  );
};

export type { BusinessAddressFieldsProperties };
