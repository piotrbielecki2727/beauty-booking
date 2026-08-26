import {
  businessBasicsFormSchema,
  businessDetailsFormSchema,
  businessLocationFormSchema,
} from "@beauty-booking/shared";

import type { BusinessSetupDrafts } from "@/features/businessSetup/providers";
import type {
  BusinessBasicsForm,
  BusinessDetailsForm,
  BusinessLocationForm,
} from "@beauty-booking/shared";
import type { ZodType } from "zod";

export const salonSettingsFormIds = {
  basics: "salon-settings-basics-form",
  details: "salon-settings-details-form",
  location: "salon-settings-location-form",
} as const;

export type SalonSettingsSection = keyof typeof salonSettingsFormIds;
export type SalonSettingsFormId =
  (typeof salonSettingsFormIds)[SalonSettingsSection];

type DraftValidation<Values> =
  | { status: "clean" }
  | { status: "invalid" }
  | { data: Values; status: "valid" };

type SalonSettingsDrafts = Pick<
  BusinessSetupDrafts,
  "BUSINESS_BASICS" | "LOCATION" | "PUBLIC_PROFILE"
>;

export type SalonSettingsFormState = {
  dirtyState: Record<SalonSettingsSection, boolean>;
  validatedDrafts: {
    basics: DraftValidation<BusinessBasicsForm>;
    details: DraftValidation<BusinessDetailsForm>;
    location: DraftValidation<BusinessLocationForm>;
  };
  validationState: Record<SalonSettingsSection, boolean>;
};

const validateDraft = <Values,>(
  draft: Values | undefined,
  schema: ZodType<Values>,
): DraftValidation<Values> => {
  if (!draft) {
    return { status: "clean" };
  }

  const result = schema.safeParse(draft);

  return result.success
    ? { data: result.data, status: "valid" }
    : { status: "invalid" };
};

export const getSalonSettingsFormState = (
  drafts: SalonSettingsDrafts,
): SalonSettingsFormState => {
  const validatedDrafts = {
    basics: validateDraft(drafts.BUSINESS_BASICS, businessBasicsFormSchema),
    details: validateDraft(drafts.PUBLIC_PROFILE, businessDetailsFormSchema),
    location: validateDraft(drafts.LOCATION, businessLocationFormSchema),
  };

  return {
    dirtyState: {
      basics: validatedDrafts.basics.status !== "clean",
      details: validatedDrafts.details.status !== "clean",
      location: validatedDrafts.location.status !== "clean",
    },
    validatedDrafts,
    validationState: {
      basics: validatedDrafts.basics.status === "invalid",
      details: validatedDrafts.details.status === "invalid",
      location: validatedDrafts.location.status === "invalid",
    },
  };
};

export const getInvalidSalonSettingsFormIds = ({
  validatedDrafts,
}: SalonSettingsFormState): SalonSettingsFormId[] => {
  const formIds: SalonSettingsFormId[] = [];

  if (validatedDrafts.basics.status === "invalid") {
    formIds.push(salonSettingsFormIds.basics);
  }
  if (validatedDrafts.location.status === "invalid") {
    formIds.push(salonSettingsFormIds.location);
  }
  if (validatedDrafts.details.status === "invalid") {
    formIds.push(salonSettingsFormIds.details);
  }

  return formIds;
};
