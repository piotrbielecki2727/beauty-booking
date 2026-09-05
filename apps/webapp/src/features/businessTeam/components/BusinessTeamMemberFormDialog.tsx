"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SaveIcon, XIcon } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { businessTeamMemberRoles } from "@beauty-booking/shared";

import {
  BirthdayControlControl,
  InputControl,
  PhoneNumberInputControl,
  SelectControl,
  SwitchControl,
} from "@/components/controlled";
import { Button } from "@/components/reusable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatTeamMemberNamePartValue,
  getBusinessTeamMemberFormDefaultValues,
  getBusinessTeamMemberFormSchema,
  getBusinessTeamMemberFormSubmitPayload,
} from "@/features/businessTeam/lib/businessTeamMemberForm";

import type { BusinessTeamMember } from "@beauty-booking/shared";
import type { BusinessTeamMemberFormSubmitPayload } from "@/features/businessTeam/lib/businessTeamMemberForm";
import type {
  BusinessTeamMemberFormInitialFocusField,
  BusinessTeamMemberFormMode,
  BusinessTeamOwnerDetails,
} from "@/features/businessTeam/lib/businessTeamMembersTypes";

type BusinessTeamMemberFormDialogProperties = {
  formKey: string;
  initialFocusField?: BusinessTeamMemberFormInitialFocusField | null;
  isOpen: boolean;
  isSubmitting: boolean;
  member?: BusinessTeamMember | null;
  mode: BusinessTeamMemberFormMode;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (payload: BusinessTeamMemberFormSubmitPayload) => void;
  ownerDetails: BusinessTeamOwnerDetails;
};

type BusinessTeamMemberFormContentProperties = Omit<
  BusinessTeamMemberFormDialogProperties,
  "formKey" | "isOpen" | "onOpenChange"
> & {
  onClose: () => void;
};

