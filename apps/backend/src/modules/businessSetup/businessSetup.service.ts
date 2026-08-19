import {
  canManageSalonSettings,
  type AuthUser,
  type BusinessBasicsForm,
  type BusinessSetupResponse,
  type BusinessSetupStep,
} from "@beauty-booking/shared";

import {
  findBusinessSetupById,
  updateBusinessBasics,
} from "@/modules/businessSetup/businessSetup.repository";
import { ApiError } from "@/utils/apiError";

type BusinessSetupRecord = NonNullable<
  Awaited<ReturnType<typeof findBusinessSetupById>>
>;

const toBusinessSpecialization = (
  specialization: BusinessSetupRecord["specialization"],
) => {
  if (specialization === "BROWS" || specialization === "LASHES") {
    return "BROWS_AND_LASHES" as const;
  }

  if (specialization === "NAILS" || specialization === "MAKEUP") {
    return specialization;
  }

  return null;
};

const assertCanManageBusinessSetup = (user: AuthUser) => {
  if (!canManageSalonSettings(user.role)) {
    throw new ApiError(403, "Brak uprawnień do konfiguracji biznesu.");
  }
};

const toBusinessSetupResponse = (
  business: BusinessSetupRecord,
): BusinessSetupResponse => ({
  basics: {
    businessType: business.businessType,
    name: business.name,
    ownerProvidesServices:
      business.memberships[0]?.providesServices ?? null,
    specialization: toBusinessSpecialization(business.specialization),
  },
  setup: {
    completedSteps: business.onboardingCompletedSteps,
    currentStep: business.onboardingCurrentStep,
    onboardingCompletedAt:
      business.onboardingCompletedAt?.toISOString() ?? null,
    status: business.onboardingStatus,
  },
});

const getBusinessSetup = async (user: AuthUser) => {
  assertCanManageBusinessSetup(user);

  const business = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!business) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  return toBusinessSetupResponse(business);
};

const getCompletedSteps = (
  completedSteps: BusinessSetupStep[],
  nextStep: BusinessSetupStep,
): BusinessSetupStep[] =>
  Array.from(new Set([...completedSteps, nextStep]));

const saveBusinessBasics = async (
  user: AuthUser,
  values: BusinessBasicsForm,
) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  const updatedBusiness = await updateBusinessBasics({
    businessId: user.businessId,
    businessType: values.businessType,
    completedSteps: getCompletedSteps(
      currentBusiness.onboardingCompletedSteps,
      "BUSINESS_BASICS",
    ),
    name: values.name,
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED" ? null : "LOCATION",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    ownerProvidesServices: values.ownerProvidesServices,
    specialization: values.specialization,
    userId: user.id,
  });

  if (!updatedBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  return toBusinessSetupResponse(updatedBusiness);
};

export { getBusinessSetup, saveBusinessBasics };
