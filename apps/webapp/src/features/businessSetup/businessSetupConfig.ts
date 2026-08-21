import type { BusinessSetupStep, BusinessType } from "@beauty-booking/shared";

export const BUSINESS_SETUP_ACTIVE_FORM_ID = "business-setup-active-form";

export const businessSetupFormSteps = [
  "BUSINESS_BASICS",
  "LOCATION",
  "TEAM",
  "WORKSTATIONS",
  "SERVICES",
  "ADDONS",
] satisfies BusinessSetupStep[];

type BusinessSetupStepDefinition = {
  key: BusinessSetupStep;
  labelKey: string;
  requiredSteps?: BusinessSetupStep[];
  supportedBusinessTypes?: BusinessType[];
};

export const businessSetupStepItems = [
  {
    key: "BUSINESS_BASICS",
    labelKey: "businessSetup.steps.businessBasics",
  },
  {
    key: "LOCATION",
    labelKey: "businessSetup.steps.location",
  },
  {
    key: "TEAM",
    labelKey: "businessSetup.steps.team",
    requiredSteps: ["BUSINESS_BASICS"],
    supportedBusinessTypes: ["TEAM"],
  },
  {
    key: "WORKSTATIONS",
    labelKey: "businessSetup.steps.workstations",
    requiredSteps: ["LOCATION"],
    supportedBusinessTypes: ["TEAM"],
  },
  {
    key: "SERVICES",
    labelKey: "businessSetup.steps.services",
    requiredSteps: ["LOCATION"],
  },
  {
    key: "ADDONS",
    labelKey: "businessSetup.steps.addons",
    requiredSteps: ["SERVICES"],
  },
  {
    key: "TEAM_SERVICES",
    labelKey: "businessSetup.steps.teamServices",
    requiredSteps: ["TEAM", "SERVICES"],
    supportedBusinessTypes: ["TEAM"],
  },
  {
    key: "AVAILABILITY",
    labelKey: "businessSetup.steps.availability",
  },
  {
    key: "BOOKING_RULES",
    labelKey: "businessSetup.steps.bookingRules",
  },
  {
    key: "PUBLIC_PROFILE",
    labelKey: "businessSetup.steps.publicProfile",
  },
  {
    key: "SUMMARY",
    labelKey: "businessSetup.steps.summary",
    requiredSteps: [
      "BUSINESS_BASICS",
      "LOCATION",
      "WORKSTATIONS",
      "SERVICES",
      "ADDONS",
      "TEAM",
      "TEAM_SERVICES",
      "AVAILABILITY",
      "BOOKING_RULES",
      "PUBLIC_PROFILE",
    ],
  },
] satisfies BusinessSetupStepDefinition[];

export const getBusinessSetupStepItem = (step: BusinessSetupStep) =>
  businessSetupStepItems.find((item) => item.key === step);

export const getVisibleBusinessSetupStepItems = (
  businessType: BusinessType | null | undefined,
) => {
  const isTeamBusiness = businessType === "TEAM";
  const visibleItems = businessSetupStepItems.filter(
    (item) =>
      !item.supportedBusinessTypes ||
      (businessType &&
        item.supportedBusinessTypes.some(
          (supportedBusinessType) => supportedBusinessType === businessType,
        )),
  );

  return visibleItems.map((item) => {
    if (item.key === "SERVICES" && isTeamBusiness) {
      return {
        ...item,
        requiredSteps: ["LOCATION", "WORKSTATIONS"],
      } satisfies BusinessSetupStepDefinition;
    }

    return item;
  });
};

export type { BusinessSetupStepDefinition };
