"use client";

import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/PageHeader";
import { BackgroundSVG } from "@/components/svgs";
import { LoadingOverlay } from "@/components/reusable";
import { BusinessSetupStepsColumn } from "@/features/businessSetup/components/stepsColumn";
import { cn } from "@/lib/utils";

import type { ReactNode } from "react";
import type { BusinessSetupStep } from "@beauty-booking/shared";
import type { BusinessSetupStepDefinition } from "@/features/businessSetup/businessSetupConfig";

type BusinessSetupWizardShellProperties = {
  children: ReactNode;
  completedSteps?: BusinessSetupStep[];
  currentStep: BusinessSetupStep;
  dirtySteps?: BusinessSetupStep[];
  footer: ReactNode;
  isInteractionDisabled?: boolean;
  isLoading?: boolean;
  onStepChange: (step: BusinessSetupStep) => void;
  steps: BusinessSetupStepDefinition[];
};

export const BusinessSetupWizardShell = ({
  children,
  completedSteps = [],
  currentStep,
  dirtySteps = [],
  footer,
  isInteractionDisabled = false,
  isLoading = false,
  onStepChange,
  steps,
}: BusinessSetupWizardShellProperties) => {
  const t = useTranslations();

  return (
    <div className="relative h-[calc(100dvh-4rem)] overflow-hidden bg-background px-4 py-6 text-copy sm:px-6 md:h-dvh lg:px-8">
      <BackgroundSVG className="opacity-70" priority />

      <div className="relative mx-auto grid h-full min-h-0 w-full max-w-7xl grid-rows-[auto_minmax(0,1fr)] gap-4">
        <PageHeader
          description={t("businessSetup.page.description")}
          title={t("businessSetup.page.title")}
        />

        <section
          aria-busy={isInteractionDisabled || isLoading || undefined}
          className={cn(
            "@container/wizard relative grid min-h-0 min-w-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden rounded-lg border border-line bg-card/90 p-4 shadow-sm backdrop-blur-sm",
            isInteractionDisabled && "cursor-wait",
          )}
          inert={isInteractionDisabled}
        >
          {isLoading ? (
            <LoadingOverlay
              isOpen
              scope="container"
              title={t("businessSetup.overlays.loadingTitle")}
              variant="bare"
            />
          ) : (
            <>
              <div className="grid min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-6 overflow-hidden pb-4 @min-[60rem]/wizard:grid-cols-[15rem_minmax(0,1fr)] @min-[60rem]/wizard:grid-rows-1">
                <aside className="h-64 min-h-0 overflow-hidden border-b border-line pb-6 pr-2 sm:h-72 @min-[60rem]/wizard:h-full @min-[60rem]/wizard:border-b-0 @min-[60rem]/wizard:border-r @min-[60rem]/wizard:pb-0 @min-[60rem]/wizard:pr-1">
                  <BusinessSetupStepsColumn
                    completedSteps={completedSteps}
                    currentStep={currentStep}
                    dirtySteps={dirtySteps}
                    isDisabled={isInteractionDisabled}
                    onStepChange={onStepChange}
                    steps={steps}
                  />
                </aside>
                <div
                  key={currentStep}
                  className="@container/step min-h-0 min-w-0 overflow-x-hidden overflow-y-auto overscroll-contain pr-3 [scrollbar-gutter:stable]"
                >
                  <div className="animate-in fade-in-0 slide-in-from-bottom-1 duration-200 ease-out motion-reduce:animate-none">
                    {children}
                  </div>
                </div>
              </div>
              {footer}
            </>
          )}
          {isInteractionDisabled ? (
            <div
              className="absolute inset-0 z-20 cursor-wait rounded-lg bg-overlay"
              aria-hidden="true"
            />
          ) : null}
        </section>
      </div>
    </div>
  );
};

export type { BusinessSetupWizardShellProperties };
