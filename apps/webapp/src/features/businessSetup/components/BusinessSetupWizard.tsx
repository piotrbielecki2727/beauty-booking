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
import { BusinessLocationStep } from "@/features/businessSetup/components/steps/BusinessLocationStep";
import { BusinessServicesStep } from "@/features/businessSetup/components/steps/BusinessServicesStep";
import { BusinessWorkstationsStep } from "@/features/businessSetup/components/steps/BusinessWorkstationsStep";
import { useBusinessSetup } from "@/features/businessSetup/providers";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";

import type { ReactNode } from "react";
import type {
  BusinessBasicsForm,
  BusinessLocationForm,
  BusinessServicesForm,
  BusinessWorkstationsForm,
} from "@beauty-booking/shared";

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
    saveLocation,
    saveServices,
    saveWorkstations,
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
  const handleLocationDraftChange = useCallback(
    (values: BusinessLocationForm) => setDraft("LOCATION", values),
    [setDraft],
  );
  const handleServicesDraftChange = useCallback(
    (values: BusinessServicesForm) => setDraft("SERVICES", values),
    [setDraft],
  );
  const handleWorkstationsDraftChange = useCallback(
    (values: BusinessWorkstationsForm) => setDraft("WORKSTATIONS", values),
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
      case "LOCATION":
        stepContent = (
          <>
            <BusinessSetupStepIntroduction
              description={t("businessSetup.location.description")}
              title={t("businessSetup.location.title")}
            />
            <BusinessLocationStep
              draft={drafts.LOCATION}
              initialSetup={setup}
              onDraftChange={handleLocationDraftChange}
              onSave={saveLocation}
            />
          </>
        );
        break;
      case "WORKSTATIONS":
        stepContent = (
          <>
            <BusinessSetupStepIntroduction
              description={t("businessSetup.workstations.description")}
              title={t("businessSetup.workstations.title")}
            />
            <BusinessWorkstationsStep
              draft={drafts.WORKSTATIONS}
              initialSetup={setup}
              onDraftChange={handleWorkstationsDraftChange}
              onSave={saveWorkstations}
            />
          </>
        );
        break;
      case "SERVICES":
        stepContent = (
          <>
            <BusinessSetupStepIntroduction
              description={t("businessSetup.services.description")}
              title={t("businessSetup.services.title")}
            />
            <BusinessServicesStep
              draft={drafts.SERVICES}
              initialSetup={setup}
              onDraftChange={handleServicesDraftChange}
              onSave={saveServices}
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
