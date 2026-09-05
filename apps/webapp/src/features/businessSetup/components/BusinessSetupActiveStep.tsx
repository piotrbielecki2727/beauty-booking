"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

import {
  BusinessSetupStepIntroduction,
  BusinessSetupStepRequirementsState,
} from "@/features/businessSetup/components/reusable";
import { BusinessBasicsStep } from "@/features/businessSetup/components/steps/BusinessBasicsStep";
import { BusinessDetailsStep } from "@/features/businessSetup/components/steps/BusinessDetailsStep";
import { BusinessLocationStep } from "@/features/businessSetup/components/steps/BusinessLocationStep";
import { BusinessSummaryStep } from "@/features/businessSetup/components/steps/BusinessSummaryStep";
import { useBusinessSetup } from "@/features/businessSetup/providers";

import type { BusinessSetupStepDefinition } from "@/features/businessSetup/businessSetupConfig";
import type { SaveWithStepNavigation } from "@/features/businessSetup/hooks/useBusinessSetupStepNavigation";
import type {
  BusinessBasicsForm,
  BusinessDetailsForm,
  BusinessLocationForm,
  BusinessSetupStep,
} from "@beauty-booking/shared";

type BusinessSetupActiveStepProperties = {
  activeStep: BusinessSetupStep;
  currentStepItem?: BusinessSetupStepDefinition;
  isActiveStepVisible: boolean;
  missingRequiredSteps: BusinessSetupStep[];
  nextStep?: BusinessSetupStep;
  saveWithStepNavigation: SaveWithStepNavigation;
};

export const BusinessSetupActiveStep = ({
  activeStep,
  currentStepItem,
  isActiveStepVisible,
  missingRequiredSteps,
  nextStep,
  saveWithStepNavigation,
}: BusinessSetupActiveStepProperties) => {
  const t = useTranslations();
  const {
    drafts,
    saveBasics,
    saveDetails,
    saveLocation,
    setDraft,
    setup,
  } = useBusinessSetup();
  const handleBasicsDraftChange = useCallback(
    (values: BusinessBasicsForm) => setDraft("BUSINESS_BASICS", values),
    [setDraft],
  );
  const handleBasicsSave = useCallback(
    (values: BusinessBasicsForm) =>
      saveWithStepNavigation(values, saveBasics, nextStep),
    [nextStep, saveBasics, saveWithStepNavigation],
  );
  const handleLocationDraftChange = useCallback(
    (values: BusinessLocationForm) => setDraft("LOCATION", values),
    [setDraft],
  );
  const handleLocationSave = useCallback(
    (values: BusinessLocationForm) =>
      saveWithStepNavigation(values, saveLocation, nextStep),
    [nextStep, saveLocation, saveWithStepNavigation],
  );
  const handleDetailsDraftChange = useCallback(
    (values: BusinessDetailsForm) => setDraft("PUBLIC_PROFILE", values),
    [setDraft],
  );
  const handleDetailsSave = useCallback(
    (values: BusinessDetailsForm) =>
      saveWithStepNavigation(values, saveDetails, nextStep),
    [nextStep, saveDetails, saveWithStepNavigation],
  );

  if (!isActiveStepVisible) {
    return null;
  }

  if (missingRequiredSteps.length > 0) {
    return (
      <BusinessSetupStepRequirementsState
        missingSteps={missingRequiredSteps}
      />
    );
  }

  if (activeStep === "BUSINESS_BASICS") {
    return (
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
  }

  if (activeStep === "LOCATION") {
    return (
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
  }

  if (activeStep === "PUBLIC_PROFILE") {
    return (
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
  }

  if (activeStep === "SUMMARY") {
    return (
      <>
        <BusinessSetupStepIntroduction
          description={t("businessSetup.summary.description")}
          title={t("businessSetup.summary.title")}
        />
        <BusinessSummaryStep setup={setup} />
      </>
    );
  }

  return (
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
};

export type { BusinessSetupActiveStepProperties };
