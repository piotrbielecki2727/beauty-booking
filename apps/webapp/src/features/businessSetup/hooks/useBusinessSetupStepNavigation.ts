"use client";

import { useCallback, useRef, useState } from "react";

import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";

import type { BusinessSetupDraftStep } from "@/features/businessSetup/providers";
import type { BusinessSetupStep } from "@beauty-booking/shared";

type SaveWithStepNavigation = <Values>(
  values: Values,
  save: (values: Values) => Promise<void>,
  defaultNextStep?: BusinessSetupStep,
) => Promise<void>;

type UseBusinessSetupStepNavigationProperties = {
  activeStep: BusinessSetupStep;
  clearDraft: (step: BusinessSetupDraftStep) => void;
  dirtySteps: BusinessSetupStep[];
  isSaving: boolean;
  setActiveStep: (step: BusinessSetupStep) => void;
};

export const useBusinessSetupStepNavigation = ({
  activeStep,
  clearDraft,
  dirtySteps,
  isSaving,
  setActiveStep,
}: UseBusinessSetupStepNavigationProperties) => {
  const [pendingStep, setPendingStep] = useState<BusinessSetupStep | null>(null);
  const pendingStepAfterSaveReference = useRef<BusinessSetupStep | null>(null);
  const isPendingStepSaveStartedReference = useRef(false);

  const clearPendingSave = useCallback(() => {
    pendingStepAfterSaveReference.current = null;
    isPendingStepSaveStartedReference.current = false;
  }, []);

  const requestStepChange = useCallback(
    (step: BusinessSetupStep) => {
      if (step === activeStep || isSaving) {
        return;
      }

      if (dirtySteps.includes(activeStep)) {
        setPendingStep(step);
        return;
      }

      setActiveStep(step);
    },
    [activeStep, dirtySteps, isSaving, setActiveStep],
  );

  const cancelStepChange = useCallback(() => {
    setPendingStep(null);
  }, []);

  const discardChangesAndChangeStep = useCallback(() => {
    if (!pendingStep) {
      return;
    }

    clearDraft(activeStep as BusinessSetupDraftStep);
    setActiveStep(pendingStep);
    setPendingStep(null);
  }, [activeStep, clearDraft, pendingStep, setActiveStep]);

  const saveWithStepNavigation = useCallback<SaveWithStepNavigation>(
    async (values, save, defaultNextStep) => {
      isPendingStepSaveStartedReference.current = true;

      try {
        await save(values);

        const targetStep =
          pendingStepAfterSaveReference.current ?? defaultNextStep;

        clearPendingSave();

        if (targetStep) {
          setActiveStep(targetStep);
        }
      } catch (error: unknown) {
        clearPendingSave();
        throw error;
      }
    },
    [clearPendingSave, setActiveStep],
  );

  const saveAndChangeStep = useCallback(() => {
    if (!pendingStep) {
      return;
    }

    pendingStepAfterSaveReference.current = pendingStep;
    isPendingStepSaveStartedReference.current = false;
    setPendingStep(null);

    document
      .getElementById(BUSINESS_SETUP_ACTIVE_FORM_ID)
      ?.closest("form")
      ?.requestSubmit();

    window.setTimeout(() => {
      if (!isPendingStepSaveStartedReference.current) {
        pendingStepAfterSaveReference.current = null;
      }
    }, 0);
  }, [pendingStep]);

  return {
    cancelStepChange,
    discardChangesAndChangeStep,
    isStepChangeDialogOpen: pendingStep !== null,
    requestStepChange,
    saveAndChangeStep,
    saveWithStepNavigation,
  };
};

export type {
  SaveWithStepNavigation,
  UseBusinessSetupStepNavigationProperties,
};
