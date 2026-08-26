import type { BusinessAddonsForm } from "@/features/businessSetup/businessSetupAddonsSchema";
import type {
  BusinessBasicsForm,
  BusinessBookingRulesForm,
  BusinessDetailsForm,
  BusinessLocationForm,
  BusinessOpeningHoursForm,
  BusinessServicesForm,
  BusinessTeamForm,
} from "@beauty-booking/shared";

type BusinessSetupDrafts = {
  ADDONS?: BusinessAddonsForm;
  AVAILABILITY?: BusinessOpeningHoursForm;
  BOOKING_RULES?: BusinessBookingRulesForm;
  BUSINESS_BASICS?: BusinessBasicsForm;
  LOCATION?: BusinessLocationForm;
  PUBLIC_PROFILE?: BusinessDetailsForm;
  SERVICES?: BusinessServicesForm;
  TEAM?: BusinessTeamForm;
};

type BusinessSetupDraftStep = keyof BusinessSetupDrafts;

type BusinessSetupFormState = {
  drafts: BusinessSetupDrafts;
  stepsWithValidationErrors: BusinessSetupDraftStep[];
};

type BusinessSetupFormAction =
  | {
      step: BusinessSetupDraftStep;
      type: "clearStep";
    }
  | {
      hasValidationErrors: boolean;
      step: BusinessSetupDraftStep;
      type: "setValidation";
    }
  | {
      step: BusinessSetupDraftStep;
      type: "setDraft";
      values: BusinessSetupDrafts[BusinessSetupDraftStep];
    };

export const businessSetupDraftSteps: BusinessSetupDraftStep[] = [
  "BUSINESS_BASICS",
  "LOCATION",
  "PUBLIC_PROFILE",
  "AVAILABILITY",
  "SERVICES",
  "ADDONS",
  "TEAM",
  "BOOKING_RULES",
];

export const initialBusinessSetupFormState: BusinessSetupFormState = {
  drafts: {},
  stepsWithValidationErrors: [],
};

export const businessSetupFormReducer = (
  state: BusinessSetupFormState,
  action: BusinessSetupFormAction,
): BusinessSetupFormState => {
  if (action.type === "setDraft") {
    return {
      ...state,
      drafts: {
        ...state.drafts,
        [action.step]: action.values,
      },
    };
  }

  if (action.type === "setValidation") {
    const alreadyHasValidationErrors =
      state.stepsWithValidationErrors.includes(action.step);

    if (alreadyHasValidationErrors === action.hasValidationErrors) {
      return state;
    }

    return {
      ...state,
      stepsWithValidationErrors: action.hasValidationErrors
        ? [...state.stepsWithValidationErrors, action.step]
        : state.stepsWithValidationErrors.filter(
            (currentStep) => currentStep !== action.step,
          ),
    };
  }

  if (
    !state.drafts[action.step] &&
    !state.stepsWithValidationErrors.includes(action.step)
  ) {
    return state;
  }

  const nextDrafts = { ...state.drafts };

  delete nextDrafts[action.step];

  return {
    drafts: nextDrafts,
    stepsWithValidationErrors: state.stepsWithValidationErrors.filter(
      (currentStep) => currentStep !== action.step,
    ),
  };
};

export type {
  BusinessSetupDrafts,
  BusinessSetupDraftStep,
  BusinessSetupFormAction,
  BusinessSetupFormState,
};
