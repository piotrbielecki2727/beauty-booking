"use client";

import { MailIcon, PhoneIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  InputControl,
  normalizePhoneNumberInput,
} from "@/components/controlled";
import { BusinessSetupFieldHeader } from "@/features/businessSetup/components/reusable/BusinessSetupFieldHeader";
import { businessSetupChoiceGroupClassNames } from "@/features/businessSetup/components/reusable/businessSetupFormStyles";

import type { Control } from "react-hook-form";
import type { BusinessDetailsForm } from "@beauty-booking/shared";

type BusinessContactFieldsProperties = {
  control: Control<BusinessDetailsForm>;
  fieldClassName?: string;
};

export const BusinessContactFields = ({
  control,
  fieldClassName,
}: BusinessContactFieldsProperties) => {
  const t = useTranslations();

  return (
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
          control={control}
          feedbackMode="reserved"
          icon={<MailIcon className="size-4" aria-hidden="true" />}
          inputClassName={fieldClassName}
          label={t("businessSetup.businessDetails.fields.contactEmail")}
          name="contactEmail"
          placeholder={t(
            "businessSetup.businessDetails.placeholders.contactEmail",
          )}
          type="email"
        />
        <InputControl
          autoComplete="tel-national"
          control={control}
          feedbackMode="reserved"
          formatValue={normalizePhoneNumberInput}
          icon={<PhoneIcon className="size-4" aria-hidden="true" />}
          inputClassName={fieldClassName}
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
  );
};

export type { BusinessContactFieldsProperties };
