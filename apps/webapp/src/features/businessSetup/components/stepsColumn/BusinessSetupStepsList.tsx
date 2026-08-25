"use client";

import { ArrowRightIcon } from "lucide-react";
import { Fragment } from "react";
import { useTranslations } from "next-intl";

import { ScrollArea } from "@/components/reusable";
import { BusinessSetupStepItem } from "@/features/businessSetup/components/stepsColumn/BusinessSetupStepItem";

import type { BusinessSetupStepDefinition } from "@/features/businessSetup/businessSetupConfig";
import type { BusinessSetupStep } from "@beauty-booking/shared";

type BusinessSetupStepsListProperties = {
  completedSteps: BusinessSetupStep[];
  currentStep: BusinessSetupStep;
  dirtySteps: BusinessSetupStep[];
  isDisabled: boolean;
  onStepChange: (step: BusinessSetupStep) => void;
  orientation?: "horizontal" | "vertical";
  steps: BusinessSetupStepDefinition[];
};

export const BusinessSetupStepsList = ({
  completedSteps,
  currentStep,
  dirtySteps,
  isDisabled,
  onStepChange,
  orientation = "horizontal",
  steps,
}: BusinessSetupStepsListProperties) => {
  const t = useTranslations();
  const dirtyLabel = t("businessSetup.unsavedStep");

  if (orientation === "vertical") {
    return (
      <ol className="grid min-w-0 content-start gap-2">
        {steps.map((step, index) => (
          <BusinessSetupStepItem
            key={step.key}
            description={t(step.descriptionKey)}
            dirtyLabel={dirtyLabel}
            isCompleted={completedSteps.includes(step.key)}
            isCurrent={step.key === currentStep}
            isDirty={dirtySteps.includes(step.key)}
            isDisabled={isDisabled}
            label={t(step.labelKey)}
            onSelect={() => onStepChange(step.key)}
            orientation="vertical"
            stepNumber={index + 1}
          />
        ))}
      </ol>
    );
  }

  return (
    <ScrollArea
      className="h-auto"
      contentClassName="h-auto overflow-x-auto overflow-y-hidden pb-3 pr-0"
      scrollbar="horizontal"
    >
      <ol className="flex w-max min-w-full items-stretch gap-2">
        {steps.map((step, index) => {
          return (
            <Fragment key={step.key}>
              <BusinessSetupStepItem
                description={t(step.descriptionKey)}
                dirtyLabel={dirtyLabel}
                isCompleted={completedSteps.includes(step.key)}
                isCurrent={step.key === currentStep}
                isDirty={dirtySteps.includes(step.key)}
                isDisabled={isDisabled}
                label={t(step.labelKey)}
                onSelect={() => onStepChange(step.key)}
                orientation="horizontal"
                stepNumber={index + 1}
              />
              {index < steps.length - 1 ? (
                <li
                  aria-hidden="true"
                  className="flex shrink-0 items-center text-copy-muted"
                >
                  <ArrowRightIcon className="size-4" />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </ScrollArea>
  );
};

export type { BusinessSetupStepsListProperties };
