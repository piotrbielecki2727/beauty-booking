"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessLocationFormSchema,
  type BusinessLocationForm,
  type BusinessSetupResponse,
} from "@beauty-booking/shared";

import { InputControl, TextareaControl } from "@/components/controlled";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import {
  businessSetupFieldClassNames,
  businessSetupFieldRowClassNames,
  businessSetupFeedbackMode,
  businessSetupFormClassNames,
  businessSetupSectionsClassNames,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";
import { cn } from "@/lib/utils";

type BusinessLocationStepProperties = {
  draft?: BusinessLocationForm;
  initialSetup: BusinessSetupResponse | null;
  onDraftChange: (values: BusinessLocationForm) => void;
  onSave: (values: BusinessLocationForm) => Promise<void>;
};

const cityCharactersRegex = /[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż -]/gu;
const streetCharactersRegex = /[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 .-]/gu;

const formatCityValue = (value: string) => {
  const filteredValue = value.replace(cityCharactersRegex, "").slice(0, 50);

  return filteredValue
    ? `${filteredValue.charAt(0).toLocaleUpperCase("pl-PL")}${filteredValue.slice(1)}`
    : "";
};

const formatPostalCodeValue = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 5);

  return digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits;
};

const formatStreetValue = (value: string) =>
  value.replace(streetCharactersRegex, "").slice(0, 60);

const formatBuildingNumberValue = (value: string) => {
  const normalizedValue = value.replace(/[^0-9A-Za-z]/g, "").toUpperCase();
  const [, digits = "", letter = ""] =
    normalizedValue.match(/^(\d*)([A-Z]?)/) ?? [];

  return `${digits}${letter}`.slice(0, 6);
};

const formatApartmentNumberValue = (value: string) =>
  value.replace(/\D/g, "").slice(0, 4);

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessLocationForm => ({
  apartmentNumber: setup?.location.apartmentNumber ?? "",
  buildingNumber: setup?.location.buildingNumber ?? "",
  city: setup?.location.city ?? "",
  locationNote: setup?.location.locationNote ?? "",
  parkingNote: setup?.location.parkingNote ?? "",
  postalCode: setup?.location.postalCode ?? "",
  street: setup?.location.street ?? "",
});

export const BusinessLocationStep = ({
  draft,
  initialSetup,
  onDraftChange,
  onSave,
}: BusinessLocationStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(
    () => getDefaultValues(initialSetup),
    [initialSetup],
  );
  const [initialDraft] = useState(() => draft);
  const form = useForm<BusinessLocationForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessLocationFormSchema),
    values: initialDraft ?? persistedValues,
  });
  useBusinessSetupFormDraft({ form, onDraftChange, step: "LOCATION" });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch {
      appToast.error({
        title: t("businessSetup.feedback.saveFailed"),
      });
    }
  });

  return (
    <form
      className={businessSetupFormClassNames}
      id={BUSINESS_SETUP_ACTIVE_FORM_ID}
      onSubmit={handleSubmit}
    >
      <div className={businessSetupSectionsClassNames}>
        <div
          className={cn(
            businessSetupFieldRowClassNames,
            "@min-[36rem]/step:grid-cols-2",
          )}
        >
          <InputControl
            control={form.control}
            description={t("businessSetup.location.descriptions.city")}
            feedbackMode={businessSetupFeedbackMode}
            formatValue={formatCityValue}
            inputClassName={businessSetupFieldClassNames}
            isRequired
            label={t("businessSetup.location.fields.city")}
            maxLength={50}
            name="city"
            placeholder={t("businessSetup.location.placeholders.city")}
          />
          <InputControl
            control={form.control}
            description={t("businessSetup.location.descriptions.postalCode")}
            feedbackMode={businessSetupFeedbackMode}
            formatValue={formatPostalCodeValue}
            inputClassName={businessSetupFieldClassNames}
            inputMode="numeric"
            isRequired
            label={t("businessSetup.location.fields.postalCode")}
            maxLength={6}
            name="postalCode"
            placeholder={t("businessSetup.location.placeholders.postalCode")}
          />
        </div>

        <div
          className={cn(
            businessSetupFieldRowClassNames,
            "@min-[44rem]/step:grid-cols-[minmax(12rem,0.8fr)_12rem_12rem]",
          )}
        >
          <InputControl
            control={form.control}
            description={t("businessSetup.location.descriptions.street")}
            feedbackMode={businessSetupFeedbackMode}
            formatValue={formatStreetValue}
            inputClassName={businessSetupFieldClassNames}
            isRequired
            label={t("businessSetup.location.fields.street")}
            maxLength={60}
            name="street"
            placeholder={t("businessSetup.location.placeholders.street")}
          />
          <InputControl
            control={form.control}
            description={t(
              "businessSetup.location.descriptions.buildingNumber",
            )}
            feedbackMode={businessSetupFeedbackMode}
            formatValue={formatBuildingNumberValue}
            inputClassName={businessSetupFieldClassNames}
            isRequired
            label={t("businessSetup.location.fields.buildingNumber")}
            maxLength={6}
            name="buildingNumber"
            placeholder={t(
              "businessSetup.location.placeholders.buildingNumber",
            )}
          />
          <InputControl
            control={form.control}
            description={t(
              "businessSetup.location.descriptions.apartmentNumber",
            )}
            feedbackMode={businessSetupFeedbackMode}
            formatValue={formatApartmentNumberValue}
            inputClassName={businessSetupFieldClassNames}
            inputMode="numeric"
            label={t("businessSetup.location.fields.apartmentNumber")}
            maxLength={4}
            name="apartmentNumber"
            placeholder={t(
              "businessSetup.location.placeholders.apartmentNumber",
            )}
          />
        </div>

        <TextareaControl
          control={form.control}
          description={t("businessSetup.location.descriptions.parkingNote")}
          feedbackMode={businessSetupFeedbackMode}
          label={t("businessSetup.location.fields.parkingNote")}
          maxLength={500}
          name="parkingNote"
          placeholder={t("businessSetup.location.placeholders.parkingNote")}
          textareaClassName={cn(
            businessSetupFieldClassNames,
            "min-h-24 resize-none",
          )}
        />

        <TextareaControl
          control={form.control}
          description={t("businessSetup.location.descriptions.locationNote")}
          feedbackMode={businessSetupFeedbackMode}
          label={t("businessSetup.location.fields.locationNote")}
          maxLength={500}
          name="locationNote"
          placeholder={t("businessSetup.location.placeholders.locationNote")}
          textareaClassName={cn(
            businessSetupFieldClassNames,
            "min-h-24 resize-none",
          )}
        />
      </div>
    </form>
  );
};

export type { BusinessLocationStepProperties };
