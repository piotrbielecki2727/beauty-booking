"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessLocationFormSchema,
  type BusinessLocationForm,
  type BusinessLocationFormItem,
  type BusinessSetupResponse,
} from "@beauty-booking/shared";

import { Button } from "@/components/reusable";
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

const defaultBusinessLocation: BusinessLocationFormItem = {
  apartmentNumber: "",
  buildingNumber: "",
  city: "",
  locationNote: "",
  mobileServiceFeeType: "FREE",
  mobileServiceFixedFee: "",
  mobileServiceMaxDistanceKm: "15",
  mobileServicesEnabled: false,
  mobileServiceTravelTimeMinutes: "30",
  parkingNote: "",
  postalCode: "",
  street: "",
};

export const getBusinessLocationFormValues = (
  setup: BusinessSetupResponse | null,
): BusinessLocationForm => ({
  locations:
    setup?.locations.length
      ? setup.locations.map((location) => ({
          apartmentNumber: location.apartmentNumber ?? "",
          buildingNumber: location.buildingNumber ?? "",
          city: location.city ?? "",
          id: location.id,
          locationNote: location.locationNote ?? "",
          mobileServiceFeeType: location.mobileServiceFeeType ?? "FREE",
          mobileServiceFixedFee: location.mobileServiceFixedFee,
          mobileServiceMaxDistanceKm:
            location.mobileServiceMaxDistanceKm?.toString() ?? "15",
          mobileServicesEnabled: location.mobileServicesEnabled,
          mobileServiceTravelTimeMinutes:
            location.mobileServiceTravelTimeMinutes?.toString() ?? "30",
          parkingNote: location.parkingNote ?? "",
          postalCode: location.postalCode ?? "",
          street: location.street ?? "",
        }))
      : [{ ...defaultBusinessLocation }],
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
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    keyName: "fieldId",
    name: "locations",
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
  const canRemoveLocation = fields.length > 1;

  return (
    <form
      className={cn(businessSetupFormClassNames, "max-w-none")}
      id={formId}
      onSubmit={handleSubmit}
    >
      <fieldset className="contents" disabled={isDisabled}>
        <div className="grid gap-5">
          {fields.map((field, index) => (
            <article
              className="grid gap-5 rounded-lg border border-line bg-surface p-4"
              key={field.fieldId}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3">
                <h3 className="font-brand text-xl font-semibold text-brand">
                  {t("businessSetup.location.locationTitle", {
                    number: index + 1,
                  })}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  isDisabled={isDisabled || !canRemoveLocation}
                  onClick={() => remove(index)}
                >
                  <Trash2Icon className="size-4" aria-hidden="true" />
                  {t("businessSetup.location.remove")}
                </Button>
              </div>
              <div className="grid gap-8 @min-[64rem]/step:grid-cols-[minmax(0,3fr)_minmax(18rem,2fr)]">
                <BusinessAddressFields control={form.control} index={index} />
                <BusinessMobileServicesFields
                  control={form.control}
                  index={index}
                />
              </div>
            </article>
          ))}

          <Button
            className="w-fit"
            type="button"
            variant="outline"
            isDisabled={isDisabled || fields.length >= 10}
            onClick={() => append({ ...defaultBusinessLocation })}
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            {t("businessSetup.location.add")}
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export type { BusinessLocationStepProperties };
