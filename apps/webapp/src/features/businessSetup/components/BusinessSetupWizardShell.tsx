"use client";

import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/layout/PageHeader";
import { BackgroundSVG } from "@/components/svgs";
import { LoadingOverlay, ScrollArea } from "@/components/reusable";
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
  isStepNavigationDisabled?: boolean;
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
  isStepNavigationDisabled = false,
  onStepChange,
  steps,
}: BusinessSetupWizardShellProperties) => {
  const t = useTranslations();

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] animate-in overflow-visible bg-background px-3 py-3 text-copy fade-in-0 duration-300 motion-reduce:animate-none sm:px-6 sm:py-6 md:min-h-dvh lg:px-8 xl:h-dvh xl:min-h-0 xl:overflow-hidden">
      <BackgroundSVG className="opacity-70" priority />

      <div className="relative mx-auto h-auto min-h-0 w-full max-w-[96rem] xl:h-full">
        <section
          aria-busy={isInteractionDisabled || isLoading || undefined}
          className={cn(
            "@container/wizard relative h-auto min-h-0 min-w-0 overflow-visible xl:h-full xl:overflow-hidden",
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
            <div className="grid min-h-0 gap-4 xl:h-full xl:grid-cols-[minmax(0,1fr)_21rem] xl:grid-rows-[auto_minmax(0,1fr)] xl:gap-x-5">
              <div className="min-w-0 xl:col-start-1 xl:row-start-1">
                <PageHeader
                  description={t("businessSetup.page.description")}
                  title={t("businessSetup.page.title")}
                />
              </div>

              <nav
                aria-label={t("businessSetup.progressNavigationLabel")}
                className="xl:hidden"
              >
                <BusinessSetupStepsColumn
                  completedSteps={completedSteps}
                  currentStep={currentStep}
                  dirtySteps={dirtySteps}
                  isDisabled={isStepNavigationDisabled}
                  onStepChange={onStepChange}
                  orientation="horizontal"
                  steps={steps}
                />
              </nav>

              <div className="@container/step min-h-0 overflow-hidden rounded-xl border border-line bg-card/90 shadow-sm backdrop-blur-sm xl:col-start-1 xl:row-start-2 xl:h-full">
                <ScrollArea
                  key={currentStep}
                  className="overflow-visible xl:h-full xl:overflow-hidden"
                  contentClassName="h-auto overflow-x-visible overflow-y-visible pr-0 xl:h-full xl:overflow-x-hidden xl:overflow-y-auto xl:pr-4"
                  verticalScrollbarClassName="bottom-3 right-2 top-3"
                >
                  <div className="min-h-full transform-gpu p-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none sm:p-5">
                    {children}
                  </div>
                </ScrollArea>
              </div>

              <div className="xl:hidden">{footer}</div>

              <aside className="hidden min-h-0 overflow-hidden rounded-xl border border-line bg-card/90 shadow-sm backdrop-blur-sm xl:col-start-2 xl:row-start-2 xl:grid xl:grid-rows-[minmax(0,1fr)_auto]">
                <nav
                  aria-label={t("businessSetup.progressNavigationLabel")}
                  className="min-h-0 p-5"
                >
                  <BusinessSetupStepsColumn
                    completedSteps={completedSteps}
                    currentStep={currentStep}
                    dirtySteps={dirtySteps}
                    isDisabled={isStepNavigationDisabled}
                    onStepChange={onStepChange}
                    orientation="vertical"
                    steps={steps}
                  />
                </nav>
                <div className="border-t border-line p-5">{footer}</div>
              </aside>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export type { BusinessSetupWizardShellProperties };
