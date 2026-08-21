import {
  canManageSalonSettings,
  type AuthUser,
  type BusinessBasicsForm,
  type BusinessLocationForm,
  type BusinessServicesForm,
  type BusinessSetupResponse,
  type BusinessSetupStep,
  type BusinessTeamForm,
  type BusinessTeamMemberRole,
  type BusinessWorkstationsForm,
} from "@beauty-booking/shared";

import {
  findBusinessSetupById,
  updateBusinessBasics,
  updateBusinessLocation,
  updateBusinessServices,
  updateBusinessTeam,
  updateBusinessWorkstations,
} from "@/modules/businessSetup/businessSetup.repository";
import { ApiError } from "@/utils/apiError";

type BusinessSetupRecord = NonNullable<
  Awaited<ReturnType<typeof findBusinessSetupById>>
>;

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
    specialization: business.specialization,
  },
  location: {
    apartmentNumber: business.apartmentNumber,
    buildingNumber: business.buildingNumber,
    city: business.city,
    locationNote: business.locationNote,
    parkingNote: business.parkingNote,
    postalCode: business.postalCode,
    street: business.street,
  },
  services: business.services,
  setup: {
    completedSteps: business.onboardingCompletedSteps,
    currentStep: business.onboardingCurrentStep,
    onboardingCompletedAt:
      business.onboardingCompletedAt?.toISOString() ?? null,
    status: business.onboardingStatus,
  },
  teamMembers: business.teamMembers.map((member) => ({
    ...member,
    email: member.email ?? "",
    role: member.role as BusinessTeamMemberRole,
  })),
  workstations: business.workstations,
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

const getNextStepAfterLocation = (
  businessType: BusinessSetupRecord["businessType"],
): BusinessSetupStep => (businessType === "TEAM" ? "TEAM" : "SERVICES");

const normalizeEmail = (email: string | undefined) =>
  email?.trim().toLowerCase() || "";

const assertBusinessTeamCanBeSaved = ({
  currentBusiness,
  user,
  values,
}: {
  currentBusiness: BusinessSetupRecord;
  user: AuthUser;
  values: BusinessTeamForm;
}) => {
  if (currentBusiness.businessType !== "TEAM") {
    throw new ApiError(400, "Krok zespołu wymaga działalności zespołowej.");
  }

  const ownerEmail = normalizeEmail(user.email);
  const emails = new Set<string>();

  values.teamMembers.forEach((member) => {
    const email = normalizeEmail(member.email);

    if (!email) {
      return;
    }

    if (email === ownerEmail) {
      throw new ApiError(409, "Właściciel jest już częścią zespołu.");
    }

    if (emails.has(email)) {
      throw new ApiError(
        409,
        "Ten adres e-mail jest już przypisany do członka zespołu.",
      );
    }

    emails.add(email);
  });
};

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

const saveBusinessLocation = async (
  user: AuthUser,
  values: BusinessLocationForm,
) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  const updatedBusiness = await updateBusinessLocation({
    businessId: user.businessId,
    completedSteps: getCompletedSteps(
      currentBusiness.onboardingCompletedSteps,
      "LOCATION",
    ),
    location: values,
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? null
        : getNextStepAfterLocation(currentBusiness.businessType),
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    userId: user.id,
  });

  return toBusinessSetupResponse(updatedBusiness);
};

const saveBusinessWorkstations = async (
  user: AuthUser,
  values: BusinessWorkstationsForm,
) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  const updatedBusiness = await updateBusinessWorkstations({
    businessId: user.businessId,
    completedSteps: getCompletedSteps(
      currentBusiness.onboardingCompletedSteps,
      "WORKSTATIONS",
    ),
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED" ? null : "SERVICES",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    userId: user.id,
    workstations: values.workstations,
  });

  if (!updatedBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  return toBusinessSetupResponse(updatedBusiness);
};

const saveBusinessServices = async (
  user: AuthUser,
  values: BusinessServicesForm,
) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  const updatedBusiness = await updateBusinessServices({
    businessId: user.businessId,
    completedSteps: getCompletedSteps(
      currentBusiness.onboardingCompletedSteps,
      "SERVICES",
    ),
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED" ? null : "ADDONS",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    services: values.services,
    userId: user.id,
  });

  if (!updatedBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  return toBusinessSetupResponse(updatedBusiness);
};

const saveBusinessTeam = async (
  user: AuthUser,
  values: BusinessTeamForm,
) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  assertBusinessTeamCanBeSaved({
    currentBusiness,
    user,
    values,
  });

  const updatedBusiness = await updateBusinessTeam({
    businessId: user.businessId,
    completedSteps: getCompletedSteps(
      currentBusiness.onboardingCompletedSteps,
      "TEAM",
    ),
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? null
        : "WORKSTATIONS",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    teamMembers: values.teamMembers,
    userId: user.id,
  });

  if (!updatedBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  return toBusinessSetupResponse(updatedBusiness);
};

export {
  getBusinessSetup,
  saveBusinessBasics,
  saveBusinessLocation,
  saveBusinessServices,
  saveBusinessTeam,
  saveBusinessWorkstations,
};
