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

import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import { businessSetupFormClassNames } from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { BusinessAddressFields } from "@/features/businessSetup/components/steps/businessLocation/BusinessAddressFields";
import { BusinessMobileServicesFields } from "@/features/businessSetup/components/steps/businessLocation/BusinessMobileServicesFields";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";
import { cn } from "@/lib/utils";

type BusinessLocationStepProperties = {
  draft?: BusinessLocationForm;
  formId?: string;
  initialSetup: BusinessSetupResponse | null;
  isDisabled?: boolean;
  onDraftChange: (values: BusinessLocationForm) => void;
  onSave: (values: BusinessLocationForm) => Promise<void>;
  shouldSyncInitialValues?: boolean;
};

export const getBusinessLocationFormValues = (
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
  formId = BUSINESS_SETUP_ACTIVE_FORM_ID,
  initialSetup,
  isDisabled = false,
  onDraftChange,
  onSave,
  shouldSyncInitialValues = true,
}: BusinessLocationStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(
    () => getBusinessLocationFormValues(initialSetup),
    [initialSetup],
  );
  const [initialDraft] = useState(() => draft);
  const form = useForm<BusinessLocationForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: shouldSyncInitialValues
      ? { keepDefaultValues: true }
      : undefined,
    resolver: zodResolver(businessLocationFormSchema),
    values: shouldSyncInitialValues
      ? initialDraft ?? persistedValues
      : undefined,
  });
  useBusinessSetupFormDraft({
    form,
    onDraftChange,
    step: "LOCATION",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
      form.reset(values);
    } catch {
      appToast.error({
        title: t("businessSetup.feedback.saveFailed"),
      });
    }
  });

  return (
    <form
      className={cn(businessSetupFormClassNames, "max-w-none")}
      id={formId}
      onSubmit={handleSubmit}
    >
      <fieldset className="contents" disabled={isDisabled}>
        <div className="grid gap-8 @min-[64rem]/step:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)]">
          <BusinessAddressFields control={form.control} />
          <BusinessMobileServicesFields control={form.control} />
        </div>
      </fieldset>
    </form>
  );
};

export type { BusinessLocationStepProperties };
