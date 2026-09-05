"use client";

import { useTranslations } from "next-intl";

import { ImageUpload } from "@/components/reusable";
import { BusinessSetupFieldHeader } from "@/features/businessSetup/components/reusable/BusinessSetupFieldHeader";
import { businessSetupChoiceGroupClassNames } from "@/features/businessSetup/components/reusable/businessSetupFormStyles";

type BusinessLogoFieldProperties = {
  onChange: (file: File | null) => void;
  value: File | null;
};

const logoRequirements = {
  maxFileSizeMb: 2,
  maxHeight: 4096,
  maxWidth: 4096,
  minHeight: 256,
  minWidth: 256,
} as const;

export const BusinessLogoField = ({
  onChange,
  value,
}: BusinessLogoFieldProperties) => {
  const t = useTranslations();

  return (
    <section className={businessSetupChoiceGroupClassNames}>
      <BusinessSetupFieldHeader
        description={t(
          "businessSetup.businessDetails.sections.logo.description",
        )}
        label={t("businessSetup.businessDetails.sections.logo.title")}
      />
      <ImageUpload
        {...logoRequirements}
        dropLabel={t("businessSetup.businessDetails.logo.dropLabel")}
        helperText={t(
          "businessSetup.businessDetails.logo.helperText",
          logoRequirements,
        )}
        onChange={onChange}
        previewAlt={t("businessSetup.businessDetails.logo.previewAlt")}
        previewLabel={t("businessSetup.businessDetails.logo.previewLabel")}
        removeLabel={t("businessSetup.businessDetails.logo.removeLabel")}
        validationMessages={{
          dimensionsTooLarge: t(
            "businessSetup.businessDetails.logo.validation.dimensionsTooLarge",
            {
              height: logoRequirements.maxHeight,
              width: logoRequirements.maxWidth,
            },
          ),
          dimensionsTooSmall: t(
            "businessSetup.businessDetails.logo.validation.dimensionsTooSmall",
            {
              height: logoRequirements.minHeight,
              width: logoRequirements.minWidth,
            },
          ),
          fileTooLarge: t(
            "businessSetup.businessDetails.logo.validation.fileTooLarge",
            { maxFileSizeMb: logoRequirements.maxFileSizeMb },
          ),
          imageUnreadable: t(
            "businessSetup.businessDetails.logo.validation.imageUnreadable",
          ),
          unsupportedType: t(
            "businessSetup.businessDetails.logo.validation.unsupportedType",
          ),
        }}
        value={value}
      />
    </section>
  );
};

export type { BusinessLogoFieldProperties };
