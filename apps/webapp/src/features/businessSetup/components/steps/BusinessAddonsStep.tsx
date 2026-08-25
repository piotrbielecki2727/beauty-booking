"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Clock3Icon,
  InfoIcon,
  PackageOpenIcon,
  PlusIcon,
  SparklesIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import { CheckboxControl, InputControl } from "@/components/controlled";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
} from "@/components/reusable";
import { businessAddonsFormSchema } from "@/features/businessSetup/businessSetupAddonsSchema";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import {
  businessSetupFieldClassNames,
  businessSetupFieldRowClassNames,
  businessSetupFeedbackMode,
  businessSetupFormClassNames,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";
import { cn } from "@/lib/utils";

import type { BusinessSetupResponse } from "@beauty-booking/shared";
import type {
  BusinessAddonsForm,
  BusinessServiceAddonFormItem,
} from "@/features/businessSetup/businessSetupAddonsSchema";

type BusinessAddonsStepProperties = {
  draft?: BusinessAddonsForm;
  initialValues: BusinessAddonsForm;
  onDraftChange: (values: BusinessAddonsForm) => void;
  onSave: (values: BusinessAddonsForm) => Promise<void>;
  services: BusinessSetupResponse["services"];
};

const addonNameCharactersRegex =
  /[^A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 -]/gu;

const formatAddonNameValue = (value: string) =>
  value.replace(addonNameCharactersRegex, "").slice(0, 60);

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

const createDefaultAddon = (
  serviceId: string,
): BusinessServiceAddonFormItem => ({
  durationMinutes: "0",
  isActive: true,
  name: "",
  price: "0",
  serviceId,
});

export const BusinessAddonsStep = ({
  draft,
  initialValues,
  onDraftChange,
  onSave,
  services,
}: BusinessAddonsStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(() => initialValues, [initialValues]);
  const [initialDraft] = useState(() => draft);
  const form = useForm<BusinessAddonsForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessAddonsFormSchema),
    values: initialDraft ?? persistedValues,
  });
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    keyName: "formId",
    name: "addons",
  });
  const addons = useWatch({
    control: form.control,
    name: "addons",
  });

  useBusinessSetupFormDraft({ form, onDraftChange, step: "ADDONS" });

  const handleAddAddon = (serviceId: string) => {
    append(createDefaultAddon(serviceId));
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
      <div className="flex items-start gap-3 rounded-lg border border-line bg-surface/70 p-4 text-sm leading-6 text-copy-muted">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
        <p>{t("businessSetup.addons.info")}</p>
      </div>

      <Accordion
        className="gap-4"
        defaultValue={services[0]?.id ? [services[0].id] : undefined}
        multiple
      >
        {services.map((service) => {
          const serviceAddonFields = fields
            .map((field, index) => ({ field, index }))
            .filter(({ field }) => field.serviceId === service.id);
          const serviceAddons =
            addons?.filter((addon) => addon.serviceId === service.id) ?? [];

          return (
            <AccordionItem key={service.id} value={service.id}>
              <div className="flex flex-col gap-3 border-b border-line px-4 py-3 @min-[42rem]/step:flex-row @min-[42rem]/step:items-center @min-[42rem]/step:justify-between">
                <AccordionTrigger className="-m-3 min-h-0 flex-1 border-0 px-3 py-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                      <SparklesIcon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="grid min-w-0 gap-1">
                      <span className="truncate font-medium text-brand">
                        {service.name}
                      </span>
                      <span className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-normal text-copy-muted">
                        <span>
                          {t("businessSetup.addons.serviceDuration", {
                            duration: service.durationMinutes,
                          })}
                        </span>
                        <span>
                          {t("businessSetup.addons.servicePrice", {
                            price: getPriceValue(service.priceAmount),
                          })}
                        </span>
                      </span>
                    </span>
                  </span>
                </AccordionTrigger>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-brand text-brand hover:bg-surface-soft hover:text-brand-hover @min-[42rem]/step:w-auto"
                  onClick={() => handleAddAddon(service.id)}
                >
                  <PlusIcon className="size-4" aria-hidden="true" />
                  {t("businessSetup.addons.add")}
                </Button>
              </div>

              <AccordionContent className="pt-4">
                {serviceAddonFields.length ? (
                  <div className="grid gap-3">
                    {serviceAddonFields.map(({ field, index }) => {
                      const addon = addons?.[index] ?? field;

                      return (
                        <section
                          key={field.formId}
                          className="grid gap-4 rounded-lg border border-line bg-background p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <h3 className="font-medium text-copy">
                                {addon.name || t("businessSetup.addons.newAddon")}
                              </h3>
                              <p className="text-sm text-copy-muted">
                                {t("businessSetup.addons.addonDescription")}
                              </p>
                            </div>

                            <Button
                              size="icon-sm"
                              type="button"
                              variant="ghost"
                              aria-label={t("businessSetup.addons.remove")}
                              className="text-copy-muted hover:bg-surface-soft hover:text-brand"
                              onClick={() => remove(index)}
                            >
                              <Trash2Icon className="size-4" aria-hidden="true" />
                            </Button>
                          </div>

                          <div
                            className={cn(
                              businessSetupFieldRowClassNames,
                              "[grid-template-columns:repeat(auto-fit,minmax(min(12rem,100%),1fr))]",
                            )}
                          >
                            <InputControl
                              control={form.control}
                              feedbackMode={businessSetupFeedbackMode}
                              formatValue={formatAddonNameValue}
                              inputClassName={businessSetupFieldClassNames}
                              isRequired
                              label={t("businessSetup.addons.fields.name")}
                              maxLength={60}
                              name={`addons.${index}.name`}
                              placeholder={t(
                                "businessSetup.addons.placeholders.name",
                              )}
                            />

                            <InputControl
                              control={form.control}
                              feedbackMode={businessSetupFeedbackMode}
                              formatValue={formatDurationValue}
                              icon={<Clock3Icon className="size-4" aria-hidden="true" />}
                              inputClassName={businessSetupFieldClassNames}
                              inputMode="numeric"
                              isRequired
                              label={t(
                                "businessSetup.addons.fields.durationMinutes",
                              )}
                              maxLength={3}
                              name={`addons.${index}.durationMinutes`}
                              placeholder={t(
                                "businessSetup.addons.placeholders.durationMinutes",
                              )}
                            />

                            <InputControl
                              control={form.control}
                              feedbackMode={businessSetupFeedbackMode}
                              formatValue={formatPriceValue}
                              icon={<TagIcon className="size-4" aria-hidden="true" />}
                              inputClassName={businessSetupFieldClassNames}
                              inputMode="decimal"
                              isRequired
                              label={t("businessSetup.addons.fields.price")}
                              maxLength={7}
                              name={`addons.${index}.price`}
                              placeholder={t(
                                "businessSetup.addons.placeholders.price",
                              )}
                            />
                          </div>

                          <CheckboxControl
                            control={form.control}
                            label={t("businessSetup.addons.fields.isActive")}
                            name={`addons.${index}.isActive`}
                          />
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid min-h-28 place-items-center rounded-lg border border-dashed border-line bg-background p-6 text-center">
                    <div className="grid justify-items-center gap-2">
                      <PackageOpenIcon
                        className="size-6 text-copy-muted"
                        aria-hidden="true"
                      />
                      <p className="text-sm text-copy-muted">
                        {t("businessSetup.addons.empty")}
                      </p>
                    </div>
                  </div>
                )}

                {serviceAddons.length ? null : (
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-3 w-full justify-center border-dashed"
                    onClick={() => handleAddAddon(service.id)}
                  >
                    <PlusIcon className="size-4" aria-hidden="true" />
                    {t("businessSetup.addons.add")}
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </form>
  );
};

export type { BusinessAddonsStepProperties };
