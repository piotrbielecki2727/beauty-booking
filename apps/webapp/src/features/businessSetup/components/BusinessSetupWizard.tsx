"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

import { ConfirmationDialog } from "@/components/reusable";
import {
  BUSINESS_SETUP_ACTIVE_FORM_ID,
  businessSetupFormSteps,
  businessSetupStepItems,
  getBusinessSetupStepItem,
} from "@/features/businessSetup/businessSetupConfig";
import {
  BusinessSetupStepActions,
  BusinessSetupStepIntroduction,
  BusinessSetupStepRequirementsState,
} from "@/features/businessSetup/components/reusable";
import { BusinessSetupWizardShell } from "@/features/businessSetup/components/BusinessSetupWizardShell";
import { BusinessBasicsStep } from "@/features/businessSetup/components/steps/BusinessBasicsStep";
import { useBusinessSetup } from "@/features/businessSetup/providers";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";

import type { ReactNode } from "react";
import type { BusinessBasicsForm } from "@beauty-booking/shared";

export const BusinessSetupWizard = () => {
  const t = useTranslations();
  const {
    activeStep,
    dirtySteps,
    drafts,
    hasActiveStepValidationErrors,
    hasUnsavedChanges,
    isSaving,
    isSetupLoading,
    saveBasics,
    setActiveStep,
    setDraft,
    setup,
  } = useBusinessSetup();
  const navigationGuard = useUnsavedChangesGuard({
    hasUnsavedChanges,
    isNavigationBlocked: isSaving,
  });
  const completedSteps = setup?.setup.completedSteps ?? [];
  const currentStepItem = getBusinessSetupStepItem(activeStep);
  const currentStepIndex = businessSetupStepItems.findIndex(
    (step) => step.key === activeStep,
  );
  const previousStep = businessSetupStepItems[currentStepIndex - 1]?.key;
  const nextStep = businessSetupStepItems[currentStepIndex + 1]?.key;
  const missingRequiredSteps = (currentStepItem?.requiredSteps ?? []).filter(
    (step) => !completedSteps.includes(step),
  );
  const hasActiveForm =
    missingRequiredSteps.length === 0 &&
    businessSetupFormSteps.some((step) => step === activeStep);
  const handleBasicsDraftChange = useCallback(
    (values: BusinessBasicsForm) => setDraft("BUSINESS_BASICS", values),
    [setDraft],
  );

  let stepContent: ReactNode;

  if (missingRequiredSteps.length > 0) {
    stepContent = (
      <BusinessSetupStepRequirementsState missingSteps={missingRequiredSteps} />
    );
  } else {
    switch (activeStep) {
      case "BUSINESS_BASICS":
        stepContent = (
          <>
            <BusinessSetupStepIntroduction
              description={t("businessSetup.businessBasics.description")}
              title={t("businessSetup.businessBasics.title")}
            />
            <BusinessBasicsStep
              draft={drafts.BUSINESS_BASICS}
              initialSetup={setup}
              onDraftChange={handleBasicsDraftChange}
              onSave={saveBasics}
            />
          </>
        );
        break;
      default:
        stepContent = (
          <div className="grid gap-3">
            <h2 className="font-brand text-3xl font-semibold text-brand">
              {currentStepItem
                ? t(currentStepItem.labelKey)
                : t("businessSetup.placeholder.title")}
            </h2>
            <p className="max-w-3xl text-sm leading-6 text-copy-muted">
              {t("businessSetup.placeholder.description")}
            </p>
          </div>
        );
    }
  }

  return (
    <>
      <BusinessSetupWizardShell
        completedSteps={completedSteps}
        currentStep={activeStep}
        dirtySteps={dirtySteps}
        footer={
          <BusinessSetupStepActions
            formId={hasActiveForm ? BUSINESS_SETUP_ACTIVE_FORM_ID : undefined}
            hasChanges={dirtySteps.includes(activeStep)}
            isNextDisabled={
              !hasActiveForm || hasActiveStepValidationErrors || !nextStep
            }
            isPreviousDisabled={!previousStep}
            isSaving={isSaving}
            onNext={nextStep ? () => setActiveStep(nextStep) : undefined}
            onPrevious={
              previousStep ? () => setActiveStep(previousStep) : undefined
            }
          />
        }
        isInteractionDisabled={isSaving}
        isLoading={isSetupLoading}
        onStepChange={setActiveStep}
      >
        <div className="grid gap-6">{stepContent}</div>
      </BusinessSetupWizardShell>

      <ConfirmationDialog
        cancelLabel={t("businessSetup.unsavedChanges.stay")}
        confirmLabel={t("businessSetup.unsavedChanges.leave")}
        description={t("businessSetup.unsavedChanges.description")}
        isOpen={navigationGuard.isConfirmationOpen}
        onCancel={navigationGuard.cancelNavigation}
        onConfirm={navigationGuard.confirmNavigation}
        title={t("businessSetup.unsavedChanges.title")}
      />
    </>
  );
};
