"use client";

import { CircleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { getBusinessSetupStepItem } from "@/features/businessSetup/businessSetupConfig";

import type { BusinessSetupStep } from "@beauty-booking/shared";

type BusinessSetupStepRequirementsStateProperties = {
  missingSteps: BusinessSetupStep[];
};

export const BusinessSetupStepRequirementsState = ({
  missingSteps,
}: BusinessSetupStepRequirementsStateProperties) => {
  const t = useTranslations();

  return (
    <div className="grid min-h-72 place-items-center rounded-lg border border-line bg-surface p-6 text-center">
      <div className="grid max-w-lg justify-items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-brand-soft text-brand">
          <CircleAlertIcon className="size-6" aria-hidden="true" />
        </span>
        <div className="grid gap-2">
          <h2 className="font-brand text-2xl font-semibold text-brand">
            {t("businessSetup.requirements.title")}
          </h2>
          <p className="text-sm leading-6 text-copy-muted">
            {t("businessSetup.requirements.description")}
          </p>
        </div>
        <ul className="flex flex-wrap justify-center gap-2">
          {missingSteps.map((step) => {
            const stepItem = getBusinessSetupStepItem(step);

            return stepItem ? (
              <li
                key={step}
                className="rounded-full border border-line bg-background px-3 py-1.5 text-sm text-copy"
              >
                {t(stepItem.labelKey)}
              </li>
            ) : null;
          })}
        </ul>
      </div>
    </div>
  );
};

export type { BusinessSetupStepRequirementsStateProperties };
