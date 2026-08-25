"use client";

import { ClipboardCheckIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button, IconBadge, ScrollArea } from "@/components/reusable";
import { BusinessSetupStepsList } from "@/features/businessSetup/components/stepsColumn/BusinessSetupStepsList";
import { cn } from "@/lib/utils";

import type { BusinessSetupStepDefinition } from "@/features/businessSetup/businessSetupConfig";
import type { BusinessSetupStep } from "@beauty-booking/shared";

type BusinessSetupStepsColumnProperties = {
  completedSteps: BusinessSetupStep[];
  currentStep: BusinessSetupStep;
  dirtySteps?: BusinessSetupStep[];
  isDisabled?: boolean;
  onStepChange: (step: BusinessSetupStep) => void;
  orientation?: "horizontal" | "vertical";
  steps: BusinessSetupStepDefinition[];
};

export const BusinessSetupStepsColumn = ({
  completedSteps,
  currentStep,
  dirtySteps = [],
  isDisabled = false,
  onStepChange,
  orientation = "horizontal",
  steps,
}: BusinessSetupStepsColumnProperties) => {
  const t = useTranslations();
  const progressSteps = steps.filter((step) => step.key !== "SUMMARY");
  const summaryStep = steps.find((step) => step.key === "SUMMARY");

  return (
    <div
      className={cn(
        "min-w-0",
        orientation === "vertical" &&
          "grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto]",
      )}
    >
      {/* Pasek postępu pozostaje celowo ukryty do czasu powrotu tej funkcji. */}

      {orientation === "vertical" ? (
        <>
          <ScrollArea
            className="min-h-0"
            contentClassName="h-full overflow-x-hidden overflow-y-auto pr-3"
          >
            <BusinessSetupStepsList
              completedSteps={completedSteps}
              currentStep={currentStep}
              dirtySteps={dirtySteps}
              isDisabled={isDisabled}
              onStepChange={onStepChange}
              orientation="vertical"
              steps={progressSteps}
            />
          </ScrollArea>

          {summaryStep ? (
            <div className="mt-5 border-t border-line pt-5">
              <Button
                aria-current={
                  currentStep === summaryStep.key ? "step" : undefined
                }
                className={cn(
                  "h-auto w-full items-start justify-start gap-3 whitespace-normal bg-transparent p-0 text-left font-normal text-copy hover:bg-transparent hover:text-brand",
                  currentStep === summaryStep.key && "text-brand",
                )}
                isDisabled={isDisabled}
                onClick={() => onStepChange(summaryStep.key)}
                type="button"
                variant="ghost"
              >
                <IconBadge
                  className="shrink-0 border border-line bg-background"
                  icon={<ClipboardCheckIcon />}
                  size="sm"
                  variant="neutral"
                />
                <span className="grid min-w-0 gap-1">
                  <span className="font-brand text-base font-semibold">
                    {t(summaryStep.labelKey)}
                  </span>
                  <span className="text-sm leading-5 text-copy-muted">
                    {t(summaryStep.descriptionKey)}
                  </span>
                </span>
              </Button>
            </div>
          ) : null}
        </>
      ) : (
        <BusinessSetupStepsList
          completedSteps={completedSteps}
          currentStep={currentStep}
          dirtySteps={dirtySteps}
          isDisabled={isDisabled}
          onStepChange={onStepChange}
          orientation="horizontal"
          steps={progressSteps}
        />
      )}
    </div>
  );
};

export type { BusinessSetupStepsColumnProperties };
