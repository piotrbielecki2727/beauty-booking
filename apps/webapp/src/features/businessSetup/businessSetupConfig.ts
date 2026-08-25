import {
  businessSetupCompletionRequiredSteps,
  type BusinessSetupStep,
} from "@beauty-booking/shared";

export const BUSINESS_SETUP_ACTIVE_FORM_ID = "business-setup-active-form";

export const businessSetupFormSteps = [
  ...businessSetupCompletionRequiredSteps,
] satisfies BusinessSetupStep[];

type BusinessSetupStepDefinition = {
  descriptionKey: string;
  key: BusinessSetupStep;
  labelKey: string;
  requiredSteps?: BusinessSetupStep[];
};

export const businessSetupStepItems = [
  {
    descriptionKey: "businessSetup.stepDescriptions.businessBasics",
    key: "BUSINESS_BASICS",
    labelKey: "businessSetup.steps.businessBasics",
  },
  {
    descriptionKey: "businessSetup.stepDescriptions.location",
    key: "LOCATION",
    labelKey: "businessSetup.steps.location",
    requiredSteps: ["BUSINESS_BASICS"],
  },
  {
    descriptionKey: "businessSetup.stepDescriptions.publicProfile",
    key: "PUBLIC_PROFILE",
    labelKey: "businessSetup.steps.publicProfile",
    requiredSteps: ["LOCATION"],
  },
  {
    descriptionKey: "businessSetup.stepDescriptions.summary",
    key: "SUMMARY",
    labelKey: "businessSetup.steps.summary",
    requiredSteps: [...businessSetupCompletionRequiredSteps],
  },
] satisfies BusinessSetupStepDefinition[];

export const getBusinessSetupStepItem = (step: BusinessSetupStep) =>
  businessSetupStepItems.find((item) => item.key === step);

export const getVisibleBusinessSetupStepItems = () => businessSetupStepItems;

export type { BusinessSetupStepDefinition };
