"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessBasicsFormSchema,
  type BusinessBasicsForm,
  type BusinessSetupResponse,
  type BusinessSpecialization,
} from "@beauty-booking/shared";

import { InputControl } from "@/components/controlled";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import {
  businessSetupFeedbackMode,
  businessSetupFormClassNames,
  businessSetupSectionsClassNames,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { BusinessModelSelection } from "@/features/businessSetup/components/steps/businessBasics/BusinessModelSelection";
import { BusinessSpecializationsSelection } from "@/features/businessSetup/components/steps/businessBasics/BusinessSpecializationsSelection";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";

type BusinessBasicsStepProperties = {
  draft?: BusinessBasicsForm;
  fieldClassName?: string;
  formId?: string;
  initialSetup: BusinessSetupResponse | null;
  isBusinessTypeSelectionVisible?: boolean;
  isDisabled?: boolean;
  onDraftChange: (values: BusinessBasicsForm) => void;
  onSave: (values: BusinessBasicsForm) => Promise<boolean | void>;
  shouldSyncInitialValues?: boolean;
};

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessBasicsForm => {
  const hasSavedBusinessBasics =
    setup?.setup.completedSteps.includes("BUSINESS_BASICS") ?? false;
  const specializations: BusinessSpecialization[] =
    setup?.basics.specializations.length
      ? setup.basics.specializations
      : ["NAILS"];

  return {
    businessType: setup?.basics.businessType ?? "SOLO",
    name: hasSavedBusinessBasics ? setup?.basics.name ?? "" : "",
    specializations,
  };
};

export const BusinessBasicsStep = ({
  draft,
  fieldClassName,
  formId = BUSINESS_SETUP_ACTIVE_FORM_ID,
  initialSetup,
  isBusinessTypeSelectionVisible = true,
  isDisabled = false,
  onDraftChange,
  onSave,
  shouldSyncInitialValues = true,
}: BusinessBasicsStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(
    () => getDefaultValues(initialSetup),
    [initialSetup],
  );
  const [initialDraft] = useState(() => draft);
  const form = useForm<BusinessBasicsForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: shouldSyncInitialValues
      ? { keepDefaultValues: true }
      : undefined,
    resolver: zodResolver(businessBasicsFormSchema),
    values: shouldSyncInitialValues
      ? initialDraft ?? persistedValues
      : undefined,
  });
  useBusinessSetupFormDraft({
    form,
    onDraftChange,
    step: "BUSINESS_BASICS",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      const shouldResetForm = await onSave(values);

      if (shouldResetForm !== false) {
        form.reset(values);
      }
    } catch {
      appToast.error({
        title: t("businessSetup.feedback.saveFailed"),
      });
    }
  });

  return (
    <form
      className={businessSetupFormClassNames}
      id={formId}
      onSubmit={handleSubmit}
    >
      <fieldset className="contents" disabled={isDisabled}>
        <div className={businessSetupSectionsClassNames}>
          {isBusinessTypeSelectionVisible ? (
            <BusinessModelSelection form={form} />
          ) : null}

          <InputControl
            control={form.control}
            feedbackMode={businessSetupFeedbackMode}
            inputClassName={fieldClassName}
            isRequired
            label={t("businessSetup.businessBasics.fields.name")}
            labelClassName="text-sm font-semibold"
            name="name"
            placeholder={t("businessSetup.businessBasics.placeholders.name")}
          />

          <BusinessSpecializationsSelection form={form} />
        </div>
      </fieldset>
    </form>
  );
};

export type { BusinessBasicsStepProperties };
