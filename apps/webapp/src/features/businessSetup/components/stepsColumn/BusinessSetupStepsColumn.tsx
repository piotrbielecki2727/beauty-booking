"use client";

import { BusinessSetupProgressSummary } from "@/features/businessSetup/components/stepsColumn/BusinessSetupProgressSummary";
import { BusinessSetupStepsList } from "@/features/businessSetup/components/stepsColumn/BusinessSetupStepsList";

import type { BusinessSetupStepDefinition } from "@/features/businessSetup/businessSetupConfig";
import type { BusinessSetupStep } from "@beauty-booking/shared";

type BusinessSetupStepsColumnProperties = {
  completedSteps: BusinessSetupStep[];
  currentStep: BusinessSetupStep;
  dirtySteps?: BusinessSetupStep[];
  isDisabled?: boolean;
  onStepChange: (step: BusinessSetupStep) => void;
  steps: BusinessSetupStepDefinition[];
};

export const BusinessSetupStepsColumn = ({
  completedSteps,
  currentStep,
  dirtySteps = [],
  isDisabled = false,
  onStepChange,
  steps,
}: BusinessSetupStepsColumnProperties) => {
  const currentStepIndex = steps.findIndex(
    (step) => step.key === currentStep,
  );
  const visibleCompletedSteps = completedSteps.filter((step) =>
    steps.some((item) => item.key === step),
  );
  const completedPercentage = Math.round(
    (visibleCompletedSteps.length / steps.length) * 100,
  );

  return (
    <div className="grid h-full min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4">
      <BusinessSetupProgressSummary
        completedPercentage={completedPercentage}
        currentStepNumber={currentStepIndex + 1}
        totalSteps={steps.length}
      />
      <BusinessSetupStepsList
        completedSteps={completedSteps}
        currentStep={currentStep}
        dirtySteps={dirtySteps}
        isDisabled={isDisabled}
        onStepChange={onStepChange}
        steps={steps}
      />
    </div>
  );
};

export type { BusinessSetupStepsColumnProperties };
