"use client";

import { InfoIcon } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  InputControl,
  SegmentedControlControl,
  SwitchControl,
} from "@/components/controlled";
import { IconBadge } from "@/components/reusable";
import {
  businessSetupFieldClassNames,
  businessSetupFeedbackMode,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import {
  formatIntegerValue,
  formatPriceValue,
} from "@/features/businessSetup/components/steps/businessLocation/businessLocationFormUtils";

import type { Control } from "react-hook-form";
import type { BusinessLocationForm } from "@beauty-booking/shared";

type BusinessMobileServicesFieldsProperties = {
  control: Control<BusinessLocationForm>;
  index: number;
};

export const BusinessMobileServicesFields = ({
  control,
  index,
}: BusinessMobileServicesFieldsProperties) => {
  const t = useTranslations();
  const fieldPrefix = `locations.${index}` as const;
  const mobileServicesEnabled = useWatch({
    control,
    name: `${fieldPrefix}.mobileServicesEnabled`,
  });
  const mobileServiceFeeType = useWatch({
    control,
    name: `${fieldPrefix}.mobileServiceFeeType`,
  });

  return (
    <section className="grid content-start gap-4 border-t border-line pt-6 @min-[64rem]/step:border-l @min-[64rem]/step:border-t-0 @min-[64rem]/step:pl-6 @min-[64rem]/step:pt-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="font-brand text-xl font-semibold text-brand">
          {t("businessSetup.location.sections.mobileServices")}
        </h3>
        <SwitchControl
          containerClassName="min-w-0"
          control={control}
          label={t("businessSetup.location.fields.mobileServicesEnabled")}
          name={`${fieldPrefix}.mobileServicesEnabled`}
        />
      </div>
      <p className="text-sm leading-5 text-copy-muted">
        {t("businessSetup.location.mobileServicesHint")}
      </p>

      {mobileServicesEnabled ? (
        <div className="grid gap-x-4 gap-y-7 @min-[56rem]/step:grid-cols-2 @min-[64rem]/step:grid-cols-1">
          <InputControl
            control={control}
            feedbackMode={businessSetupFeedbackMode}
            formatValue={(value) => formatIntegerValue(value, 3)}
            inputClassName={businessSetupFieldClassNames}
            inputMode="numeric"
            isRequired
            label={t(
              "businessSetup.location.fields.mobileServiceMaxDistanceKm",
            )}
            name={`${fieldPrefix}.mobileServiceMaxDistanceKm`}
            placeholder="15"
          />
          <InputControl
            control={control}
            feedbackMode={businessSetupFeedbackMode}
            formatValue={(value) => formatIntegerValue(value, 3)}
            inputClassName={businessSetupFieldClassNames}
            inputMode="numeric"
            isRequired
            label={t(
              "businessSetup.location.fields.mobileServiceTravelTimeMinutes",
            )}
            name={`${fieldPrefix}.mobileServiceTravelTimeMinutes`}
            placeholder="30"
          />
          <SegmentedControlControl
            className="@min-[56rem]/step:col-span-2 @min-[64rem]/step:col-span-1"
            control={control}
            feedbackMode={businessSetupFeedbackMode}
            isRequired
            label={t(
              "businessSetup.location.fields.mobileServiceFeeType",
            )}
            name={`${fieldPrefix}.mobileServiceFeeType`}
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
              control={control}
              feedbackMode={businessSetupFeedbackMode}
              formatValue={formatPriceValue}
              inputClassName={businessSetupFieldClassNames}
              inputMode="decimal"
              isRequired
              label={t(
                "businessSetup.location.fields.mobileServiceFixedFee",
              )}
              name={`${fieldPrefix}.mobileServiceFixedFee`}
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
  );
};

export type { BusinessMobileServicesFieldsProperties };
