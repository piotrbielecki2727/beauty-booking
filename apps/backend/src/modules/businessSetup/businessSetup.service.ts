import {
  businessSetupCompletionRequiredSteps,
  canManageSalonSettings,
  businessWeekdays,
  isSalonTeamRole,
  type AuthUser,
  type BusinessBasicsForm,
  type BusinessBookingRulesForm,
  type BusinessDetailsForm,
  type BusinessLocationForm,
  type BusinessOpeningHour,
  type BusinessOpeningHoursForm,
  type BusinessWeekday,
  type BusinessServicesForm,
  type BusinessSetupResponse,
  type BusinessSetupStatusResponse,
  type BusinessSetupStep,
  type BusinessTeamForm,
  type BusinessTeamMemberRole,
  type BusinessTypeForm,
} from "@beauty-booking/shared";

import {
  findBusinessSetupById,
  findBusinessSetupStatusById,
  markBusinessSetupCompleted,
  markBusinessSetupStarted,
  updateBusinessBasics,
  updateBusinessDetails,
  updateBusinessBookingRules,
  updateBusinessLocation,
  updateBusinessOpeningHours,
  updateBusinessServices,
  updateBusinessTeam,
  updateBusinessType,
} from "@/modules/businessSetup/businessSetup.repository";
import { ApiError } from "@/utils/apiError";

type BusinessSetupRecord = NonNullable<
  Awaited<ReturnType<typeof findBusinessSetupById>>
>;

