"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  businessDetailsFormSchema,
  type BusinessDetailsForm,
  type BusinessSetupResponse,
} from "@beauty-booking/shared";

import { TextareaControl } from "@/components/controlled";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import { BusinessSetupFieldHeader } from "@/features/businessSetup/components/reusable/BusinessSetupFieldHeader";
import {
  businessSetupChoiceGroupClassNames,
  businessSetupFormClassNames,
  businessSetupSectionsClassNames,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { BusinessContactFields } from "@/features/businessSetup/components/steps/businessDetails/BusinessContactFields";
import { BusinessLogoField } from "@/features/businessSetup/components/steps/businessDetails/BusinessLogoField";
import { BusinessSocialMediaFields } from "@/features/businessSetup/components/steps/businessDetails/BusinessSocialMediaFields";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";
import { cn } from "@/lib/utils";

type BusinessDetailsStepProperties = {
  draft?: BusinessDetailsForm;
  fieldClassName?: string;
  formId?: string;
  initialSetup: BusinessSetupResponse | null;
  isDescriptionVisible?: boolean;
  isDisabled?: boolean;
  isExtendedSocialMediaVisible?: boolean;
  isLogoVisible?: boolean;
  onDraftChange: (values: BusinessDetailsForm) => void;
  onSave: (values: BusinessDetailsForm) => Promise<void>;
  shouldSyncInitialValues?: boolean;
};

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessDetailsForm => ({
  contactEmail: setup?.publicProfile.contactEmail ?? "",
  contactPhone: setup?.publicProfile.contactPhone ?? "",
  description: setup?.publicProfile.description ?? "",
  facebookUrl: setup?.publicProfile.facebookUrl ?? "",
  instagramUrl: setup?.publicProfile.instagramUrl ?? "",
  pinterestUrl: setup?.publicProfile.pinterestUrl ?? "",
  tiktokUrl: setup?.publicProfile.tiktokUrl ?? "",
  youtubeUrl: setup?.publicProfile.youtubeUrl ?? "",
});

export const BusinessDetailsStep = ({
  draft,
  fieldClassName,
  formId = BUSINESS_SETUP_ACTIVE_FORM_ID,
  initialSetup,
  isDescriptionVisible = false,
  isDisabled = false,
  isExtendedSocialMediaVisible = true,
  isLogoVisible = true,
  onDraftChange,
  onSave,
  shouldSyncInitialValues = true,
}: BusinessDetailsStepProperties) => {
  const t = useTranslations();
  const persistedValues = useMemo(
    () => getDefaultValues(initialSetup),
    [initialSetup],
  );
  const [initialDraft] = useState(() => draft);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const form = useForm<BusinessDetailsForm>({
    defaultValues: persistedValues,
    mode: "onTouched",
    resetOptions: shouldSyncInitialValues
      ? { keepDefaultValues: true }
      : undefined,
    resolver: zodResolver(businessDetailsFormSchema),
    values: shouldSyncInitialValues
      ? initialDraft ?? persistedValues
      : undefined,
  });
  useBusinessSetupFormDraft({
    form,
    onDraftChange,
    step: "PUBLIC_PROFILE",
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
      form.reset(values);
    } catch {
      appToast.error({
        title: t("businessSetup.feedback.saveFailed"),
      });
    }
  });

  return (
    <form
      className={businessSetupFormClassNames}
      id={formId}
      onSubmit={handleSubmit}
    >
      <fieldset className="contents" disabled={isDisabled}>
        <div className={businessSetupSectionsClassNames}>
          <BusinessContactFields
            control={form.control}
            fieldClassName={fieldClassName}
          />

          {isDescriptionVisible ? (
            <section className={businessSetupChoiceGroupClassNames}>
              <BusinessSetupFieldHeader
                description={t(
                  "businessSetup.businessDetails.sections.description.description",
                )}
                label={t(
                  "businessSetup.businessDetails.sections.description.title",
                )}
              />
              <TextareaControl
                control={form.control}
                feedbackMode="reserved"
                maxLength={500}
                name="description"
                placeholder={t(
                  "businessSetup.businessDetails.placeholders.description",
                )}
                textareaClassName={cn("min-h-32 resize-y", fieldClassName)}
              />
            </section>
          ) : null}

          {isLogoVisible ? (
            <BusinessLogoField onChange={setLogoFile} value={logoFile} />
          ) : null}

          <BusinessSocialMediaFields
            control={form.control}
            fieldClassName={fieldClassName}
            isExtendedSocialMediaVisible={isExtendedSocialMediaVisible}
          />
        </div>
      </fieldset>
    </form>
  );
};

export type { BusinessDetailsStepProperties };
