"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarRangeIcon,
  CheckIcon,
  InfoIcon,
  RefreshCwIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessBookingReleaseModes,
  businessBookingRulesFormSchema,
  type BusinessBookingReleaseMode,
  type BusinessBookingRulesForm,
  type BusinessSetupResponse,
} from "@beauty-booking/shared";

import {
  InputControl,
  SegmentedControlControl,
  SelectControl,
  SwitchControl,
} from "@/components/controlled";
import { Button, IconBadge } from "@/components/reusable";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import {
  businessSetupFieldClassNames,
  businessSetupFeedbackMode,
  businessSetupFormClassNames,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";
import { cn } from "@/lib/utils";

import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type BusinessBookingRulesStepProperties = {
  draft?: BusinessBookingRulesForm;
  initialSetup: BusinessSetupResponse | null;
  onDraftChange: (values: BusinessBookingRulesForm) => void;
  onSave: (values: BusinessBookingRulesForm) => Promise<void>;
};

const bookingReleaseModeIcons = {
  MANUAL: CalendarRangeIcon,
  ROLLING: RefreshCwIcon,
} satisfies Record<
  BusinessBookingReleaseMode,
  ComponentType<LucideProps>
>;

const integerValueFormatter = (maximumLength: number) => (value: string) =>
  value.replace(/\D/g, "").slice(0, maximumLength);

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessBookingRulesForm =>
  setup?.bookingRules ?? {
    allowAnyTeamMember: true,
    allowSpecificTeamMember: true,
    bookingHorizonDays: "60",
    bookingReleaseMode: "ROLLING",
    cancellationDeadlineHours: "24",
    inSalonConfirmationMode: "AUTOMATIC",
    minimumAdvanceMinutes: "120",
  };

export const BusinessBookingRulesStep = ({
  draft,
  initialSetup,
  onDraftChange,
  onSave,
}: BusinessBookingRulesStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(
    () => getDefaultValues(initialSetup),
    [initialSetup],
  );
  const [initialDraft] = useState(() => draft);
  const form = useForm<BusinessBookingRulesForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessBookingRulesFormSchema),
    values: initialDraft ?? persistedValues,
  });
  const bookingReleaseMode = useWatch({
    control: form.control,
    name: "bookingReleaseMode",
  });
  const allowSpecificTeamMember = useWatch({
    control: form.control,
    name: "allowSpecificTeamMember",
  });
  const allowAnyTeamMember = useWatch({
    control: form.control,
    name: "allowAnyTeamMember",
  });
  const isTeamBusiness = initialSetup?.basics.businessType === "TEAM";
  const hasMobileServices =
    initialSetup?.location.mobileServicesEnabled === true;

  useBusinessSetupFormDraft({
    form,
    onDraftChange,
    step: "BOOKING_RULES",
  });

  const setBookingReleaseMode = (mode: BusinessBookingReleaseMode) => {
    if (mode === bookingReleaseMode) {
      return;
    }

    form.setValue("bookingReleaseMode", mode, {
      shouldDirty: true,
      shouldValidate: false,
    });
    form.setValue("bookingHorizonDays", mode === "ROLLING" ? "60" : "", {
      shouldDirty: true,
      shouldValidate: false,
    });
    void form.trigger();
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
      <section className="grid gap-5">
        <div className="grid gap-1.5">
          <h3 className="font-brand text-xl font-semibold text-brand">
            {t("businessSetup.bookingRules.release.title")}
          </h3>
          <p className="text-sm leading-6 text-copy-muted">
            {t("businessSetup.bookingRules.release.description")}
          </p>
        </div>

        <div className="grid gap-3 @min-[42rem]/step:grid-cols-2">
          {businessBookingReleaseModes.map((mode) => {
            const Icon = bookingReleaseModeIcons[mode];
            const isSelected = bookingReleaseMode === mode;

            return (
              <Button
                key={mode}
                aria-pressed={isSelected}
                className={cn(
                  "relative h-auto min-h-36 items-start justify-start whitespace-normal rounded-lg border border-line bg-background p-4 text-left text-copy shadow-none hover:border-brand hover:bg-surface-soft hover:text-copy",
                  isSelected && "border-brand bg-brand-soft",
                )}
                onClick={() => setBookingReleaseMode(mode)}
                type="button"
                variant="outline"
              >
                <span className="grid gap-3">
                  <IconBadge
                    icon={<Icon aria-hidden="true" />}
                    size="sm"
                    variant={isSelected ? "brand" : "neutral"}
                  />
                  <span className="grid gap-1">
                    <span
                      className={cn(
                        "font-semibold",
                        isSelected && "text-brand",
                      )}
                    >
                      {t(
                        `businessSetup.bookingRules.release.modes.${mode}.title`,
                      )}
                    </span>
                    <span className="text-sm font-normal leading-5 text-copy-muted">
                      {t(
                        `businessSetup.bookingRules.release.modes.${mode}.description`,
                      )}
                    </span>
                  </span>
                </span>

                {isSelected ? (
                  <span className="absolute right-3 top-3 flex size-6 items-center justify-center rounded-full bg-brand text-copy-inverse">
                    <CheckIcon className="size-3.5" aria-hidden="true" />
                  </span>
                ) : null}
              </Button>
            );
          })}
        </div>

        {bookingReleaseMode === "ROLLING" ? (
          <div className="grid gap-3 rounded-lg border border-line bg-surface p-4 @min-[36rem]/step:grid-cols-[minmax(0,1fr)_10rem] @min-[36rem]/step:items-end">
            <div className="grid gap-1">
              <p className="font-semibold text-copy">
                {t("businessSetup.bookingRules.release.rollingFieldTitle")}
              </p>
              <p className="text-sm leading-5 text-copy-muted">
                {t("businessSetup.bookingRules.release.rollingHint")}
              </p>
            </div>
            <InputControl
              control={form.control}
              feedbackMode={businessSetupFeedbackMode}
              formatValue={integerValueFormatter(3)}
              inputClassName={businessSetupFieldClassNames}
              inputMode="numeric"
              isRequired
              label={t("businessSetup.bookingRules.fields.daysAhead")}
              name="bookingHorizonDays"
            />
          </div>
        ) : null}

        {bookingReleaseMode === "MANUAL" ? (
          <div className="flex gap-3 rounded-lg border border-line bg-surface p-4 text-sm leading-6 text-copy-muted">
            <InfoIcon
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-brand"
            />
            <p>{t("businessSetup.bookingRules.release.manualHint")}</p>
          </div>
        ) : null}
      </section>

      <section className="grid gap-5 border-t border-line pt-6">
        <div className="grid gap-1.5">
          <h3 className="font-brand text-xl font-semibold text-brand">
            {t("businessSetup.bookingRules.conditions.title")}
          </h3>
          <p className="text-sm leading-6 text-copy-muted">
            {t("businessSetup.bookingRules.conditions.description")}
          </p>
        </div>

        <div className="grid gap-x-4 gap-y-6 @min-[42rem]/step:grid-cols-2">
          <SelectControl
            control={form.control}
            feedbackMode={businessSetupFeedbackMode}
            isRequired
            label={t("businessSetup.bookingRules.fields.minimumAdvance")}
            name="minimumAdvanceMinutes"
            options={[0, 60, 120, 240, 720, 1_440, 2_880].map((value) => ({
              label: t(
                `businessSetup.bookingRules.options.minimumAdvance.${value}`,
              ),
              value: String(value),
            }))}
            triggerClassName={businessSetupFieldClassNames}
          />
          <SelectControl
            control={form.control}
            feedbackMode={businessSetupFeedbackMode}
            isRequired
            label={t(
              "businessSetup.bookingRules.fields.cancellationDeadline",
            )}
            name="cancellationDeadlineHours"
            options={[0, 2, 6, 12, 24, 48, 72].map((value) => ({
              label: t(
                `businessSetup.bookingRules.options.cancellationDeadline.${value}`,
              ),
              value: String(value),
            }))}
            triggerClassName={businessSetupFieldClassNames}
          />
        </div>

        <SegmentedControlControl
          control={form.control}
          feedbackMode={businessSetupFeedbackMode}
          label={t("businessSetup.bookingRules.fields.confirmationMode")}
          name="inSalonConfirmationMode"
          options={[
            {
              label: t(
                "businessSetup.bookingRules.options.confirmationMode.AUTOMATIC",
              ),
              value: "AUTOMATIC",
            },
            {
              label: t(
                "businessSetup.bookingRules.options.confirmationMode.MANUAL",
              ),
              value: "MANUAL",
            },
          ]}
        />

        {hasMobileServices ? (
          <div className="flex gap-3 rounded-lg border border-line bg-brand-soft p-4 text-sm leading-6 text-copy-muted">
            <InfoIcon
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-brand"
            />
            <p>{t("businessSetup.bookingRules.mobileConfirmationHint")}</p>
          </div>
        ) : null}
      </section>

      {isTeamBusiness ? (
        <section className="grid gap-5 border-t border-line pt-6">
          <div className="grid gap-1.5">
            <h3 className="font-brand text-xl font-semibold text-brand">
              {t("businessSetup.bookingRules.team.title")}
            </h3>
            <p className="text-sm leading-6 text-copy-muted">
              {t("businessSetup.bookingRules.team.description")}
            </p>
          </div>
          <div className="grid gap-4 @min-[42rem]/step:grid-cols-2">
            <SwitchControl
              containerClassName="rounded-lg border border-line bg-surface p-4"
              control={form.control}
              isDisabled={
                allowSpecificTeamMember && !allowAnyTeamMember
              }
              label={t(
                "businessSetup.bookingRules.fields.allowSpecificTeamMember",
              )}
              name="allowSpecificTeamMember"
            />
            <SwitchControl
              containerClassName="rounded-lg border border-line bg-surface p-4"
              control={form.control}
              isDisabled={
                allowAnyTeamMember && !allowSpecificTeamMember
              }
              label={t(
                "businessSetup.bookingRules.fields.allowAnyTeamMember",
              )}
              name="allowAnyTeamMember"
            />
          </div>
        </section>
      ) : null}
    </form>
  );
};

export type { BusinessBookingRulesStepProperties };
