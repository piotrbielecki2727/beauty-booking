"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CircleCheckIcon,
  CircleXIcon,
  InfoIcon,
  PencilIcon,
  PlusIcon,
  SparklesIcon,
  Trash2Icon,
  UserRoundIcon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { InputControl, SelectControl } from "@/components/controlled";
import { Button, SegmentedControl } from "@/components/reusable";
import {
  businessTeamFormSchema,
  businessTeamMemberFormItemSchema,
  teamMemberRoles,
  type BusinessTeamForm,
  type BusinessTeamMemberFormItem,
  type BusinessTeamMemberRole,
} from "@/features/businessSetup/businessSetupTeamSchema";
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

import type { BusinessSetupResponse } from "@beauty-booking/shared";

type BusinessTeamStepProperties = {
  draft?: BusinessTeamForm;
  initialSetup: BusinessSetupResponse | null;
  initialValues: BusinessTeamForm;
  onDraftChange: (values: BusinessTeamForm) => void;
  onSave: (values: BusinessTeamForm) => Promise<void>;
};

const defaultTeamMember: BusinessTeamMemberFormItem = {
  email: "",
  fullName: "",
  providesServices: true,
  role: "Employee",
};

const teamMemberNameCharactersRegex = /[^\p{L} '-]/gu;

const formatTeamMemberNameValue = (value: string) =>
  value.replace(teamMemberNameCharactersRegex, "").slice(0, 80);

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const teamMemberRowClassNames =
  "grid gap-3 rounded-lg border border-line bg-background p-4 @min-[52rem]/step:grid-cols-[minmax(0,1fr)_10rem_16rem_11rem] @min-[52rem]/step:items-center";

const roleBadgeClassNames =
  "inline-flex h-8 w-fit items-center justify-center rounded-md border px-3 text-xs font-medium @min-[52rem]/step:justify-self-center";

const getRoleBadgeClassNames = (role: BusinessTeamMemberRole | "Owner") =>
  cn(
    roleBadgeClassNames,
    role === "Owner" && "border-brand bg-brand-soft text-brand",
    role === "Manager" &&
      "border-[var(--status-warning-border,var(--border))] bg-[var(--status-warning-surface,var(--background))] text-warning",
    role === "Employee" &&
      "border-[var(--status-success-border,var(--border))] bg-[var(--status-success-surface,var(--background))] text-success",
    role === "Intern" && "border-line-strong bg-surface text-copy-muted",
  );

const getProvidesServicesBadgeClassNames = (providesServices: boolean) =>
  cn(
    "inline-flex h-8 w-fit items-center gap-2 rounded-md border px-3 text-xs font-medium @min-[52rem]/step:justify-self-center",
    providesServices
      ? "border-[var(--status-success-border,var(--border))] bg-[var(--status-success-surface,var(--background))] text-success"
      : "border-[var(--destructive-border,var(--border))] bg-[var(--destructive-surface,var(--background))] text-destructive",
  );

export const BusinessTeamStep = ({
  draft,
  initialSetup,
  initialValues,
  onDraftChange,
  onSave,
}: BusinessTeamStepProperties) => {
  const t = useTranslations();
  const { data: session } = useSession();
  const persistedValues = useMemo(() => initialValues, [initialValues]);
  const [initialDraft] = useState(() => draft);
  const [isMemberFormVisible, setIsMemberFormVisible] = useState(false);
  const form = useForm<BusinessTeamForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessTeamFormSchema),
    values: initialDraft ?? persistedValues,
  });
  const memberForm = useForm<BusinessTeamMemberFormItem>({
    defaultValues: defaultTeamMember,
    mode: "onTouched",
    resolver: zodResolver(businessTeamMemberFormItemSchema),
  });
  const { append, fields, remove } = useFieldArray({
    control: form.control,
    keyName: "formId",
    name: "teamMembers",
  });
  const teamMembers = useWatch({
    control: form.control,
    name: "teamMembers",
  });
  const memberProvidesServices = useWatch({
    control: memberForm.control,
    name: "providesServices",
  });
  const ownerName =
    session?.user.firstName && session.user.lastName
      ? `${session.user.firstName} ${session.user.lastName}`
      : t("businessSetup.team.ownerFallback");
  const ownerEmail = session?.user.email ?? t("businessSetup.team.noEmail");
  const ownerProvidesServices =
    initialSetup?.basics.ownerProvidesServices ?? false;
  const roleOptions = teamMemberRoles.map((role) => ({
    label: t(`businessSetup.team.roles.${role}`),
    value: role,
  }));
  const providesServicesOptions = [
    {
      label: t("businessSetup.team.providesServices.true"),
      value: "true",
    },
    {
      label: t("businessSetup.team.providesServices.false"),
      value: "false",
    },
  ];

  useBusinessSetupFormDraft({ form, onDraftChange, step: "TEAM" });

  const handleAddMember = memberForm.handleSubmit((values) => {
    append({
      ...values,
      id: crypto.randomUUID(),
    });
    memberForm.reset(defaultTeamMember);
    setIsMemberFormVisible(false);
  });

  const handleEditMember = (member: BusinessTeamMemberFormItem, index: number) => {
    memberForm.reset(member);
    remove(index);
    setIsMemberFormVisible(true);
  };

  const handleShowMemberForm = () => {
    memberForm.reset(defaultTeamMember);
    setIsMemberFormVisible(true);
  };

  const handleCancelMemberForm = () => {
    memberForm.reset(defaultTeamMember);
    setIsMemberFormVisible(false);
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
        <p>{t("businessSetup.team.info")}</p>
      </div>

      <section className={businessSetupCardClassNames}>
        <div className="flex flex-col gap-3 @min-[42rem]/step:flex-row @min-[42rem]/step:items-center @min-[42rem]/step:justify-between">
          <h3 className="font-brand text-xl font-semibold text-brand">
            {t("businessSetup.team.currentTitle")}
          </h3>
          <Button
            className="w-full @min-[42rem]/step:w-auto"
            isDisabled={isMemberFormVisible}
            type="button"
            onClick={handleShowMemberForm}
          >
            <PlusIcon className="size-4" aria-hidden="true" />
            {t("businessSetup.team.add")}
          </Button>
        </div>

        <div className="grid gap-3">
          <article className={teamMemberRowClassNames}>
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-medium text-brand">
                {getInitials(ownerName) || (
                  <UserRoundIcon className="size-5" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-copy">{ownerName}</p>
                <p className="truncate text-sm text-copy-muted">{ownerEmail}</p>
              </div>
            </div>

            <span className={getRoleBadgeClassNames("Owner")}>
              {t("businessSetup.team.roles.Owner")}
            </span>

            <span className={getProvidesServicesBadgeClassNames(ownerProvidesServices)}>
              {ownerProvidesServices ? (
                <CircleCheckIcon className="size-4" aria-hidden="true" />
              ) : (
                <CircleXIcon className="size-4" aria-hidden="true" />
              )}
              {t("businessSetup.team.providesServicesBadge", {
                value: t(
                  ownerProvidesServices
                    ? "businessSetup.team.providesServices.true"
                    : "businessSetup.team.providesServices.false",
                ),
              })}
            </span>

            <span className="hidden @min-[52rem]/step:block" aria-hidden="true" />
          </article>

          {fields.map((field, index) => {
            const member = teamMembers?.[index] ?? field;

            return (
              <article
                key={field.formId}
                className={teamMemberRowClassNames}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-medium text-brand">
                    {getInitials(member.fullName) || (
                      <UserRoundIcon className="size-5" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-copy">
                      {member.fullName}
                    </p>
                    <p className="truncate text-sm text-copy-muted">
                      {member.email || t("businessSetup.team.noEmail")}
                    </p>
                  </div>
                </div>

                <span className={getRoleBadgeClassNames(member.role)}>
                  {t(`businessSetup.team.roles.${member.role}`)}
                </span>

                <span className={getProvidesServicesBadgeClassNames(member.providesServices)}>
                  {member.providesServices ? (
                    <CircleCheckIcon className="size-4" aria-hidden="true" />
                  ) : (
                    <CircleXIcon className="size-4" aria-hidden="true" />
                  )}
                  {t("businessSetup.team.providesServicesBadge", {
                    value: t(
                      member.providesServices
                        ? "businessSetup.team.providesServices.true"
                        : "businessSetup.team.providesServices.false",
                    ),
                  })}
                </span>

                <div className="grid grid-cols-2 gap-2 @min-[52rem]/step:flex @min-[52rem]/step:justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start text-copy-muted hover:bg-surface-soft hover:text-brand @min-[52rem]/step:justify-center"
                    onClick={() => handleEditMember(member, index)}
                  >
                    <PencilIcon className="size-4" aria-hidden="true" />
                    {t("businessSetup.team.edit")}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="justify-start text-copy-muted hover:bg-surface-soft hover:text-brand @min-[52rem]/step:justify-center"
                    onClick={() => remove(index)}
                  >
                    <Trash2Icon className="size-4" aria-hidden="true" />
                    {t("businessSetup.team.remove")}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {isMemberFormVisible ? (
          <section className="grid gap-6 rounded-lg border border-line bg-background p-4">
            <h4 className="font-brand text-lg font-semibold text-brand">
              {t("businessSetup.team.addTitle")}
            </h4>
            <div
              className={cn(
                businessSetupFieldRowClassNames,
                "[grid-template-columns:repeat(auto-fit,minmax(min(12rem,100%),1fr))]",
                "@min-[64rem]/step:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1fr)]",
              )}
            >
              <InputControl
                control={memberForm.control}
                feedbackMode={businessSetupFeedbackMode}
                formatValue={formatTeamMemberNameValue}
                inputClassName={businessSetupFieldClassNames}
                label={t("businessSetup.team.fields.fullName")}
                maxLength={80}
                name="fullName"
                placeholder={t("businessSetup.team.placeholders.fullName")}
              />

              <InputControl
                control={memberForm.control}
                feedbackMode={businessSetupFeedbackMode}
                inputClassName={businessSetupFieldClassNames}
                inputMode="email"
                label={t("businessSetup.team.fields.email")}
                name="email"
                placeholder={t("businessSetup.team.placeholders.email")}
              />

              <SelectControl
                control={memberForm.control}
                feedbackMode={businessSetupFeedbackMode}
                isContentAlignedWithTrigger={false}
                label={t("businessSetup.team.fields.role")}
                name="role"
                options={roleOptions}
                triggerClassName={businessSetupFieldClassNames}
              />

              <SegmentedControl
                feedbackMode={businessSetupFeedbackMode}
                label={t("businessSetup.team.fields.providesServices")}
                onValueChange={(value) =>
                  memberForm.setValue("providesServices", value === "true", {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  })
                }
                options={providesServicesOptions}
                value={memberProvidesServices ? "true" : "false"}
              />
            </div>

            <div className="flex justify-end">
              <div className="grid grid-cols-2 gap-3 @min-[42rem]/step:flex @min-[42rem]/step:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelMemberForm}
                >
                  <XIcon className="size-4" aria-hidden="true" />
                  {t("businessSetup.team.cancelAdd")}
                </Button>
                <Button type="button" onClick={handleAddMember}>
                  <PlusIcon className="size-4" aria-hidden="true" />
                  {t("businessSetup.team.add")}
                </Button>
              </div>
            </div>
          </section>
        ) : null}
      </section>

      <section className="flex items-start gap-4 rounded-lg border border-line bg-surface/70 p-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line bg-background text-brand">
          <SparklesIcon className="size-5" aria-hidden="true" />
        </span>
        <div className="grid gap-2">
          <h3 className="font-brand text-lg font-semibold text-brand">
            {t("businessSetup.team.nextTitle")}
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-5 text-copy-muted">
            <li>{t("businessSetup.team.nextItems.workstations")}</li>
            <li>{t("businessSetup.team.nextItems.services")}</li>
            <li>{t("businessSetup.team.nextItems.availability")}</li>
          </ul>
        </div>
      </section>
    </form>
  );
};

export type { BusinessTeamStepProperties };
