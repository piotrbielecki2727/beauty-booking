"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { ConfirmationDialog } from "@/components/reusable";
import {
  BUSINESS_SETUP_ACTIVE_FORM_ID,
  businessSetupFormSteps,
  getBusinessSetupStepItem,
  getVisibleBusinessSetupStepItems,
} from "@/features/businessSetup/businessSetupConfig";
import {
  BusinessSetupStepActions,
  BusinessSetupStepIntroduction,
  BusinessSetupStepRequirementsState,
} from "@/features/businessSetup/components/reusable";
import { BusinessSetupWizardShell } from "@/features/businessSetup/components/BusinessSetupWizardShell";
import { BusinessSetupWelcomeDialog } from "@/features/businessSetup/components/BusinessSetupWelcomeDialog";
import { BusinessBasicsStep } from "@/features/businessSetup/components/steps/BusinessBasicsStep";
import { BusinessDetailsStep } from "@/features/businessSetup/components/steps/BusinessDetailsStep";
import { BusinessLocationStep } from "@/features/businessSetup/components/steps/BusinessLocationStep";
import { BusinessSummaryStep } from "@/features/businessSetup/components/steps/BusinessSummaryStep";
import { appToast } from "@/features/notifications";
import { useBusinessSetup } from "@/features/businessSetup/providers";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";

import type { ReactNode } from "react";
import type {
  BusinessBasicsForm,
  BusinessDetailsForm,
  BusinessLocationForm,
  BusinessSetupStep,
} from "@beauty-booking/shared";

