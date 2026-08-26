"use client";

import { CheckIcon, UserIcon, UsersIcon } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Button } from "@/components/reusable";
import { BusinessSetupFieldHeader } from "@/features/businessSetup/components/reusable/BusinessSetupFieldHeader";
import { businessSetupChoiceGroupClassNames } from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { cn } from "@/lib/utils";

import type { UseFormReturn } from "react-hook-form";
import type { BusinessBasicsForm } from "@beauty-booking/shared";

type BusinessModelSelectionProperties = {
  form: UseFormReturn<BusinessBasicsForm>;
};

export const BusinessModelSelection = ({
  form,
}: BusinessModelSelectionProperties) => {
  const t = useTranslations();
  const businessType = useWatch({
    control: form.control,
    name: "businessType",
  });

  return (
    <fieldset className={businessSetupChoiceGroupClassNames}>
      <BusinessSetupFieldHeader
        description={t(
          "businessSetup.businessBasics.descriptions.businessType",
        )}
        label={t("businessSetup.businessBasics.fields.businessType")}
      />
      <div className="grid gap-3 @min-[42rem]/step:grid-cols-2">
        {(["SOLO", "TEAM"] as const).map((option) => {
          const Icon = option === "SOLO" ? UserIcon : UsersIcon;
          const isSelected = businessType === option;

          return (
            <Button
              key={option}
              aria-pressed={isSelected}
              className={cn(
                "h-auto min-h-28 items-center justify-start gap-4 whitespace-normal rounded-lg border border-line bg-background p-4 text-left text-copy shadow-none",
                "transition-[border-color,background-color,box-shadow,color] duration-200 hover:border-line-strong hover:bg-surface-soft hover:text-copy hover:shadow-sm",
                "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/30",
                isSelected &&
                  "border-brand bg-brand-soft text-brand shadow-sm hover:border-brand hover:bg-brand-soft",
              )}
              onClick={() => {
                form.setValue("businessType", option, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              type="button"
              variant="ghost"
            >
              <span
                className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface-soft text-copy-muted",
                  isSelected && "border-brand-soft text-brand",
                )}
              >
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="grid min-w-0 flex-1 gap-1">
                <span
                  className={cn(
                    "font-brand text-base font-semibold text-copy",
                    isSelected && "text-brand",
                  )}
                >
                  {t(`businessSetup.modelSelection.options.${option}.title`)}
                </span>
                <span className="text-sm font-normal leading-5 text-copy-muted">
                  {t(
                    `businessSetup.modelSelection.options.${option}.description`,
                  )}
                </span>
              </span>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full border border-line-strong bg-background text-transparent transition-colors",
                  isSelected && "border-brand bg-brand text-copy-inverse",
                )}
              >
                <CheckIcon
                  className={cn("size-3.5", !isSelected && "opacity-0")}
                  aria-hidden="true"
                />
              </span>
            </Button>
          );
        })}
      </div>
    </fieldset>
  );
};

export type { BusinessModelSelectionProperties };
