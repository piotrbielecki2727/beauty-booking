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
              inputClassName={businessSetupFieldClassNames}
              isRequired
              label={t("businessSetup.location.fields.city")}
              name="city"
              placeholder={t("businessSetup.location.placeholders.city")}
            />
            <InputControl
              control={form.control}
              description={t(
                "businessSetup.location.descriptions.postalCode",
              )}
              feedbackMode={businessSetupFeedbackMode}
              inputClassName={businessSetupFieldClassNames}
              isRequired
              label={t("businessSetup.location.fields.postalCode")}
              name="postalCode"
              placeholder={t("businessSetup.location.placeholders.postalCode")}
            />
          </div>

          <div
            className={cn(
              businessSetupFieldRowClassNames,
              "@min-[44rem]/step:grid-cols-[minmax(0,1fr)_10rem_10rem]",
            )}
          >
            <InputControl
              control={form.control}
              description={t("businessSetup.location.descriptions.street")}
              feedbackMode={businessSetupFeedbackMode}
              inputClassName={businessSetupFieldClassNames}
              isRequired
              label={t("businessSetup.location.fields.street")}
              name="street"
              placeholder={t("businessSetup.location.placeholders.street")}
            />
            <InputControl
              control={form.control}
              description={t(
                "businessSetup.location.descriptions.buildingNumber",
              )}
              feedbackMode={businessSetupFeedbackMode}
              inputClassName={businessSetupFieldClassNames}
              isRequired
              label={t("businessSetup.location.fields.buildingNumber")}
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
              inputClassName={businessSetupFieldClassNames}
              label={t("businessSetup.location.fields.apartmentNumber")}
              name="apartmentNumber"
              placeholder={t(
                "businessSetup.location.placeholders.apartmentNumber",
              )}
            />
          </div>

          <TextareaControl
            control={form.control}
            description={t(
              "businessSetup.location.descriptions.parkingNote",
            )}
            feedbackMode={businessSetupFeedbackMode}
            label={t("businessSetup.location.fields.parkingNote")}
            name="parkingNote"
            placeholder={t("businessSetup.location.placeholders.parkingNote")}
            textareaClassName={cn(
              businessSetupFieldClassNames,
              "min-h-24 resize-none",
            )}
          />

          <TextareaControl
            control={form.control}
            description={t(
              "businessSetup.location.descriptions.locationNote",
            )}
            feedbackMode={businessSetupFeedbackMode}
            label={t("businessSetup.location.fields.locationNote")}
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
