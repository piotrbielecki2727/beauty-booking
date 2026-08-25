"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CopyIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessOpeningHoursFormSchema,
  businessWeekdays,
  type BusinessOpeningHoursForm,
  type BusinessSetupResponse,
} from "@beauty-booking/shared";

import { TimePickerControl } from "@/components/controlled";
import { Button, Checkbox, Tooltip } from "@/components/reusable";
import { Label } from "@/components/ui/label";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import {
  businessSetupFieldClassNames,
  businessSetupFormClassNames,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";
import { cn } from "@/lib/utils";

type BusinessOpeningHoursStepProperties = {
  draft?: BusinessOpeningHoursForm;
  initialSetup: BusinessSetupResponse | null;
  onDraftChange: (values: BusinessOpeningHoursForm) => void;
  onSave: (values: BusinessOpeningHoursForm) => Promise<void>;
};

const getDefaultOpeningHours = (): BusinessOpeningHoursForm["openingHours"] =>
  businessWeekdays.map((dayOfWeek, index) =>
    index < 5
      ? {
          closesAt: "17:00",
          dayOfWeek,
          isOpen: true,
          opensAt: "09:00",
        }
      : {
          closesAt: "",
          dayOfWeek,
          isOpen: false,
          opensAt: "",
        },
  );

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessOpeningHoursForm => ({
  openingHours: setup?.openingHours.length
    ? setup.openingHours
    : getDefaultOpeningHours(),
});

export const BusinessOpeningHoursStep = ({
  draft,
  initialSetup,
  onDraftChange,
  onSave,
}: BusinessOpeningHoursStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(
    () => getDefaultValues(initialSetup),
    [initialSetup],
  );
  const [initialDraft] = useState(() => draft);
  const form = useForm<BusinessOpeningHoursForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessOpeningHoursFormSchema),
    values: initialDraft ?? persistedValues,
  });
  const openingHours = useWatch({
    control: form.control,
    name: "openingHours",
  });
  useBusinessSetupFormDraft({
    form,
    onDraftChange,
    step: "AVAILABILITY",
  });

  const updateOpeningHours = (
    values: BusinessOpeningHoursForm["openingHours"],
  ) => {
    form.setValue("openingHours", values, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const setDayOpen = (index: number, isOpen: boolean) => {
    updateOpeningHours(
      openingHours.map((item, itemIndex) => {
        if (itemIndex !== index || item.isOpen === isOpen) {
          return item;
        }

        return isOpen
          ? {
              closesAt: "17:00",
              dayOfWeek: item.dayOfWeek,
              isOpen: true,
              opensAt: "09:00",
            }
          : {
              closesAt: "",
              dayOfWeek: item.dayOfWeek,
              isOpen: false,
              opensAt: "",
            };
      }),
    );
  };

  const copyToAllActiveDays = (index: number) => {
    const source = openingHours[index];

    if (!source?.isOpen) {
      return;
    }

    updateOpeningHours(
      openingHours.map((item) =>
        item.isOpen
          ? {
              closesAt: source.closesAt,
              dayOfWeek: item.dayOfWeek,
              isOpen: true,
              opensAt: source.opensAt,
            }
          : item,
      ),
    );
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
      <div className="overflow-hidden rounded-lg border border-line bg-surface">
        {openingHours.map((item, index) => (
          <div
            key={item.dayOfWeek}
            className="grid grid-cols-[minmax(0,1fr)_2.25rem] items-center gap-3 border-b border-line-soft px-4 py-3 last:border-b-0 @min-[48rem]/step:grid-cols-[minmax(10rem,1fr)_minmax(0,12rem)_minmax(0,12rem)_2.25rem]"
          >
            <Checkbox
              checked={item.isOpen}
              className="border-line-strong data-checked:border-brand data-checked:bg-brand"
              containerClassName="min-h-9 content-center"
              label={t(`businessSetup.openingHours.days.${item.dayOfWeek}`)}
              labelClassName="font-semibold text-copy"
              onCheckedChange={(checked) =>
                setDayOpen(index, checked === true)
              }
            />

            {item.isOpen ? (
              <div className="col-span-2 row-start-2 grid min-w-0 gap-3 @min-[28rem]/step:grid-cols-2 @min-[48rem]/step:col-start-2 @min-[48rem]/step:row-start-1">
                <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <Label
                    className="text-sm text-copy"
                    htmlFor={`openingHours.${index}.opensAt`}
                  >
                    {t("businessSetup.openingHours.fields.opensAt")}
                  </Label>
                  <TimePickerControl
                    className={cn("h-9", businessSetupFieldClassNames)}
                    containerClassName="w-full min-w-0"
                    control={form.control}
                    endTime="23:55"
                    feedbackMode="auto"
                    isRequired
                    name={`openingHours.${index}.opensAt`}
                    startTime="00:00"
                    stepMinutes={5}
                  />
                </div>

                <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <Label
                    className="text-sm text-copy"
                    htmlFor={`openingHours.${index}.closesAt`}
                  >
                    {t("businessSetup.openingHours.fields.closesAt")}
                  </Label>
                  <TimePickerControl
                    className={cn("h-9", businessSetupFieldClassNames)}
                    containerClassName="w-full min-w-0"
                    control={form.control}
                    endTime="23:55"
                    feedbackMode="auto"
                    isRequired
                    name={`openingHours.${index}.closesAt`}
                    startTime="00:00"
                    stepMinutes={5}
                  />
                </div>
              </div>
            ) : (
              <div className="col-span-2 row-start-2 flex min-h-9 items-center text-sm text-copy-muted @min-[48rem]/step:col-start-2 @min-[48rem]/step:row-start-1">
                {t("businessSetup.openingHours.closed")}
              </div>
            )}

            <Tooltip
              className="col-start-2 row-start-1 justify-self-end @min-[48rem]/step:col-start-4"
              content={t("businessSetup.openingHours.copyToAllDays")}
              side="left"
            >
              <Button
                aria-label={t("businessSetup.openingHours.copyToAllDays")}
                className="size-9 p-0 disabled:border-line-soft"
                isDisabled={!item.isOpen}
                onClick={() => copyToAllActiveDays(index)}
                type="button"
                variant="outline"
              >
                <CopyIcon className="size-4" aria-hidden="true" />
              </Button>
            </Tooltip>
          </div>
        ))}
      </div>
    </form>
  );
};

export type { BusinessOpeningHoursStepProperties };
