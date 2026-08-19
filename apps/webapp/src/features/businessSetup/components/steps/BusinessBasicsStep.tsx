"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckIcon,
  EyeIcon,
  ScissorsIcon,
  SparklesIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessBasicsFormSchema,
  type BusinessBasicsForm,
  type BusinessSetupResponse,
  type BusinessSpecialization,
  type BusinessType,
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

const specializationOptions = [
  "NAILS",
  "BROWS_AND_LASHES",
  "MAKEUP",
] satisfies BusinessSpecialization[];

const businessTypeOptions = ["SOLO", "TEAM"] satisfies BusinessType[];

const specializationIcons = {
  BROWS_AND_LASHES: EyeIcon,
  MAKEUP: SparklesIcon,
  NAILS: ScissorsIcon,
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
  const businessType = setup?.basics.businessType ?? "SOLO";
  const baseValues = {
    name: setup?.basics.name ?? "",
    specialization: setup?.basics.specialization ?? "NAILS",
  };

  if (businessType === "TEAM") {
    return {
      ...baseValues,
      businessType,
      ownerProvidesServices: setup?.basics.ownerProvidesServices ?? true,
    };
  }

  return {
    ...baseValues,
    businessType: "SOLO",
    ownerProvidesServices: true,
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
  const initialBusinessType = (initialDraft ?? persistedValues).businessType;
  const previousBusinessTypeRef = useRef(initialBusinessType);
  const teamDetailsRef = useRef<HTMLFieldSetElement>(null);
  const businessType = useWatch({
    control: form.control,
    name: "businessType",
  });
  const specialization = useWatch({
    control: form.control,
    name: "specialization",
  });
  const ownerProvidesServices = useWatch({
    control: form.control,
    name: "ownerProvidesServices",
  });
  useBusinessSetupFormDraft({
    form,
    onDraftChange,
    step: "BUSINESS_BASICS",
  });

  useEffect(() => {
    if (businessType === "SOLO" && ownerProvidesServices !== true) {
      form.setValue("ownerProvidesServices", true, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [businessType, form, ownerProvidesServices]);

  useEffect(() => {
    const previousBusinessType = previousBusinessTypeRef.current;

    previousBusinessTypeRef.current = businessType;

    if (previousBusinessType === "TEAM" || businessType !== "TEAM") {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    teamDetailsRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "nearest",
    });
  }, [businessType]);

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
          <InputControl
            control={form.control}
            description={t(
              "businessSetup.businessBasics.descriptions.name",
            )}
            feedbackMode={businessSetupFeedbackMode}
            isRequired
            label={t("businessSetup.businessBasics.fields.name")}
            name="name"
            placeholder={t("businessSetup.businessBasics.placeholders.name")}
            labelClassName="font-semibold text-sm"
          />

          <fieldset className={businessSetupChoiceGroupClassNames}>
            <BusinessSetupFieldHeader
              description={t(
                "businessSetup.businessBasics.descriptions.specialization",
              )}
              label={t("businessSetup.businessBasics.fields.specialization")}
            />
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(10rem,100%),1fr))]">
              {specializationOptions.map((option) => {
                const Icon = specializationIcons[option];
                const isSelected = specialization === option;

                return (
                  <Button
                    key={option}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "relative h-20 flex-col gap-1.5 whitespace-normal rounded-md border border-subtle bg-background py-3 text-center text-sm font-normal transition-colors hover:border-brand hover:bg-surface-soft hover:text-brand",
                      isSelected && "border-brand bg-brand-soft text-brand",
                    )}
                    onClick={() =>
                      form.setValue("specialization", option, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    {isSelected ? (
                      <span className="absolute right-2 top-2 flex size-5 items-center justify-center rounded-full bg-brand text-copy-inverse">
                        <CheckIcon className="size-3" aria-hidden="true" />
                      </span>
                    ) : null}
                    <Icon className="size-5" aria-hidden="true" />
                    {t(
                      `businessSetup.businessBasics.specializations.${option}`,
                    )}
                  </Button>
                );
              })}
            </div>
          </fieldset>
          <fieldset className={businessSetupChoiceGroupClassNames}>
            <BusinessSetupFieldHeader
              description={t(
                "businessSetup.businessBasics.descriptions.businessType",
              )}
              label={t("businessSetup.businessBasics.fields.businessType")}
            />
            <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(16rem,100%),1fr))]">
              {businessTypeOptions.map((option) => {
                const isSelected = businessType === option;
                const Icon = option === "SOLO" ? UserIcon : UsersIcon;

                return (
                  <Button
                    key={option}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "h-auto min-h-16 justify-start gap-3 whitespace-normal rounded-md border border-subtle bg-background px-4 py-3 text-left text-sm font-normal transition-colors hover:border-brand hover:bg-surface-soft hover:text-brand",
                      isSelected && "border-brand bg-brand-soft text-brand",
                    )}
                    onClick={() =>
                      form.setValue("businessType", option, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <Icon className="size-5 shrink-0" aria-hidden="true" />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">
                        {t(
                          `businessSetup.businessBasics.businessTypes.${option}.title`,
                        )}
                      </span>
                      <span className="mt-1 block text-sm text-copy-muted">
                        {t(
                          `businessSetup.businessBasics.businessTypes.${option}.description`,
                        )}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-copy-inverse",
                        !isSelected && "invisible",
                      )}
                    >
                      <CheckIcon className="size-3" aria-hidden="true" />
                    </span>
                  </Button>
                );
              })}
            </div>
          </fieldset>

          {businessType === "TEAM" ? (
            <fieldset
              ref={teamDetailsRef}
              className={businessSetupChoiceGroupClassNames}
            >
              <BusinessSetupFieldHeader
                description={t(
                  "businessSetup.businessBasics.descriptions.ownerProvidesServices",
                )}
                label={t(
                  "businessSetup.businessBasics.fields.ownerProvidesServices",
                )}
              />
              <div className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(min(16rem,100%),1fr))]">
                {[true, false].map((value) => {
                  const isSelected = ownerProvidesServices === value;

                  return (
                    <Button
                      key={String(value)}
                      type="button"
                      variant="ghost"
                      className={cn(
                        "h-auto justify-between whitespace-normal rounded-md border border-subtle bg-background px-4 py-3 text-left text-sm font-normal transition-colors hover:border-brand hover:bg-surface-soft hover:text-brand",
                        isSelected && "border-brand bg-brand-soft text-brand",
                      )}
                      onClick={() =>
                        form.setValue("ownerProvidesServices", value, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                    >
                      <span className="min-w-0 flex-1">
                        {t(
                          `businessSetup.businessBasics.ownerProvidesServices.${String(value)}`,
                        )}
                      </span>
                      <span
                        className={cn(
                          "flex size-5 shrink-0 items-center justify-center rounded-full bg-brand text-copy-inverse",
                          !isSelected && "invisible",
                        )}
                      >
                        <CheckIcon className="size-3" aria-hidden="true" />
                      </span>
                    </Button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}
      </div>
    </form>
  );
};

export type { BusinessBasicsStepProperties };