export const BusinessSetupWizard = () => {
  const t = useTranslations();
  const {
    activeStep,
    clearDraft,
    completeSetup,
    dirtySteps,
    drafts,
    hasActiveStepValidationErrors,
    hasUnsavedChanges,
    isSaving,
    isSetupLoading,
    saveBasics,
    saveDetails,
    saveLocation,
    setActiveStep,
    setDraft,
    setup,
    startSetup,
  } = useBusinessSetup();
  const [pendingStep, setPendingStep] = useState<BusinessSetupStep | null>(null);
  const pendingStepAfterSaveRef = useRef<BusinessSetupStep | null>(null);
  const isPendingStepSaveStartedRef = useRef(false);
  const visibleStepItems = useMemo(
    () => getVisibleBusinessSetupStepItems(),
    [],
  );
  const navigationGuard = useUnsavedChangesGuard({
    hasUnsavedChanges,
    isNavigationBlocked: isSaving,
  });
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
    [
      activeStep,
      dirtySteps,
      isSaving,
      setActiveStep,
    ],
  );
  const cancelStepChange = useCallback(() => {
    setPendingStep(null);
  }, []);
  const confirmStepChange = useCallback(() => {
    if (!pendingStep) {
      return;
    }

    clearDraft(activeStep as keyof typeof drafts);
    setActiveStep(pendingStep);
    setPendingStep(null);
  }, [activeStep, clearDraft, pendingStep, setActiveStep]);
  const saveWithPendingNavigation = useCallback(
    async <Values,>(
      values: Values,
      save: (values: Values) => Promise<void>,
      defaultNextStep?: BusinessSetupStep,
    ) => {
      isPendingStepSaveStartedRef.current = true;

      try {
        await save(values);

        const targetStep = pendingStepAfterSaveRef.current ?? defaultNextStep;

        pendingStepAfterSaveRef.current = null;
        isPendingStepSaveStartedRef.current = false;

        if (targetStep) {
          setActiveStep(targetStep);
        }
      } catch (error: unknown) {
        pendingStepAfterSaveRef.current = null;
        isPendingStepSaveStartedRef.current = false;
        throw error;
      }
    },
    [setActiveStep],
  );
  const saveAndChangeStep = useCallback(() => {
    if (!pendingStep) {
      return;
    }

    pendingStepAfterSaveRef.current = pendingStep;
    isPendingStepSaveStartedRef.current = false;
    setPendingStep(null);

    document
      .getElementById(BUSINESS_SETUP_ACTIVE_FORM_ID)
      ?.closest("form")
      ?.requestSubmit();

    window.setTimeout(() => {
      if (!isPendingStepSaveStartedRef.current) {
        pendingStepAfterSaveRef.current = null;
      }
    }, 0);
  }, [pendingStep]);
  const completedSteps = useMemo(
    () =>
      (setup?.setup.completedSteps ?? []).filter((step) =>
        visibleStepItems.some((item) => item.key === step),
      ),
    [setup?.setup.completedSteps, visibleStepItems],
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
  const handleBasicsDraftChange = useCallback(
    (values: BusinessBasicsForm) => setDraft("BUSINESS_BASICS", values),
    [setDraft],
  );
  const handleBasicsSave = useCallback(
    (values: BusinessBasicsForm) =>
      saveWithPendingNavigation(values, saveBasics, nextStep),
    [nextStep, saveBasics, saveWithPendingNavigation],
  );
  const handleLocationDraftChange = useCallback(
    (values: BusinessLocationForm) => setDraft("LOCATION", values),
    [setDraft],
  );
  const handleLocationSave = useCallback(
    (values: BusinessLocationForm) =>
      saveWithPendingNavigation(values, saveLocation, nextStep),
    [nextStep, saveLocation, saveWithPendingNavigation],
  );
  const handleDetailsDraftChange = useCallback(
    (values: BusinessDetailsForm) => setDraft("PUBLIC_PROFILE", values),
    [setDraft],
  );
  const handleDetailsSave = useCallback(
    (values: BusinessDetailsForm) =>
      saveWithPendingNavigation(values, saveDetails, nextStep),
    [nextStep, saveDetails, saveWithPendingNavigation],
  );
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
    if (visibleStepItems.some((item) => item.key === activeStep)) {
      return;
    }

    const fallbackStep: BusinessSetupStep =
      visibleStepItems.find((item) => !completedSteps.includes(item.key))?.key ??
      visibleStepItems[0]?.key ??
      "BUSINESS_BASICS";

    setActiveStep(fallbackStep);
  }, [
    activeStep,
    completedSteps,
    setActiveStep,
    visibleStepItems,
  ]);

  let stepContent: ReactNode;

  if (!isActiveStepVisible) {
    stepContent = null;
  } else if (missingRequiredSteps.length > 0) {
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
              onSave={handleBasicsSave}
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
              onSave={handleLocationSave}
            />
          </>
        );
        break;
      case "PUBLIC_PROFILE":
        stepContent = (
          <>
            <BusinessSetupStepIntroduction
              description={t("businessSetup.businessDetails.description")}
              title={t("businessSetup.businessDetails.title")}
            />
            <BusinessDetailsStep
              draft={drafts.PUBLIC_PROFILE}
              initialSetup={setup}
              onDraftChange={handleDetailsDraftChange}
              onSave={handleDetailsSave}
            />
          </>
        );
        break;
      case "SUMMARY":
        stepContent = (
          <>
            <BusinessSetupStepIntroduction
              description={t("businessSetup.summary.description")}
              title={t("businessSetup.summary.title")}
            />
            <BusinessSummaryStep setup={setup} />
          </>
        );
        break;
      default:
        stepContent = (
          <div className="grid gap-3">
            <h2 className="hidden font-brand text-3xl font-semibold text-brand sm:block">
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
            hasChanges={
              dirtySteps.includes(activeStep) ||
              (hasActiveForm && !completedSteps.includes(activeStep))
            }
            isNextDisabled={
              missingRequiredSteps.length > 0 ||
              (hasActiveForm && hasActiveStepValidationErrors) ||
              (!nextStep && !isSummaryStep)
            }
            isPreviousDisabled={!previousStep}
            isSaving={isSaving}
            isCompletionAction={isSummaryStep}
            onNext={
              isSummaryStep
                ? handleCompleteSetup
                : nextStep
                  ? () => requestStepChange(nextStep)
                  : undefined
            }
            onPrevious={
              previousStep ? () => requestStepChange(previousStep) : undefined
            }
          />
        }
        isInteractionDisabled={isSaving}
        isLoading={isSetupLoading}
        onStepChange={requestStepChange}
        steps={visibleStepItems}
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

      <ConfirmationDialog
        cancelLabel={t("businessSetup.unsavedStepChange.stay")}
        confirmVariant="outline"
        confirmLabel={t("businessSetup.unsavedStepChange.leave")}
        description={t("businessSetup.unsavedStepChange.description")}
        extraActionLabel={t("businessSetup.unsavedStepChange.saveAndLeave")}
        extraActionVariant="default"
        hasSplitActions
        isOpen={pendingStep !== null}
        onCancel={cancelStepChange}
        onConfirm={confirmStepChange}
        onExtraAction={saveAndChangeStep}
        title={t("businessSetup.unsavedStepChange.title")}
      />

      <BusinessSetupWelcomeDialog
        isOpen={setup?.setup.status === "NOT_STARTED"}
        isStarting={isSaving}
        onStart={handleStartSetup}
      />
    </>
  );
};
