"use client";

import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";

import {
  BUSINESS_SETUP_ACTIVE_FORM_ID,
  businessSetupFormSteps,
  getBusinessSetupStepItem,
  getVisibleBusinessSetupStepItems,
} from "@/features/businessSetup/businessSetupConfig";
import { BusinessSetupActiveStep } from "@/features/businessSetup/components/BusinessSetupActiveStep";
import { BusinessSetupNavigationDialogs } from "@/features/businessSetup/components/BusinessSetupNavigationDialogs";
import { BusinessSetupStepActions } from "@/features/businessSetup/components/reusable";
import { BusinessSetupWelcomeDialog } from "@/features/businessSetup/components/BusinessSetupWelcomeDialog";
import { BusinessSetupWizardShell } from "@/features/businessSetup/components/BusinessSetupWizardShell";
import { useBusinessSetupStepNavigation } from "@/features/businessSetup/hooks/useBusinessSetupStepNavigation";
import { useBusinessSetup } from "@/features/businessSetup/providers";
import { appToast } from "@/features/notifications";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";

import type { BusinessSetupStep } from "@beauty-booking/shared";

export const BusinessSetupWizard = () => {
  const t = useTranslations();
  const {
    activeStep,
    clearDraft,
    completeSetup,
    dirtySteps,
    hasActiveStepValidationErrors,
    hasUnsavedChanges,
    isSaving,
    isSetupLoading,
    setActiveStep,
    setup,
    startSetup,
  } = useBusinessSetup();
  const visibleStepItems = getVisibleBusinessSetupStepItems();
  const pageNavigationGuard = useUnsavedChangesGuard({
    hasUnsavedChanges,
    isNavigationBlocked: isSaving,
  });
  const stepNavigation = useBusinessSetupStepNavigation({
    activeStep,
    clearDraft,
    dirtySteps,
    isSaving,
    setActiveStep,
  });
  const completedSteps = (setup?.setup.completedSteps ?? []).filter((step) =>
    visibleStepItems.some((item) => item.key === step),
  );
  const currentStepItem =
    visibleStepItems.find((item) => item.key === activeStep) ??
    getBusinessSetupStepItem(activeStep);
  const isActiveStepVisible = visibleStepItems.some(
    (item) => item.key === activeStep,
  );
  const currentStepIndex = visibleStepItems.findIndex(
    (step) => step.key === activeStep,
  );
  const previousStep = visibleStepItems[currentStepIndex - 1]?.key;
  const nextStep = visibleStepItems[currentStepIndex + 1]?.key;
  const isSummaryStep = activeStep === "SUMMARY";
  const missingRequiredSteps = (currentStepItem?.requiredSteps ?? []).filter(
    (step) => !completedSteps.includes(step),
  );
  const hasActiveForm =
    isActiveStepVisible &&
    missingRequiredSteps.length === 0 &&
    businessSetupFormSteps.some((step) => step === activeStep);

  const handleCompleteSetup = useCallback(async () => {
    try {
      await completeSetup();
    } catch {
      appToast.error({
        title: t("businessSetup.feedback.completionFailed"),
      });
    }
  }, [completeSetup, t]);
  const handleStartSetup = useCallback(async () => {
    try {
      await startSetup();
    } catch {
      appToast.error({
        title: t("businessSetup.feedback.startFailed"),
      });
    }
  }, [startSetup, t]);

  useEffect(() => {
    if (isActiveStepVisible) {
      return;
    }

    const fallbackStep: BusinessSetupStep =
      visibleStepItems.find((item) => !completedSteps.includes(item.key))?.key ??
      visibleStepItems[0]?.key ??
      "BUSINESS_BASICS";

    setActiveStep(fallbackStep);
  }, [completedSteps, isActiveStepVisible, setActiveStep, visibleStepItems]);

  return (
    <>
      <BusinessSetupWizardShell
        completedSteps={completedSteps}
        currentStep={activeStep}
        dirtySteps={dirtySteps}
        footer={
          <BusinessSetupStepActions
            formId={hasActiveForm ? BUSINESS_SETUP_ACTIVE_FORM_ID : undefined}
            hasChanges={
              dirtySteps.includes(activeStep) ||
              (hasActiveForm && !completedSteps.includes(activeStep))
            }
            isCompletionAction={isSummaryStep}
            isNextDisabled={
              missingRequiredSteps.length > 0 ||
              (hasActiveForm && hasActiveStepValidationErrors) ||
              (!nextStep && !isSummaryStep)
            }
            isPreviousDisabled={!previousStep}
            isSaving={isSaving}
            onNext={
              isSummaryStep
                ? handleCompleteSetup
                : nextStep
                  ? () => stepNavigation.requestStepChange(nextStep)
                  : undefined
            }
            onPrevious={
              previousStep
                ? () => stepNavigation.requestStepChange(previousStep)
                : undefined
            }
          />
        }
        isInteractionDisabled={isSaving}
        isLoading={isSetupLoading}
        onStepChange={stepNavigation.requestStepChange}
        steps={visibleStepItems}
      >
        <div className="grid gap-6">
          <BusinessSetupActiveStep
            activeStep={activeStep}
            currentStepItem={currentStepItem}
            isActiveStepVisible={isActiveStepVisible}
            missingRequiredSteps={missingRequiredSteps}
            nextStep={nextStep}
            saveWithStepNavigation={stepNavigation.saveWithStepNavigation}
          />
        </div>
      </BusinessSetupWizardShell>

      <BusinessSetupNavigationDialogs
        isPageNavigationDialogOpen={
          pageNavigationGuard.isConfirmationOpen
        }
        isStepChangeDialogOpen={stepNavigation.isStepChangeDialogOpen}
        onCancelPageNavigation={pageNavigationGuard.cancelNavigation}
        onCancelStepChange={stepNavigation.cancelStepChange}
        onConfirmPageNavigation={pageNavigationGuard.confirmNavigation}
        onDiscardStepChanges={stepNavigation.discardChangesAndChangeStep}
        onSaveAndChangeStep={stepNavigation.saveAndChangeStep}
      />

      <BusinessSetupWelcomeDialog
        isOpen={setup?.setup.status === "NOT_STARTED"}
        isStarting={isSaving}
        onStart={handleStartSetup}
      />
    </>
  );
};