const toOpeningTime = (minutesAfterMidnight: number) => {
  const hours = Math.floor(minutesAfterMidnight / 60);
  const minutes = minutesAfterMidnight % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const toBusinessBookingRulesResponse = (
  business: BusinessSetupRecord,
): BusinessBookingRulesForm | null => {
  const settings = business.bookingSettings;

  if (!settings) {
    return null;
  }

  const commonValues = {
    allowAnyTeamMember: settings.allowAnyTeamMember,
    allowSpecificTeamMember: settings.allowSpecificTeamMember,
    cancellationDeadlineHours: String(settings.cancellationDeadlineHours),
    inSalonConfirmationMode: settings.inSalonConfirmationMode,
    minimumAdvanceMinutes: String(settings.minimumAdvanceMinutes),
  };

  if (settings.bookingReleaseMode === "ROLLING") {
    return {
      ...commonValues,
      bookingHorizonDays: String(settings.bookingHorizonDays ?? 60),
      bookingReleaseMode: "ROLLING",
    };
  }

  return {
    ...commonValues,
    bookingHorizonDays: "",
    bookingReleaseMode: "MANUAL",
  };
};

const toBusinessOpeningHourResponse = (
  item: BusinessSetupRecord["openingHours"][number],
): BusinessOpeningHour => {
  const dayOfWeek = item.dayOfWeek as BusinessWeekday;

  if (
    !item.isOpen ||
    item.opensAtMinutes === null ||
    item.closesAtMinutes === null
  ) {
    return {
      closesAt: "",
      dayOfWeek,
      isOpen: false,
      opensAt: "",
    };
  }

  return {
    closesAt: toOpeningTime(item.closesAtMinutes),
    dayOfWeek,
    isOpen: true,
    opensAt: toOpeningTime(item.opensAtMinutes),
  };
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
    availabilityMode: business.availabilityMode,
    businessType: business.businessType,
    name: business.name,
    ownerProvidesServices:
      business.memberships[0]?.providesServices ?? null,
    specializations: business.specializations,
  },
  bookingRules: toBusinessBookingRulesResponse(business),
  location: {
    apartmentNumber: business.apartmentNumber,
    buildingNumber: business.buildingNumber,
    city: business.city,
    locationNote: business.locationNote,
    mobileServiceFeeType: business.mobileServiceFeeType,
    mobileServiceFixedFee:
      business.mobileServiceFixedFeeAmount === null
        ? ""
        : (business.mobileServiceFixedFeeAmount / 100).toFixed(2),
    mobileServiceMaxDistanceKm: business.mobileServiceMaxDistanceKm,
    mobileServicesEnabled: business.mobileServicesEnabled,
    mobileServiceTravelTimeMinutes:
      business.mobileServiceTravelTimeMinutes,
    parkingNote: business.parkingNote,
    postalCode: business.postalCode,
    street: business.street,
  },
  openingHours: [...business.openingHours]
    .sort(
      (firstItem, secondItem) =>
        businessWeekdays.indexOf(firstItem.dayOfWeek as BusinessWeekday) -
        businessWeekdays.indexOf(secondItem.dayOfWeek as BusinessWeekday),
    )
    .map(toBusinessOpeningHourResponse),
  publicProfile: {
    contactEmail: business.contactEmail,
    contactPhone: business.contactPhone,
    description: business.description,
    facebookUrl: business.facebookUrl,
    instagramUrl: business.instagramUrl,
    pinterestUrl: business.pinterestUrl,
    tiktokUrl: business.tiktokUrl,
    youtubeUrl: business.youtubeUrl,
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

const getBusinessSetupStatus = async (
  user: AuthUser,
): Promise<BusinessSetupStatusResponse> => {
  if (!isSalonTeamRole(user.role)) {
    throw new ApiError(403, "Brak dostępu do panelu salonu.");
  }

  const business = await findBusinessSetupStatusById(user.businessId);

  if (!business) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  return {
    businessType: business.businessType,
    status: business.onboardingStatus,
  };
};

const completeBusinessSetup = async (user: AuthUser) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  if (currentBusiness.onboardingStatus === "COMPLETED") {
    return toBusinessSetupResponse(currentBusiness);
  }

  const missingSteps = businessSetupCompletionRequiredSteps.filter(
    (step) => !currentBusiness.onboardingCompletedSteps.includes(step),
  );

  if (missingSteps.length > 0) {
    throw new ApiError(
      409,
      "Przed zakończeniem konfiguracji zapisz wszystkie wymagane kroki.",
    );
  }

  const updatedBusiness = await markBusinessSetupCompleted({
    businessId: user.businessId,
    completedSteps: getCompletedSteps(
      currentBusiness.onboardingCompletedSteps,
      "SUMMARY",
    ),
    userId: user.id,
  });

  return toBusinessSetupResponse(updatedBusiness);
};

const startBusinessSetup = async (user: AuthUser) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  if (currentBusiness.onboardingStatus !== "NOT_STARTED") {
    return toBusinessSetupResponse(currentBusiness);
  }

  const updatedBusiness = await markBusinessSetupStarted({
    businessId: user.businessId,
    userId: user.id,
  });

  return toBusinessSetupResponse(updatedBusiness);
};

const saveBusinessType = async (user: AuthUser, values: BusinessTypeForm) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  const updatedBusiness = await updateBusinessType({
    businessId: user.businessId,
    businessType: values.businessType,
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? null
        : "BUSINESS_BASICS",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    ownerProvidesServices: values.businessType === "SOLO" ? true : null,
    userId: user.id,
  });

  if (!updatedBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  return toBusinessSetupResponse(updatedBusiness);
};

const getCompletedSteps = (
  completedSteps: BusinessSetupStep[],
  nextStep: BusinessSetupStep,
): BusinessSetupStep[] =>
  Array.from(new Set([...completedSteps, nextStep]));

const normalizeEmail = (email: string | undefined) =>
  email?.trim().toLowerCase() || "";