const BusinessTeamMemberFormContent = ({
  initialFocusField,
  isSubmitting,
  member,
  mode,
  onClose,
  onSubmit,
  ownerDetails,
}: BusinessTeamMemberFormContentProperties) => {
  const t = useTranslations();
  const resolver = useMemo(
    () => zodResolver(getBusinessTeamMemberFormSchema(mode)),
    [mode],
  );
  const formDefaultValues = useMemo(
    () =>
      getBusinessTeamMemberFormDefaultValues({
        member,
        mode,
        ownerDetails,
      }),
    [member, mode, ownerDetails],
  );
  const form = useForm({
    defaultValues: formDefaultValues,
    resolver,
  });
  const { handleSubmit, setFocus } = form;
  const isOwnerMode = mode === "editOwner";
  const isMemberEditMode = mode === "editMember";
  const shouldShowEmployeeIdentityFields = mode === "create";
  const shouldShowEmployeeEmailField =
    mode === "create" || (isMemberEditMode && !member?.email);
  const roleOptions = useMemo(
    () =>
      businessTeamMemberRoles.map((role) => ({
        label: t(`businessSetup.team.roles.${role}`),
        value: role,
      })),
    [t],
  );
  const titleKey =
    mode === "create"
      ? "managementEmployees.form.addTitle"
      : isOwnerMode
        ? "managementEmployees.form.editOwnerTitle"
        : "managementEmployees.form.editTitle";
  const descriptionKey =
    mode === "create"
      ? "managementEmployees.form.description"
      : isOwnerMode
        ? "managementEmployees.form.ownerDescription"
        : "managementEmployees.form.editDescription";
  const handleFormSubmit = handleSubmit((values) => {
    const payload = getBusinessTeamMemberFormSubmitPayload({
      member,
      mode,
      values,
    });

    if (!payload) {
      return;
    }

    onSubmit(payload);
  });

  useEffect(() => {
    if (initialFocusField) {
      queueMicrotask(() => setFocus(initialFocusField));
    }
  }, [initialFocusField, setFocus]);

  return (
    <>
      <Button
        aria-label={t("common.close")}
        className="absolute right-4 top-4"
        size="icon-sm"
        type="button"
        variant="ghost"
        isDisabled={isSubmitting}
        onPointerDown={(event) => event.preventDefault()}
        onClick={onClose}
      >
        <XIcon className="size-4" aria-hidden="true" />
      </Button>
      <form className="grid gap-5" onSubmit={handleFormSubmit}>
        <DialogHeader>
          <DialogTitle>{t(titleKey)}</DialogTitle>
          <DialogDescription>{t(descriptionKey)}</DialogDescription>
        </DialogHeader>

        <fieldset
          className="grid gap-4 sm:grid-cols-2"
          disabled={isSubmitting}
        >
          {shouldShowEmployeeIdentityFields ? (
            <>
              <InputControl
                control={form.control}
                feedbackMode="reserved"
                formatValue={formatTeamMemberNamePartValue}
                isRequired
                label={t("managementEmployees.form.fields.firstName")}
                maxLength={40}
                name="firstName"
                placeholder={t(
                  "managementEmployees.form.placeholders.firstName",
                )}
              />
              <InputControl
                control={form.control}
                feedbackMode="reserved"
                formatValue={formatTeamMemberNamePartValue}
                isRequired
                label={t("managementEmployees.form.fields.lastName")}
                maxLength={40}
                name="lastName"
                placeholder={t(
                  "managementEmployees.form.placeholders.lastName",
                )}
              />
            </>
          ) : null}

          {shouldShowEmployeeEmailField ? (
            <InputControl
              className="sm:col-span-2"
              control={form.control}
              feedbackMode="reserved"
              inputMode="email"
              label={t("managementEmployees.form.fields.email")}
              name="email"
              placeholder={t("managementEmployees.form.placeholders.email")}
            />
          ) : null}

          <PhoneNumberInputControl
            control={form.control}
            feedbackMode="reserved"
            label={t("managementEmployees.form.fields.phoneNumber")}
            name="phoneNumber"
            placeholder={t("managementEmployees.form.placeholders.phoneNumber")}
          />
          <BirthdayControlControl
            control={form.control}
            dayName="birthdayDay"
            feedbackMode="reserved"
            isDisabled={isSubmitting}
            label={t("managementEmployees.form.fields.birthday")}
            monthName="birthdayMonth"
          />

          {!isOwnerMode ? (
            <SelectControl
              control={form.control}
              feedbackMode="reserved"
              isContentAlignedWithTrigger={false}
              isRequired
              label={t("managementEmployees.form.fields.role")}
              name="role"
              options={roleOptions}
            />
          ) : null}

          <SwitchControl
            control={form.control}
            label={t("managementEmployees.form.fields.providesServices")}
            name="providesServices"
          />
        </fieldset>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            isDisabled={isSubmitting}
            onPointerDown={(event) => event.preventDefault()}
            onClick={onClose}
          >
            {t("managementEmployees.form.cancel")}
          </Button>
          <Button
            type="submit"
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText={t("managementEmployees.form.saving")}
          >
            <SaveIcon className="size-4" aria-hidden="true" />
            {t("managementEmployees.form.save")}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};

export const BusinessTeamMemberFormDialog = ({
  formKey,
  initialFocusField,
  isOpen,
  isSubmitting,
  member,
  mode,
  onOpenChange,
  onSubmit,
  ownerDetails,
}: BusinessTeamMemberFormDialogProperties) => {
  const handleDialogOpenChange = (nextIsOpen: boolean) => {
    if (!nextIsOpen && isSubmitting) {
      return;
    }

    onOpenChange(nextIsOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
      <DialogContent className="sm:max-w-xl" showCloseButton={false}>
        <BusinessTeamMemberFormContent
          key={formKey}
          initialFocusField={initialFocusField}
          isSubmitting={isSubmitting}
          member={member}
          mode={mode}
          ownerDetails={ownerDetails}
          onClose={() => handleDialogOpenChange(false)}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};

export type {
  BusinessTeamMemberFormDialogProperties,
  BusinessTeamMemberFormSubmitPayload,
};
