"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessLocationFormSchema,
  type BusinessLocationForm,
  type BusinessSetupResponse,
} from "@beauty-booking/shared";

import {
  InputControl,
  SegmentedControlControl,
  SwitchControl,
  TextareaControl,
} from "@/components/controlled";
import { IconBadge } from "@/components/reusable";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import {
  businessSetupFieldClassNames,
  businessSetupFieldRowClassNames,
  businessSetupFeedbackMode,
  businessSetupFormClassNames,
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

const formatIntegerValue = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

const formatPriceValue = (value: string) => {
  const normalizedValue = value.replace(",", ".").replace(/[^\d.]/g, "");
  const [integerPart = "", ...decimalParts] = normalizedValue.split(".");
  const decimalPart = decimalParts.join("").slice(0, 2);

  return decimalParts.length > 0
    ? `${integerPart.slice(0, 5)},${decimalPart}`
    : integerPart.slice(0, 5);
};

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessLocationForm => ({
  apartmentNumber: setup?.location.apartmentNumber ?? "",
  buildingNumber: setup?.location.buildingNumber ?? "",
  city: setup?.location.city ?? "",
  locationNote: setup?.location.locationNote ?? "",
  mobileServiceFeeType: setup?.location.mobileServiceFeeType ?? "FREE",
  mobileServiceFixedFee: setup?.location.mobileServiceFixedFee ?? "",
  mobileServiceMaxDistanceKm:
    setup?.location.mobileServiceMaxDistanceKm?.toString() ?? "15",
  mobileServicesEnabled: setup?.location.mobileServicesEnabled ?? false,
  mobileServiceTravelTimeMinutes:
    setup?.location.mobileServiceTravelTimeMinutes?.toString() ?? "30",
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
  const mobileServicesEnabled = useWatch({
    control: form.control,
    name: "mobileServicesEnabled",
  });
  const mobileServiceFeeType = useWatch({
    control: form.control,
    name: "mobileServiceFeeType",
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
      className={cn(businessSetupFormClassNames, "max-w-none")}
      id={BUSINESS_SETUP_ACTIVE_FORM_ID}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-8 @min-[64rem]/step:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)]">
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
              control={form.control}
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
              containerClassName="@min-[48rem]/step:col-span-5"
              control={form.control}
              feedbackMode={businessSetupFeedbackMode}
              formatValue={formatPostalCodeValue}
              inputClassName={businessSetupFieldClassNames}
              inputMode="numeric"
              isRequired
              label={t("businessSetup.location.fields.postalCode")}
              maxLength={6}
              name="postalCode"
              placeholder={t(
                "businessSetup.location.placeholders.postalCode",
              )}
            />
            <InputControl
              containerClassName="@min-[48rem]/step:col-span-7"
              control={form.control}
              feedbackMode={businessSetupFeedbackMode}
              formatValue={formatStreetValue}
              inputClassName={businessSetupFieldClassNames}
              label={t("businessSetup.location.fields.street")}
              maxLength={60}
              name="street"
              placeholder={t("businessSetup.location.placeholders.street")}
            />
            <InputControl
              containerClassName="@min-[48rem]/step:col-span-3"
              control={form.control}
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
              containerClassName="@min-[48rem]/step:col-span-2"
              control={form.control}
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
        </section>

        <section className="grid content-start gap-4 border-t border-line pt-6 @min-[64rem]/step:border-l @min-[64rem]/step:border-t-0 @min-[64rem]/step:pl-6 @min-[64rem]/step:pt-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="font-brand text-xl font-semibold text-brand">
              {t("businessSetup.location.sections.mobileServices")}
            </h3>
            <SwitchControl
              containerClassName="min-w-0"
              control={form.control}
              label={t(
                "businessSetup.location.fields.mobileServicesEnabled",
              )}
              name="mobileServicesEnabled"
            />
          </div>
          <p className="text-sm leading-5 text-copy-muted">
            {t("businessSetup.location.mobileServicesHint")}
          </p>

          {mobileServicesEnabled ? (
            <div className="grid gap-4 @min-[56rem]/step:grid-cols-2 @min-[64rem]/step:grid-cols-1">
              <InputControl
                control={form.control}
                feedbackMode={businessSetupFeedbackMode}
                formatValue={(value) => formatIntegerValue(value, 3)}
                inputClassName={businessSetupFieldClassNames}
                inputMode="numeric"
                isRequired
                label={t(
                  "businessSetup.location.fields.mobileServiceMaxDistanceKm",
                )}
                name="mobileServiceMaxDistanceKm"
                placeholder="15"
              />
              <InputControl
                control={form.control}
                feedbackMode={businessSetupFeedbackMode}
                formatValue={(value) => formatIntegerValue(value, 3)}
                inputClassName={businessSetupFieldClassNames}
                inputMode="numeric"
                isRequired
                label={t(
                  "businessSetup.location.fields.mobileServiceTravelTimeMinutes",
                )}
                name="mobileServiceTravelTimeMinutes"
                placeholder="30"
              />
              <SegmentedControlControl
                className="@min-[56rem]/step:col-span-2 @min-[64rem]/step:col-span-1"
                control={form.control}
                feedbackMode={businessSetupFeedbackMode}
                isRequired
                label={t(
                  "businessSetup.location.fields.mobileServiceFeeType",
                )}
                name="mobileServiceFeeType"
                options={(["FREE", "FIXED", "CUSTOM"] as const).map(
                  (feeType) => ({
                    label: t(
                      `businessSetup.location.mobileServiceFeeTypes.${feeType}`,
                    ),
                    value: feeType,
                  }),
                )}
              />
              {mobileServiceFeeType === "FIXED" ? (
                <InputControl
                  containerClassName="@min-[56rem]/step:col-span-2 @min-[64rem]/step:col-span-1"
                  control={form.control}
                  feedbackMode={businessSetupFeedbackMode}
                  formatValue={formatPriceValue}
                  inputClassName={businessSetupFieldClassNames}
                  inputMode="decimal"
                  isRequired
                  label={t(
                    "businessSetup.location.fields.mobileServiceFixedFee",
                  )}
                  name="mobileServiceFixedFee"
                  placeholder="30,00"
                />
              ) : null}

              <div className="flex gap-3 rounded-lg border border-line bg-background p-4 @min-[56rem]/step:col-span-2 @min-[64rem]/step:col-span-1">
                <IconBadge icon={<InfoIcon />} size="sm" />
                <p className="self-center text-sm leading-5 text-copy-muted">
                  {t("businessSetup.location.mobileBookingConfirmationHint")}
                </p>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </form>
  );
};

export type { BusinessLocationStepProperties };
