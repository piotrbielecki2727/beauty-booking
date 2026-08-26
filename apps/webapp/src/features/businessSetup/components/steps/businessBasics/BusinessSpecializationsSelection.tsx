"use client";

import {
  CheckIcon,
  EyeIcon,
  PaintbrushIcon,
  WandSparklesIcon,
} from "lucide-react";
import { useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import { businessSpecializations } from "@beauty-booking/shared";

import { Button } from "@/components/reusable";
import { BusinessSetupFieldHeader } from "@/features/businessSetup/components/reusable/BusinessSetupFieldHeader";
import { businessSetupChoiceGroupClassNames } from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { cn } from "@/lib/utils";

import type { ComponentType } from "react";
import type { UseFormReturn } from "react-hook-form";
import type {
  BusinessBasicsForm,
  BusinessSpecialization,
} from "@beauty-booking/shared";
import type { LucideProps } from "lucide-react";

const specializationIcons = {
  BROWS_AND_LASHES: EyeIcon,
  MAKEUP: WandSparklesIcon,
  NAILS: PaintbrushIcon,
} satisfies Record<BusinessSpecialization, ComponentType<LucideProps>>;

type BusinessSpecializationsSelectionProperties = {
  form: UseFormReturn<BusinessBasicsForm>;
};

export const BusinessSpecializationsSelection = ({
  form,
}: BusinessSpecializationsSelectionProperties) => {
  const t = useTranslations();
  const specializations = useWatch({
    control: form.control,
    name: "specializations",
  });

  return (
    <fieldset className={businessSetupChoiceGroupClassNames}>
      <BusinessSetupFieldHeader
        label={t("businessSetup.businessBasics.fields.specializations")}
      />
      <div className="grid gap-3 @min-[42rem]/step:grid-cols-3">
        {businessSpecializations.map((option) => {
          const Icon = specializationIcons[option];
          const isSelected = specializations.includes(option);

          return (
            <Button
              key={option}
              aria-pressed={isSelected}
              className={cn(
                "h-20 items-center justify-start gap-3 whitespace-normal rounded-lg border border-line bg-background px-4 py-3 text-left font-normal text-copy shadow-none",
                "transition-[border-color,background-color,box-shadow] duration-200 hover:border-line-strong hover:bg-surface-soft hover:shadow-sm",
                "focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-ring/30",
              )}
              onClick={() => {
                if (isSelected && specializations.length === 1) {
                  return;
                }

                const nextSpecializations = isSelected
                  ? specializations.filter((value) => value !== option)
                  : [...specializations, option];

                form.setValue("specializations", nextSpecializations, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              type="button"
              variant="ghost"
            >
              <Icon className="size-7 shrink-0 text-brand" aria-hidden="true" />
              <span className="min-w-0 flex-1 font-brand text-base font-semibold">
                {t(
                  `businessSetup.businessBasics.specializations.${option}`,
                )}
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

export type { BusinessSpecializationsSelectionProperties };
