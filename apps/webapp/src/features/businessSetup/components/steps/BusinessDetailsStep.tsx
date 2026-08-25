"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon, PhoneIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";

import {
  businessDetailsFormSchema,
  type BusinessDetailsForm,
  type BusinessSetupResponse,
} from "@beauty-booking/shared";

import {
  InputControl,
  normalizePhoneNumberInput,
} from "@/components/controlled";
import { ImageUpload } from "@/components/reusable";
import { BUSINESS_SETUP_ACTIVE_FORM_ID } from "@/features/businessSetup/businessSetupConfig";
import { BusinessSetupFieldHeader } from "@/features/businessSetup/components/reusable/BusinessSetupFieldHeader";
import {
  businessSetupChoiceGroupClassNames,
  businessSetupFormClassNames,
  businessSetupSectionsClassNames,
} from "@/features/businessSetup/components/reusable/businessSetupFormStyles";
import { useBusinessSetupFormDraft } from "@/features/businessSetup/hooks";
import { appToast } from "@/features/notifications";

type BusinessDetailsStepProperties = {
  draft?: BusinessDetailsForm;
  initialSetup: BusinessSetupResponse | null;
  onDraftChange: (values: BusinessDetailsForm) => void;
  onSave: (values: BusinessDetailsForm) => Promise<void>;
};

const socialMediaFields = [
  { icon: FaInstagram, key: "instagram", name: "instagramUrl" },
  { icon: FaFacebook, key: "facebook", name: "facebookUrl" },
  { icon: FaTiktok, key: "tiktok", name: "tiktokUrl" },
  { icon: FaPinterest, key: "pinterest", name: "pinterestUrl" },
  { icon: FaYoutube, key: "youtube", name: "youtubeUrl" },
] as const;

const getDefaultValues = (
  setup: BusinessSetupResponse | null,
): BusinessDetailsForm => ({
  contactEmail: setup?.publicProfile.contactEmail ?? "",
  contactPhone: setup?.publicProfile.contactPhone ?? "",
  facebookUrl: setup?.publicProfile.facebookUrl ?? "",
  instagramUrl: setup?.publicProfile.instagramUrl ?? "",
  pinterestUrl: setup?.publicProfile.pinterestUrl ?? "",
  tiktokUrl: setup?.publicProfile.tiktokUrl ?? "",
  youtubeUrl: setup?.publicProfile.youtubeUrl ?? "",
});

export const BusinessDetailsStep = ({
  draft,
  initialSetup,
  onDraftChange,
  onSave,
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
    resetOptions: { keepDefaultValues: true },
    resolver: zodResolver(businessDetailsFormSchema),
    values: initialDraft ?? persistedValues,
  });
  useBusinessSetupFormDraft({
    form,
    onDraftChange,
    step: "PUBLIC_PROFILE",
  });

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
        <section className={businessSetupChoiceGroupClassNames}>
          <BusinessSetupFieldHeader
            description={t(
              "businessSetup.businessDetails.sections.contact.description",
            )}
            label={t("businessSetup.businessDetails.sections.contact.title")}
          />
          <div className="grid gap-5 @min-[42rem]/step:grid-cols-2">
            <InputControl
              autoComplete="email"
              control={form.control}
              feedbackMode="reserved"
              icon={<MailIcon className="size-4" aria-hidden="true" />}
              label={t("businessSetup.businessDetails.fields.contactEmail")}
              name="contactEmail"
              placeholder={t(
                "businessSetup.businessDetails.placeholders.contactEmail",
              )}
              type="email"
            />
            <InputControl
              autoComplete="tel-national"
              control={form.control}
              feedbackMode="reserved"
              formatValue={normalizePhoneNumberInput}
              icon={<PhoneIcon className="size-4" aria-hidden="true" />}
              inputMode="numeric"
              label={t("businessSetup.businessDetails.fields.contactPhone")}
              maxLength={9}
              name="contactPhone"
              placeholder={t(
                "businessSetup.businessDetails.placeholders.contactPhone",
              )}
              type="tel"
            />
          </div>
        </section>

        <section className={businessSetupChoiceGroupClassNames}>
          <BusinessSetupFieldHeader
            description={t(
              "businessSetup.businessDetails.sections.logo.description",
            )}
            label={t("businessSetup.businessDetails.sections.logo.title")}
          />
          <ImageUpload
            dropLabel={t(
              "businessSetup.businessDetails.logo.dropLabel",
            )}
            helperText={t("businessSetup.businessDetails.logo.helperText", {
              maxFileSizeMb: 2,
              maxHeight: 4096,
              maxWidth: 4096,
              minHeight: 256,
              minWidth: 256,
            })}
            maxFileSizeMb={2}
            maxHeight={4096}
            maxWidth={4096}
            minHeight={256}
            minWidth={256}
            onChange={setLogoFile}
            previewAlt={t("businessSetup.businessDetails.logo.previewAlt")}
            previewLabel={t(
              "businessSetup.businessDetails.logo.previewLabel",
            )}
            removeLabel={t("businessSetup.businessDetails.logo.removeLabel")}
            validationMessages={{
              dimensionsTooLarge: t(
                "businessSetup.businessDetails.logo.validation.dimensionsTooLarge",
                { height: 4096, width: 4096 },
              ),
              dimensionsTooSmall: t(
                "businessSetup.businessDetails.logo.validation.dimensionsTooSmall",
                { height: 256, width: 256 },
              ),
              fileTooLarge: t(
                "businessSetup.businessDetails.logo.validation.fileTooLarge",
                { maxFileSizeMb: 2 },
              ),
              imageUnreadable: t(
                "businessSetup.businessDetails.logo.validation.imageUnreadable",
              ),
              unsupportedType: t(
                "businessSetup.businessDetails.logo.validation.unsupportedType",
              ),
            }}
            value={logoFile}
          />
        </section>

        <section className={businessSetupChoiceGroupClassNames}>
          <BusinessSetupFieldHeader
            description={t(
              "businessSetup.businessDetails.sections.socialMedia.description",
            )}
            label={t(
              "businessSetup.businessDetails.sections.socialMedia.title",
            )}
          />
          <div className="grid gap-3 @min-[36rem]/step:grid-cols-2 @min-[64rem]/step:grid-cols-3">
            {socialMediaFields.map(({ icon: Icon, key, name }) => (
              <InputControl
                key={name}
                aria-label={t(
                  `businessSetup.businessDetails.socialMedia.${key}.label`,
                )}
                autoCapitalize="none"
                autoComplete="url"
                control={form.control}
                feedbackMode="reserved"
                icon={<Icon className="size-4" aria-hidden="true" />}
                name={name}
                placeholder={t(
                  `businessSetup.businessDetails.socialMedia.${key}.placeholder`,
                )}
                inputMode="url"
                type="text"
              />
            ))}
          </div>
        </section>
      </div>
    </form>
  );
};

export type { BusinessDetailsStepProperties };
