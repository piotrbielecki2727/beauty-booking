import type { BusinessSetupStep } from "@beauty-booking/shared";

export const BUSINESS_SETUP_ACTIVE_FORM_ID = "business-setup-active-form";

export const businessSetupFormSteps = [
  "BUSINESS_BASICS",
] satisfies BusinessSetupStep[];

type BusinessSetupStepDefinition = {
  key: BusinessSetupStep;
  labelKey: string;
  requiredSteps?: BusinessSetupStep[];
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
    key: "WORKSTATIONS",
    labelKey: "businessSetup.steps.workstations",
  },
  {
    key: "SERVICES",
    labelKey: "businessSetup.steps.services",
  },
  {
    key: "ADDONS",
    labelKey: "businessSetup.steps.addons",
    requiredSteps: ["SERVICES"],
  },
  {
    key: "TEAM",
    labelKey: "businessSetup.steps.team",
    requiredSteps: ["BUSINESS_BASICS"],
  },
  {
    key: "TEAM_SERVICES",
    labelKey: "businessSetup.steps.teamServices",
    requiredSteps: ["TEAM", "SERVICES"],
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

export type { BusinessSetupStepDefinition };
