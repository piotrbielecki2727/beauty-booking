"use client";

import { useTranslations } from "next-intl";

import { BusinessSetupStepItem } from "@/features/businessSetup/components/stepsColumn/BusinessSetupStepItem";

import type { BusinessSetupStepDefinition } from "@/features/businessSetup/businessSetupConfig";
import type { BusinessSetupStep } from "@beauty-booking/shared";

type BusinessSetupStepsListProperties = {
  completedSteps: BusinessSetupStep[];
  currentStep: BusinessSetupStep;
  dirtySteps: BusinessSetupStep[];
  isDisabled: boolean;
  onStepChange: (step: BusinessSetupStep) => void;
  steps: BusinessSetupStepDefinition[];
};

export const BusinessSetupStepsList = ({
  completedSteps,
  currentStep,
  dirtySteps,
  isDisabled,
  onStepChange,
  steps,
}: BusinessSetupStepsListProperties) => {
  const t = useTranslations();
  const dirtyLabel = t("businessSetup.unsavedStep");

  return (
    <ol className="grid min-h-0 min-w-0 content-start gap-1.5 overflow-x-hidden overflow-y-auto overscroll-contain pr-3 [scrollbar-gutter:stable]">
      {steps.map((step, index) => (
        <BusinessSetupStepItem
          key={step.key}
          dirtyLabel={dirtyLabel}
          isCompleted={completedSteps.includes(step.key)}
          isCurrent={step.key === currentStep}
          isDirty={dirtySteps.includes(step.key)}
          isDisabled={isDisabled}
          label={t(step.labelKey)}
          onSelect={() => onStepChange(step.key)}
          stepNumber={index + 1}
        />
      ))}
    </ol>
  );
};

export type { BusinessSetupStepsListProperties };