const assertUsesActiveSpecializations = (
  activeSpecializations: BusinessSetupRecord["specializations"],
  values: BusinessServicesForm,
) => {
  const activeSpecializationsSet = new Set(activeSpecializations);
  const usedSpecializations = values.services.map(
    (service) => service.specialization,
  );

  if (
    usedSpecializations.some(
      (specialization) => !activeSpecializationsSet.has(specialization),
    )
  ) {
    throw new ApiError(
      400,
      "Usługi muszą należeć do aktywnej specjalizacji salonu.",
    );
  }
};

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
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED" ? null : "LOCATION",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    name: values.name,
    ownerProvidesServices: values.businessType === "SOLO" ? true : null,
    specializations: values.specializations,
    userId: user.id,
  });

  if (!updatedBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  return toBusinessSetupResponse(updatedBusiness);
};

const saveBusinessDetails = async (
  user: AuthUser,
  values: BusinessDetailsForm,
) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  const updatedBusiness = await updateBusinessDetails({
    businessId: user.businessId,
    completedSteps: getCompletedSteps(
      currentBusiness.onboardingCompletedSteps,
      "PUBLIC_PROFILE",
    ),
    contactEmail: values.contactEmail ?? "",
    contactPhone: values.contactPhone ?? "",
    description: values.description ?? "",
    facebookUrl: values.facebookUrl ?? "",
    instagramUrl: values.instagramUrl ?? "",
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED" ? null : "SUMMARY",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    pinterestUrl: values.pinterestUrl ?? "",
    tiktokUrl: values.tiktokUrl ?? "",
    userId: user.id,
    youtubeUrl: values.youtubeUrl ?? "",
  });

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
        : "PUBLIC_PROFILE",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    userId: user.id,
  });

  return toBusinessSetupResponse(updatedBusiness);
};

const saveBusinessOpeningHours = async (
  user: AuthUser,
  values: BusinessOpeningHoursForm,
) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  if (currentBusiness.availabilityMode !== "FIXED_HOURS") {
    throw new ApiError(
      400,
      "Godziny salonu nie są używane przy indywidualnych grafikach.",
    );
  }

  const updatedBusiness = await updateBusinessOpeningHours({
    businessId: user.businessId,
    completedSteps: getCompletedSteps(
      currentBusiness.onboardingCompletedSteps,
      "AVAILABILITY",
    ),
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? null
        : "PUBLIC_PROFILE",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    openingHours: values.openingHours,
    userId: user.id,
  });

  if (!updatedBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  return toBusinessSetupResponse(updatedBusiness);
};

const saveBusinessBookingRules = async (
  user: AuthUser,
  values: BusinessBookingRulesForm,
) => {
  assertCanManageBusinessSetup(user);

  const currentBusiness = await findBusinessSetupById({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!currentBusiness) {
    throw new ApiError(404, "Nie znaleziono biznesu.");
  }

  if (
    currentBusiness.businessType === "TEAM" &&
    !values.allowAnyTeamMember &&
    !values.allowSpecificTeamMember
  ) {
    throw new ApiError(
      400,
      "Włącz co najmniej jeden sposób wyboru osoby z zespołu.",
    );
  }

  const updatedBusiness = await updateBusinessBookingRules({
    bookingRules: values,
    businessId: user.businessId,
    completedSteps: getCompletedSteps(
      currentBusiness.onboardingCompletedSteps,
      "BOOKING_RULES",
    ),
    onboardingCurrentStep:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? null
        : "PUBLIC_PROFILE",
    onboardingStatus:
      currentBusiness.onboardingStatus === "COMPLETED"
        ? "COMPLETED"
        : "IN_PROGRESS",
    userId: user.id,
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

  assertUsesActiveSpecializations(currentBusiness.specializations, values);

  const updatedBusiness = await updateBusinessServices({
    activeSpecializations: currentBusiness.specializations,
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
        : "PUBLIC_PROFILE",
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
  completeBusinessSetup,
  getBusinessSetup,
  getBusinessSetupStatus,
  saveBusinessBasics,
  saveBusinessBookingRules,
  saveBusinessDetails,
  saveBusinessLocation,
  saveBusinessOpeningHours,
  saveBusinessServices,
  saveBusinessTeam,
  saveBusinessType,
  startBusinessSetup,
};
