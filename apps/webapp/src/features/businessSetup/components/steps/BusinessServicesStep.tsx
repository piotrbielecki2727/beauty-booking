"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  PlusIcon,
  ScissorsIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessServicesFormSchema,
  businessSpecializations,
  serviceWorkstationTypes,
  type BusinessServiceFormItem,
  type BusinessServicesForm,
  type BusinessSetupResponse,
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

type BusinessServicesStepProperties = {
  draft?: BusinessServicesForm;
  initialSetup: BusinessSetupResponse | null;
  onDraftChange: (values: BusinessServicesForm) => void;
  onSave: (values: BusinessServicesForm) => Promise<void>;
};

const defaultService: BusinessServiceFormItem = {
  description: "",
  durationMinutes: "60",
  isActive: true,
  name: "",
  price: "120",
  specialization: "NAILS",
  workstationType: "ANY",
};

const serviceNameCharactersRegex = /[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 -]/gu;

const formatServiceNameValue = (value: string) =>
  value.replace(serviceNameCharactersRegex, "").slice(0, 60);

const formatDurationValue = (value: string) =>
  value.replace(/\D/g, "").slice(0, 3);

const formatPriceValue = (value: string) => {
  const normalizedValue = value.replace(",", ".");
  const [integerPart = "", decimalPart] = normalizedValue.split(".");
  const nextIntegerPart = integerPart.replace(/\D/g, "").slice(0, 4);

  if (decimalPart === undefined) {
    return nextIntegerPart;
  }

  const nextDecimalPart = decimalPart.replace(/\D/g, "").slice(0, 2);

  return `${nextIntegerPart},${nextDecimalPart}`;
};

const getPriceValue = (priceAmount: number) =>
  String(priceAmount / 100).replace(".", ",");

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessServicesForm => ({
  services:
    setup?.services.length
      ? setup.services.map((service) => ({
          description: service.description ?? "",
          durationMinutes: String(service.durationMinutes),
          id: service.id,
          isActive: service.isActive,
          name: service.name,
          price: getPriceValue(service.priceAmount),
          specialization: service.specialization,
          workstationType: service.workstationType ?? "ANY",
        }))
      : [
          {
            ...defaultService,
            name: "Manicure hybrydowy",
          },
        ],
});

