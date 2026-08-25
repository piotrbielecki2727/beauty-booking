"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDownIcon,
  CircleCheckIcon,
  CircleXIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
  ScissorsIcon,
  SparklesIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessServiceFormItemSchema,
  businessServicesFormSchema,
  type BusinessServiceFormItem,
  type BusinessServicesForm,
  type BusinessSetupResponse,
  type BusinessSpecialization,
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
};

const specializationIcons = {
  BROWS_AND_LASHES: EyeIcon,
  MAKEUP: SparklesIcon,
  NAILS: ScissorsIcon,
} satisfies Record<BusinessSpecialization, ComponentType<LucideProps>>;

const specializationIconClassNames = {
  BROWS_AND_LASHES:
    "border-[var(--status-warning-border,var(--border))] bg-[var(--status-warning-surface,var(--background))] text-warning",
  MAKEUP:
    "border-[var(--status-info-border,var(--border))] bg-[var(--status-info-surface,var(--background))] text-info",
  NAILS: "border-brand-border bg-brand-soft text-brand",
} satisfies Record<BusinessSpecialization, string>;

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
): BusinessServicesForm => {
  const activeSpecializations: BusinessSpecialization[] =
    setup?.basics.specializations.length
      ? setup.basics.specializations
      : ["NAILS"];
  const services =
    setup?.services.filter((service) =>
      activeSpecializations.includes(service.specialization),
    ) ?? [];

  return {
    services: services.map((service) => ({
      description: service.description ?? "",
      durationMinutes: String(service.durationMinutes),
      id: service.id,
      isActive: service.isActive,
      name: service.name,
      price: getPriceValue(service.priceAmount),
      specialization: service.specialization,
    })),
  };
};

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
  const [isServiceFormVisible, setIsServiceFormVisible] = useState(false);
  const [editingServiceIndex, setEditingServiceIndex] = useState<number | null>(
    null,
  );
  const serviceFormSectionRef = useRef<HTMLElement>(null);
  const form = useForm<BusinessServicesForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessServicesFormSchema),
    values: initialDraft ?? persistedValues,
  });
  const serviceForm = useForm<BusinessServiceFormItem>({
    defaultValues: defaultService,
    mode: "onTouched",
    resolver: zodResolver(businessServiceFormItemSchema),
  });
  const { append, fields, remove, update } = useFieldArray({
    control: form.control,
    keyName: "formId",
    name: "services",
  });
  const services = useWatch({ control: form.control, name: "services" });
  const activeSpecializations: BusinessSpecialization[] =
    initialSetup?.basics.specializations.length
      ? initialSetup.basics.specializations
      : ["NAILS"];
  const specializationOptions = activeSpecializations.map((type) => ({
    label: t(`businessSetup.businessBasics.specializations.${type}`),
    value: type,
  }));
  useBusinessSetupFormDraft({ form, onDraftChange, step: "SERVICES" });

  const resetServiceForm = () => {
    serviceForm.reset({
      ...defaultService,
      specialization: activeSpecializations[0],
    });
    setEditingServiceIndex(null);
    setIsServiceFormVisible(false);
  };

  const handleToggleServiceForm = () => {
    if (isServiceFormVisible) {
      resetServiceForm();
      return;
    }

    serviceForm.reset({
      ...defaultService,
      specialization: activeSpecializations[0],
    });
    setEditingServiceIndex(null);
    setIsServiceFormVisible(true);
  };

  const handleEditService = (service: BusinessServiceFormItem, index: number) => {
    serviceForm.reset(service);
    setEditingServiceIndex(index);
    setIsServiceFormVisible(true);
    window.requestAnimationFrame(() => {
      serviceFormSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
  };

  const handleSaveService = serviceForm.handleSubmit((values) => {
    if (editingServiceIndex === null) {
      append(values);
    } else {
      update(editingServiceIndex, values);
    }

    resetServiceForm();
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch {
      appToast.error({ title: t("businessSetup.feedback.saveFailed") });
    }
  });

  return (
    <form
      className={businessSetupFormClassNames}
      id={BUSINESS_SETUP_ACTIVE_FORM_ID}
      onSubmit={handleSubmit}
    >
      <section className={businessSetupCardClassNames}>
        <div className="flex flex-col gap-3 @min-[42rem]/step:flex-row @min-[42rem]/step:items-center @min-[42rem]/step:justify-between">
          <div>
            <h3 className="font-brand text-xl font-semibold text-brand">
              {t("businessSetup.services.currentTitle")}
            </h3>
            <p className="text-sm leading-5 text-copy-muted">
              {t("businessSetup.services.listDescription")}
            </p>
          </div>
          <Button
            aria-controls="business-service-form"
            aria-expanded={isServiceFormVisible}
            className={cn(
              "w-full @min-[42rem]/step:w-auto",
              !isServiceFormVisible &&
                "border-brand bg-background text-brand hover:bg-surface-soft hover:text-brand",
            )}
            onClick={handleToggleServiceForm}
            type="button"
            variant={isServiceFormVisible ? "default" : "outline"}
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            {t("businessSetup.services.addNew")}
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "size-4 transition-transform duration-200",
                isServiceFormVisible && "rotate-180",
              )}
            />
          </Button>
        </div>

        {isServiceFormVisible ? (
          <section
            ref={serviceFormSectionRef}
            className="order-1 grid animate-in gap-6 rounded-lg border border-line bg-background p-4 fade-in-0 slide-in-from-top-1 duration-300 ease-out motion-reduce:animate-none"
            id="business-service-form"
          >
            <h4 className="font-brand text-lg font-semibold text-brand">
              {t(
                editingServiceIndex === null
                  ? "businessSetup.services.addTitle"
                  : "businessSetup.services.editTitle",
              )}
            </h4>

            <div
              className={cn(
                businessSetupFieldRowClassNames,
                "[grid-template-columns:repeat(auto-fit,minmax(min(16rem,100%),1fr))]",
              )}
            >
              <InputControl
                control={serviceForm.control}
                feedbackMode={businessSetupFeedbackMode}
                formatValue={formatServiceNameValue}
                inputClassName={businessSetupFieldClassNames}
                isRequired
                label={t("businessSetup.services.fields.name")}
                maxLength={60}
                name="name"
                placeholder={t("businessSetup.services.placeholders.name")}
              />
              <SelectControl
                control={serviceForm.control}
                feedbackMode={businessSetupFeedbackMode}
                label={t("businessSetup.services.fields.specialization")}
                name="specialization"
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
                control={serviceForm.control}
                feedbackMode={businessSetupFeedbackMode}
                formatValue={formatDurationValue}
                inputClassName={businessSetupFieldClassNames}
                inputMode="numeric"
                isRequired
                label={t("businessSetup.services.fields.durationMinutes")}
                maxLength={3}
                name="durationMinutes"
                placeholder={t(
                  "businessSetup.services.placeholders.durationMinutes",
                )}
              />
              <InputControl
                control={serviceForm.control}
                feedbackMode={businessSetupFeedbackMode}
                formatValue={formatPriceValue}
                inputClassName={businessSetupFieldClassNames}
                inputMode="decimal"
                isRequired
                label={t("businessSetup.services.fields.price")}
                maxLength={7}
                name="price"
                placeholder={t("businessSetup.services.placeholders.price")}
              />
            </div>

            <TextareaControl
              control={serviceForm.control}
              feedbackMode={businessSetupFeedbackMode}
              label={t("businessSetup.services.fields.description")}
              maxLength={500}
              name="description"
              placeholder={t(
                "businessSetup.services.placeholders.description",
              )}
              textareaClassName={cn(
                businessSetupFieldClassNames,
                "min-h-20 resize-none",
              )}
            />
            <CheckboxControl
              control={serviceForm.control}
              label={t("businessSetup.services.fields.isActive")}
              name="isActive"
            />

            <div className="flex justify-end">
              <div className="grid grid-cols-2 gap-3 @min-[42rem]/step:flex @min-[42rem]/step:justify-end">
                <Button
                  onClick={resetServiceForm}
                  type="button"
                  variant="outline"
                >
                  <XIcon className="size-4" aria-hidden="true" />
                  {t("businessSetup.services.cancel")}
                </Button>
                <Button onClick={handleSaveService} type="button">
                  {editingServiceIndex === null ? (
                    <PlusIcon className="size-4" aria-hidden="true" />
                  ) : (
                    <SaveIcon className="size-4" aria-hidden="true" />
                  )}
                  {t(
                    editingServiceIndex === null
                      ? "businessSetup.services.add"
                      : "businessSetup.services.save",
                  )}
                </Button>
              </div>
            </div>
          </section>
        ) : null}

        <div className="order-2 grid gap-3">
          {fields.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-sm text-copy-muted">
              {t("businessSetup.services.empty")}
            </div>
          ) : null}

          {fields.map((field, index) => {
            const service = services?.[index] ?? field;
            const Icon = specializationIcons[service.specialization];

            return (
              <article
                key={field.formId}
                className="grid gap-3 rounded-lg border border-line bg-background p-4 @min-[60rem]/step:grid-cols-[minmax(0,1.4fr)_10rem_7rem_7rem_18rem] @min-[60rem]/step:items-center"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-md border",
                      specializationIconClassNames[service.specialization],
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-copy">
                      {service.name}
                    </p>
                    <p className="truncate text-sm text-copy-muted">
                      {service.description ||
                        t("businessSetup.services.noDescription")}
                    </p>
                  </div>
                </div>
                <span className="w-fit rounded-md border border-line bg-surface px-2.5 py-1 text-xs font-medium text-copy-muted">
                  {t(
                    `businessSetup.businessBasics.specializations.${service.specialization}`,
                  )}
                </span>
                <span className="text-sm text-copy">
                  {t("businessSetup.services.durationValue", {
                    duration: service.durationMinutes,
                  })}
                </span>
                <span className="text-sm font-medium text-copy">
                  {t("businessSetup.services.priceValue", {
                    price: service.price,
                  })}
                </span>
                <div className="flex flex-wrap items-center gap-2 @min-[60rem]/step:justify-end">
                  <span
                    className={cn(
                      "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs font-medium",
                      service.isActive
                        ? "border-[var(--status-success-border,var(--border))] bg-[var(--status-success-surface,var(--background))] text-success"
                        : "border-line bg-surface text-copy-muted",
                    )}
                  >
                    {service.isActive ? (
                      <CircleCheckIcon className="size-4" aria-hidden="true" />
                    ) : (
                      <CircleXIcon className="size-4" aria-hidden="true" />
                    )}
                    {t(
                      service.isActive
                        ? "businessSetup.services.status.active"
                        : "businessSetup.services.status.inactive",
                    )}
                  </span>
                  <Button
                    className="text-copy-muted hover:bg-surface-soft hover:text-brand"
                    isDisabled={isServiceFormVisible}
                    onClick={() => handleEditService(service, index)}
                    type="button"
                    variant="ghost"
                  >
                    <PencilIcon className="size-4" aria-hidden="true" />
                    {t("businessSetup.services.edit")}
                  </Button>
                  <Button
                    className="text-copy-muted hover:bg-surface-soft hover:text-brand"
                    isDisabled={isServiceFormVisible}
                    onClick={() => remove(index)}
                    type="button"
                    variant="ghost"
                  >
                    <Trash2Icon className="size-4" aria-hidden="true" />
                    {t("businessSetup.services.remove")}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {form.formState.isSubmitted && fields.length === 0 ? (
          <p className="order-3 text-sm text-destructive">
            {t("validation.business.services.minItems")}
          </p>
        ) : null}
      </section>
    </form>
  );
};

export type { BusinessServicesStepProperties };
