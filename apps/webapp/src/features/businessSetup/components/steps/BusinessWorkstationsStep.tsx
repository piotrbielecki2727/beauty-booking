"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  EyeIcon,
  PlusIcon,
  ScissorsIcon,
  SparklesIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessSpecializations,
  businessWorkstationsFormSchema,
  type BusinessSetupResponse,
  type BusinessSpecialization,
  type BusinessWorkstationFormItem,
  type BusinessWorkstationsForm,
} from "@beauty-booking/shared";

import {
  CheckboxControl,
  InputControl,
  SelectControl,
  TextareaControl,
} from "@/components/controlled";
import { Button } from "@/components/reusable";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import {
  businessSetupCardClassNames,
  businessSetupCardsClassNames,
  businessSetupFieldClassNames,
  businessSetupFieldRowClassNames,
  businessSetupFeedbackMode,
  businessSetupFormClassNames,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";
import { cn } from "@/lib/utils";

import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type BusinessWorkstationsStepProperties = {
  draft?: BusinessWorkstationsForm;
  initialSetup: BusinessSetupResponse | null;
  onDraftChange: (values: BusinessWorkstationsForm) => void;
  onSave: (values: BusinessWorkstationsForm) => Promise<void>;
};

const defaultWorkstation: BusinessWorkstationFormItem = {
  isActive: true,
  name: "",
  note: "",
  type: "NAILS",
};

const workstationTypeIcons = {
  BROWS_AND_LASHES: EyeIcon,
  MAKEUP: SparklesIcon,
  NAILS: ScissorsIcon,
} satisfies Record<BusinessSpecialization, ComponentType<LucideProps>>;

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessWorkstationsForm => ({
  workstations:
    setup?.workstations.length
      ? setup.workstations.map((workstation) => ({
          id: workstation.id,
          isActive: workstation.isActive,
          name: workstation.name,
          note: workstation.note ?? "",
          type: workstation.type,
        }))
      : [
          {
            ...defaultWorkstation,
            name: "Stanowisko 1",
          },
        ],
});

export const BusinessWorkstationsStep = ({
  draft,
  initialSetup,
  onDraftChange,
  onSave,
}: BusinessWorkstationsStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(
    () => getDefaultValues(initialSetup),
    [initialSetup],
  );
  const [initialDraft] = useState(() => draft);
  const form = useForm<BusinessWorkstationsForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessWorkstationsFormSchema),
    values: initialDraft ?? persistedValues,
  });
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    keyName: "formId",
    name: "workstations",
  });
  const workstations = useWatch({
    control: form.control,
    name: "workstations",
  });
  const workstationTypeOptions = businessSpecializations.map((type) => ({
    label: t(`businessSetup.businessBasics.specializations.${type}`),
    value: type,
  }));

  useBusinessSetupFormDraft({ form, onDraftChange, step: "WORKSTATIONS" });

  const handleAddWorkstation = () => {
    append({
      ...defaultWorkstation,
      name: t("businessSetup.workstations.defaultName", {
        number: fields.length + 1,
      }),
    });
  };

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
      <div className={businessSetupCardsClassNames}>
          {fields.map((field, index) => {
            const type = workstations?.[index]?.type ?? field.type;
            const TypeIcon = workstationTypeIcons[type];
            const canRemove = fields.length > 1;

            return (
              <section
                key={field.formId}
                className={businessSetupCardClassNames}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                      <TypeIcon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-medium text-copy">
                        {t("businessSetup.workstations.cardTitle", {
                          number: index + 1,
                        })}
                      </h3>
                      <p className="text-sm text-copy-muted">
                        {t("businessSetup.workstations.cardDescription")}
                      </p>
                    </div>
                  </div>

                  <Button
                    isDisabled={!canRemove}
                    size="icon-sm"
                    type="button"
                    variant="ghost"
                    aria-label={t("businessSetup.workstations.remove")}
                    className="text-copy-muted hover:bg-surface-soft hover:text-brand"
                    onClick={() => remove(index)}
                  >
                    <Trash2Icon className="size-4" aria-hidden="true" />
                  </Button>
                </div>

                <div
                  className={cn(
                    businessSetupFieldRowClassNames,
                    "@min-[40rem]/step:grid-cols-[minmax(0,1fr)_14rem]",
                  )}
                >
                  <InputControl
                    control={form.control}
                    description={t(
                      "businessSetup.workstations.descriptions.name",
                    )}
                    feedbackMode={businessSetupFeedbackMode}
                    inputClassName={businessSetupFieldClassNames}
                    isRequired
                    label={t("businessSetup.workstations.fields.name")}
                    name={`workstations.${index}.name`}
                    placeholder={t(
                      "businessSetup.workstations.placeholders.name",
                    )}
                  />

                  <SelectControl
                    control={form.control}
                    description={t(
                      "businessSetup.workstations.descriptions.type",
                    )}
                    feedbackMode={businessSetupFeedbackMode}
                    label={t("businessSetup.workstations.fields.type")}
                    name={`workstations.${index}.type`}
                    options={workstationTypeOptions}
                    triggerClassName={businessSetupFieldClassNames}
                  />
                </div>

                <TextareaControl
                  control={form.control}
                  description={t(
                    "businessSetup.workstations.descriptions.note",
                  )}
                  feedbackMode={businessSetupFeedbackMode}
                  label={t("businessSetup.workstations.fields.note")}
                  name={`workstations.${index}.note`}
                  placeholder={t("businessSetup.workstations.placeholders.note")}
                  textareaClassName={cn(
                    businessSetupFieldClassNames,
                    "min-h-20 resize-none",
                  )}
                />

                <CheckboxControl
                  control={form.control}
                  description={t(
                    "businessSetup.workstations.descriptions.isActive",
                  )}
                  label={t("businessSetup.workstations.fields.isActive")}
                  name={`workstations.${index}.isActive`}
                />
              </section>
            );
          })}

          <Button
            type="button"
            variant="outline"
            className="justify-center border-dashed"
            onClick={handleAddWorkstation}
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            {t("businessSetup.workstations.add")}
          </Button>
      </div>
    </form>
  );
};

export type { BusinessWorkstationsStepProperties };