export const BusinessServicesStep = ({
  draft,
  initialSetup,
  onDraftChange,
  onSave,
}: BusinessServicesStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(
    () => getDefaultValues(initialSetup),
    [initialSetup],
  );
  const [initialDraft] = useState(() => draft);
  const form = useForm<BusinessServicesForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessServicesFormSchema),
    values: initialDraft ?? persistedValues,
  });
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    keyName: "formId",
    name: "services",
  });
  const specializationOptions = businessSpecializations.map((type) => ({
    label: t(`businessSetup.businessBasics.specializations.${type}`),
    value: type,
  }));
  const workstationTypeOptions = serviceWorkstationTypes.map((type) => ({
    label:
      type === "ANY"
        ? t("businessSetup.services.workstationTypes.ANY")
        : t(`businessSetup.businessBasics.specializations.${type}`),
    value: type,
  }));

  useBusinessSetupFormDraft({ form, onDraftChange, step: "SERVICES" });

  const handleAddService = () => {
    append({
      ...defaultService,
      name: t("businessSetup.services.defaultName", {
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
          const canRemove = fields.length > 1;

          return (
            <section
              key={field.formId}
              className={businessSetupCardClassNames}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                    <ScissorsIcon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-medium text-copy">
                      {t("businessSetup.services.cardTitle", {
                        number: index + 1,
                      })}
                    </h3>
                    <p className="text-sm text-copy-muted">
                      {t("businessSetup.services.cardDescription")}
                    </p>
                  </div>
                </div>

                <Button
                  isDisabled={!canRemove}
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                  aria-label={t("businessSetup.services.remove")}
                  className="text-copy-muted hover:bg-surface-soft hover:text-brand"
                  onClick={() => remove(index)}
                >
                  <Trash2Icon className="size-4" aria-hidden="true" />
                </Button>
              </div>

              <div
                className={cn(
                  businessSetupFieldRowClassNames,
                  "[grid-template-columns:repeat(auto-fit,minmax(min(16rem,100%),1fr))]",
                )}
              >
                <InputControl
                  control={form.control}
                  description={t("businessSetup.services.descriptions.name")}
                  feedbackMode={businessSetupFeedbackMode}
                  formatValue={formatServiceNameValue}
                  inputClassName={businessSetupFieldClassNames}
                  isRequired
                  label={t("businessSetup.services.fields.name")}
                  maxLength={60}
                  name={`services.${index}.name`}
                  placeholder={t("businessSetup.services.placeholders.name")}
                />

                <SelectControl
                  control={form.control}
                  description={t(
                    "businessSetup.services.descriptions.specialization",
                  )}
                  feedbackMode={businessSetupFeedbackMode}
                  label={t("businessSetup.services.fields.specialization")}
                  name={`services.${index}.specialization`}
                  options={specializationOptions}
                  triggerClassName={businessSetupFieldClassNames}
                />
              </div>

              <div
                className={cn(
                  businessSetupFieldRowClassNames,
                  "[grid-template-columns:repeat(auto-fit,minmax(min(13rem,100%),1fr))]",
                )}
              >
                <InputControl
                  control={form.control}
                  description={t(
                    "businessSetup.services.descriptions.durationMinutes",
                  )}
                  feedbackMode={businessSetupFeedbackMode}
                  formatValue={formatDurationValue}
                  inputClassName={businessSetupFieldClassNames}
                  inputMode="numeric"
                  isRequired
                  label={t("businessSetup.services.fields.durationMinutes")}
                  maxLength={3}
                  name={`services.${index}.durationMinutes`}
                  placeholder={t(
                    "businessSetup.services.placeholders.durationMinutes",
                  )}
                />
                <InputControl
                  control={form.control}
                  description={t("businessSetup.services.descriptions.price")}
                  feedbackMode={businessSetupFeedbackMode}
                  formatValue={formatPriceValue}
                  inputClassName={businessSetupFieldClassNames}
                  inputMode="decimal"
                  isRequired
                  label={t("businessSetup.services.fields.price")}
                  maxLength={7}
                  name={`services.${index}.price`}
                  placeholder={t("businessSetup.services.placeholders.price")}
                />
                <SelectControl
                  control={form.control}
                  description={t(
                    "businessSetup.services.descriptions.workstationType",
                  )}
                  feedbackMode={businessSetupFeedbackMode}
                  label={t("businessSetup.services.fields.workstationType")}
                  name={`services.${index}.workstationType`}
                  options={workstationTypeOptions}
                  triggerClassName={businessSetupFieldClassNames}
                />
              </div>

              <TextareaControl
                control={form.control}
                description={t(
                  "businessSetup.services.descriptions.description",
                )}
                feedbackMode={businessSetupFeedbackMode}
                label={t("businessSetup.services.fields.description")}
                maxLength={500}
                name={`services.${index}.description`}
                placeholder={t(
                  "businessSetup.services.placeholders.description",
                )}
                textareaClassName={cn(
                  businessSetupFieldClassNames,
                  "min-h-20 resize-none",
                )}
              />

              <CheckboxControl
                control={form.control}
                description={t("businessSetup.services.descriptions.isActive")}
                label={t("businessSetup.services.fields.isActive")}
                name={`services.${index}.isActive`}
              />
            </section>
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="justify-center border-dashed"
          onClick={handleAddService}
        >
          <PlusIcon className="size-4" aria-hidden="true" />
          {t("businessSetup.services.add")}
        </Button>
      </div>
    </form>
  );
};

export type { BusinessServicesStepProperties };
