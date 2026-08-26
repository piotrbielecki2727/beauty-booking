"use client";

import { useEffect } from "react";
import { useWatch } from "react-hook-form";

import { useBusinessSetup } from "@/features/businessSetup/providers";

import type { FieldValues, UseFormReturn } from "react-hook-form";
import type { BusinessSetupDraftStep } from "@/features/businessSetup/providers";

type UseBusinessSetupFormDraftProperties<Values extends FieldValues> = {
  form: UseFormReturn<Values>;
  onDraftChange: (values: Values) => void;
  step: BusinessSetupDraftStep;
};

export const useBusinessSetupFormDraft = <Values extends FieldValues>({
  form,
  onDraftChange,
  step,
}: UseBusinessSetupFormDraftProperties<Values>) => {
  const { clearDraft, setStepHasValidationErrors } = useBusinessSetup();
  const values = useWatch({ control: form.control });
  const valuesFingerprint = JSON.stringify(values);
  const { errors, isDirty } = form.formState;
  const hasValidationErrors = Object.keys(errors).length > 0;

  useEffect(() => {
    if (isDirty) {
      onDraftChange(form.getValues());
      return;
    }

    clearDraft(step);
  }, [clearDraft, form, isDirty, onDraftChange, step, valuesFingerprint]);

  useEffect(() => {
    setStepHasValidationErrors(step, hasValidationErrors);
  }, [hasValidationErrors, setStepHasValidationErrors, step]);
};

export type { UseBusinessSetupFormDraftProperties };
