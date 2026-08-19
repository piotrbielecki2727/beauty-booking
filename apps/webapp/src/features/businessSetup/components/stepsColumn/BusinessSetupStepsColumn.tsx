"use client";

import { businessSetupStepItems } from "@/features/businessSetup/businessSetupConfig";
import { BusinessSetupProgressSummary } from "@/features/businessSetup/components/stepsColumn/BusinessSetupProgressSummary";
import { BusinessSetupStepsList } from "@/features/businessSetup/components/stepsColumn/BusinessSetupStepsList";

import type { BusinessSetupStep } from "@beauty-booking/shared";

type BusinessSetupStepsColumnProperties = {
  completedSteps: BusinessSetupStep[];
  currentStep: BusinessSetupStep;
  dirtySteps?: BusinessSetupStep[];
  isDisabled?: boolean;
  onStepChange: (step: BusinessSetupStep) => void;
};

export const BusinessSetupStepsColumn = ({
  completedSteps,
  currentStep,
  dirtySteps = [],
  isDisabled = false,
  onStepChange,
}: BusinessSetupStepsColumnProperties) => {
  const currentStepIndex = businessSetupStepItems.findIndex(
    (step) => step.key === currentStep,
  );
  const completedPercentage = Math.round(
    (completedSteps.length / businessSetupStepItems.length) * 100,
  );

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
      <BusinessSetupProgressSummary
        completedPercentage={completedPercentage}
        currentStepNumber={currentStepIndex + 1}
        totalSteps={businessSetupStepItems.length}
      />
      <BusinessSetupStepsList
        completedSteps={completedSteps}
        currentStep={currentStep}
        dirtySteps={dirtySteps}
        isDisabled={isDisabled}
        onStepChange={onStepChange}
        steps={businessSetupStepItems}
      />
    </div>
  );
};

export type { BusinessSetupStepsColumnProperties };
