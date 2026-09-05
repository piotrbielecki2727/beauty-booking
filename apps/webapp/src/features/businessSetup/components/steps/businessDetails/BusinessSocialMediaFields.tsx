"use client";

import { useTranslations } from "next-intl";

import { InputControl } from "@/components/controlled";
import { businessSetupSocialMediaFields } from "@/features/businessSetup/businessSetupSocialMediaConfig";
import { BusinessSetupFieldHeader } from "@/features/businessSetup/components/reusable/BusinessSetupFieldHeader";
import { businessSetupChoiceGroupClassNames } from "@/features/businessSetup/components/reusable/businessSetupFormStyles";

import type { Control } from "react-hook-form";
import type { BusinessDetailsForm } from "@beauty-booking/shared";

type BusinessSocialMediaFieldsProperties = {
  control: Control<BusinessDetailsForm>;
  fieldClassName?: string;
  isExtendedSocialMediaVisible: boolean;
};

export const BusinessSocialMediaFields = ({
  control,
  fieldClassName,
  isExtendedSocialMediaVisible,
}: BusinessSocialMediaFieldsProperties) => {
  const t = useTranslations();

  return (
    <section className={businessSetupChoiceGroupClassNames}>
      <BusinessSetupFieldHeader
        description={t(
          "businessSetup.businessDetails.sections.socialMedia.description",
        )}
        label={t("businessSetup.businessDetails.sections.socialMedia.title")}
      />
      <div className="grid gap-3 @min-[36rem]/step:grid-cols-2 @min-[64rem]/step:grid-cols-3">
        {businessSetupSocialMediaFields
          .filter(
            ({ key }) =>
              isExtendedSocialMediaVisible ||
              (key !== "pinterest" && key !== "youtube"),
          )
          .map(({ icon: Icon, key, name }) => (
            <InputControl
              key={name}
              aria-label={t(
                `businessSetup.businessDetails.socialMedia.${key}.label`,
              )}
              autoCapitalize="none"
              autoComplete="url"
              control={control}
              feedbackMode="reserved"
              icon={<Icon className="size-4" aria-hidden="true" />}
              inputClassName={fieldClassName}
              inputMode="url"
              name={name}
              placeholder={t(
                `businessSetup.businessDetails.socialMedia.${key}.placeholder`,
              )}
              type="text"
            />
          ))}
      </div>
    </section>
  );
};

export type { BusinessSocialMediaFieldsProperties };
