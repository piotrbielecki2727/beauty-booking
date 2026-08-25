"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  EyeIcon,
  PaintbrushIcon,
  UserIcon,
  UsersIcon,
  WandSparklesIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessBasicsFormSchema,
  businessSpecializations,
  type BusinessBasicsForm,
  type BusinessSetupResponse,
  type BusinessSpecialization,
} from "@beauty-booking/shared";

import { InputControl } from "@/components/controlled";
import { Button } from "@/components/reusable";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import { BusinessSetupFieldHeader } from "@/features/businessSetup/components/reusable/BusinessSetupFieldHeader";
import {
  businessSetupChoiceGroupClassNames,
  businessSetupFeedbackMode,
  businessSetupFormClassNames,
  businessSetupSectionsClassNames,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";
import { cn } from "@/lib/utils";

import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

const specializationIcons = {
  BROWS_AND_LASHES: EyeIcon,
  MAKEUP: WandSparklesIcon,
  NAILS: PaintbrushIcon,
} satisfies Record<BusinessSpecialization, ComponentType<LucideProps>>;

type BusinessBasicsStepProperties = {
  draft?: BusinessBasicsForm;
  initialSetup: BusinessSetupResponse | null;
  onDraftChange: (values: BusinessBasicsForm) => void;
  onSave: (values: BusinessBasicsForm) => Promise<void>;
};

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessBasicsForm => {
  const hasSavedBusinessBasics =
    setup?.setup.completedSteps.includes("BUSINESS_BASICS") ?? false;
  const specializations: BusinessSpecialization[] =
    setup?.basics.specializations.length
      ? setup.basics.specializations
      : ["NAILS"];

  return {
    businessType: setup?.basics.businessType ?? "SOLO",
    name: hasSavedBusinessBasics ? setup?.basics.name ?? "" : "",
    specializations,
  };
};

export const BusinessBasicsStep = ({
  draft,
  initialSetup,
  onDraftChange,
  onSave,
}: BusinessBasicsStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(
    () => getDefaultValues(initialSetup),
    [initialSetup],
  );
  const [initialDraft] = useState(() => draft);
  const form = useForm<BusinessBasicsForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessBasicsFormSchema),
    values: initialDraft ?? persistedValues,
  });
  const specializations = useWatch({
    control: form.control,
    name: "specializations",
  });
  const businessType = useWatch({
    control: form.control,
    name: "businessType",
  });
  useBusinessSetupFormDraft({
    form,
    onDraftChange,
    step: "BUSINESS_BASICS",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch {
      appToast.error({
        title: t("businessSetup.feedback.saveFailed"),
      });
    }
  });

  return (
    <form
      className={businessSetupFormClassNames}
      id={BUSINESS_SETUP_ACTIVE_FORM_ID}
      onSubmit={handleSubmit}
    >
      <div className={businessSetupSectionsClassNames}>
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
                      {t(
                        `businessSetup.modelSelection.options.${option}.title`,
                      )}
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
                      isSelected &&
                        "border-brand bg-brand text-copy-inverse",
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

        <InputControl
          control={form.control}
          feedbackMode={businessSetupFeedbackMode}
          isRequired
          label={t("businessSetup.businessBasics.fields.name")}
          labelClassName="text-sm font-semibold"
          name="name"
          placeholder={t("businessSetup.businessBasics.placeholders.name")}
        />

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
                  <Icon
                    className="size-7 shrink-0 text-brand"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1 font-brand text-base font-semibold">
                    {t(
                      `businessSetup.businessBasics.specializations.${option}`,
                    )}
                  </span>
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border border-line-strong bg-background text-transparent transition-colors",
                      isSelected &&
                        "border-brand bg-brand text-copy-inverse",
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
      </div>
    </form>
  );
};

export type { BusinessBasicsStepProperties };
