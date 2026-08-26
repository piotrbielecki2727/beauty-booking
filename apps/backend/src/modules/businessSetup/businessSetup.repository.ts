import type {
  BusinessBookingRulesForm,
  BusinessLocationForm,
  BusinessOpeningHoursForm,
  BusinessServicesForm,
  BusinessSetupStep,
  BusinessSpecialization,
  BusinessTeamForm,
  BusinessType,
} from "@beauty-booking/shared";

import { prisma } from "@/db/prisma";

const businessSetupSelect = {
  apartmentNumber: true,
  availabilityMode: true,
  buildingNumber: true,
  businessType: true,
  bookingSettings: {
    select: {
      allowAnyTeamMember: true,
      allowSpecificTeamMember: true,
      bookingHorizonDays: true,
      bookingReleaseMode: true,
      cancellationDeadlineHours: true,
      inSalonConfirmationMode: true,
      minimumAdvanceMinutes: true,
    },
  },
  city: true,
  contactEmail: true,
  contactPhone: true,
  description: true,
  facebookUrl: true,
  instagramUrl: true,
  locationNote: true,
  mobileServiceFeeType: true,
  mobileServiceFixedFeeAmount: true,
  mobileServiceMaxDistanceKm: true,
  mobileServicesEnabled: true,
  mobileServiceTravelTimeMinutes: true,
  name: true,
  onboardingCompletedAt: true,
  onboardingCompletedSteps: true,
  onboardingCurrentStep: true,
  onboardingStatus: true,
  openingHours: {
    select: {
      closesAtMinutes: true,
      dayOfWeek: true,
      isOpen: true,
      opensAtMinutes: true,
    },
  },
  parkingNote: true,
  pinterestUrl: true,
  postalCode: true,
  services: {
    orderBy: {
      createdAt: "asc",
    },
    select: {
      description: true,
      durationMinutes: true,
      id: true,
      isActive: true,
      name: true,
      priceAmount: true,
      specialization: true,
    },
  },
  specializations: true,
  street: true,
  tiktokUrl: true,
  teamMembers: {
    orderBy: {
      createdAt: "asc",
    },
    select: {
      email: true,
      fullName: true,
      id: true,
      providesServices: true,
      role: true,
    },
  },
  youtubeUrl: true,
} as const;

const findBusinessSetupById = ({
  businessId,
  userId,
}: {
  businessId: string;
  userId: string;
}) =>
  prisma.business.findUnique({
    select: {
      ...businessSetupSelect,
      memberships: {
        select: {
          providesServices: true,
        },
        take: 1,
        where: {
          userId,
        },
      },
    },
    where: {
      id: businessId,
    },
  });

const findBusinessSetupStatusById = (businessId: string) =>
  prisma.business.findUnique({
    select: {
      businessType: true,
      onboardingStatus: true,
    },
    where: {
      id: businessId,
    },
  });

const markBusinessSetupCompleted = ({
  businessId,
  completedSteps,
  userId,
}: {
  businessId: string;
  completedSteps: BusinessSetupStep[];
  userId: string;
}) =>
  prisma.business.update({
    data: {
      onboardingCompletedAt: new Date(),
      onboardingCompletedSteps: {
        set: completedSteps,
      },
      onboardingCurrentStep: null,
      onboardingStatus: "COMPLETED",
    },
    select: {
      ...businessSetupSelect,
      memberships: {
        select: {
          providesServices: true,
        },
        take: 1,
        where: {
          userId,
        },
      },
    },
    where: {
      id: businessId,
    },
  });

const markBusinessSetupStarted = ({
  businessId,
  userId,
}: {
  businessId: string;
  userId: string;
}) =>
  prisma.business.update({
    data: {
      onboardingCurrentStep: "BUSINESS_BASICS",
      onboardingStatus: "IN_PROGRESS",
    },
    select: {
      ...businessSetupSelect,
      memberships: {
        select: {
          providesServices: true,
        },
        take: 1,
        where: {
          userId,
        },
      },
    },
    where: {
      id: businessId,
    },
  });

const updateBusinessType = ({
  businessId,
  businessType,
  onboardingCurrentStep,
  onboardingStatus,
  ownerProvidesServices,
  userId,
}: {
  businessId: string;
  businessType: BusinessType;
  onboardingCurrentStep: "BUSINESS_BASICS" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  ownerProvidesServices: boolean | null;
  userId: string;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.business.update({
      data: {
        businessType,
        onboardingCurrentStep,
        onboardingStatus,
      },
      where: {
        id: businessId,
      },
    });

    await transaction.businessMembership.update({
      data: {
        providesServices: ownerProvidesServices,
      },
      where: {
        businessId_userId: {
          businessId,
          userId,
        },
      },
    });

    return transaction.business.findUnique({
      select: {
        ...businessSetupSelect,
        memberships: {
          select: {
            providesServices: true,
          },
          take: 1,
          where: {
            userId,
          },
        },
      },
      where: {
        id: businessId,
      },
    });
  });

const updateBusinessBasics = async ({
  businessId,
  businessType,
  completedSteps,
  name,
  onboardingCurrentStep,
  onboardingStatus,
  ownerProvidesServices,
  specializations,
  userId,
}: {
  businessId: string;
  businessType: BusinessType;
  completedSteps: BusinessSetupStep[];
  name: string;
  onboardingCurrentStep: "LOCATION" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  ownerProvidesServices: boolean | null;
  specializations: BusinessSpecialization[];
  userId: string;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.business.update({
      data: {
        businessType,
        name,
        onboardingCompletedSteps: {
          set: completedSteps,
        },
        onboardingCurrentStep,
        onboardingStatus,
        specializations: {
          set: specializations,
        },
      },
      where: {
        id: businessId,
      },
    });

    await transaction.businessMembership.update({
      data: {
        providesServices: ownerProvidesServices,
      },
      where: {
        businessId_userId: {
          businessId,
          userId,
        },
      },
    });

    return transaction.business.findUnique({
      select: {
        ...businessSetupSelect,
        memberships: {
          select: {
            providesServices: true,
          },
          take: 1,
          where: {
            userId,
          },
        },
      },
      where: {
        id: businessId,
      },
    });
  });

const updateBusinessDetails = ({
  businessId,
  completedSteps,
  contactEmail,
  contactPhone,
  description,
  facebookUrl,
  instagramUrl,
  onboardingCurrentStep,
  onboardingStatus,
  pinterestUrl,
  tiktokUrl,
  userId,
  youtubeUrl,
}: {
  businessId: string;
  completedSteps: BusinessSetupStep[];
  contactEmail: string;
  contactPhone: string;
  description: string;
  facebookUrl: string;
  instagramUrl: string;
  onboardingCurrentStep: "SUMMARY" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  pinterestUrl: string;
  tiktokUrl: string;
  userId: string;
  youtubeUrl: string;
}) =>
  prisma.business.update({
    data: {
      contactEmail: contactEmail.trim().toLowerCase() || null,
      contactPhone: contactPhone.trim() || null,
      description: description.trim() || null,
      facebookUrl: toNullableUrl(facebookUrl),
      instagramUrl: toNullableUrl(instagramUrl),
      onboardingCompletedSteps: {
        set: completedSteps,
      },
      onboardingCurrentStep,
      onboardingStatus,
      pinterestUrl: toNullableUrl(pinterestUrl),
      tiktokUrl: toNullableUrl(tiktokUrl),
      youtubeUrl: toNullableUrl(youtubeUrl),
    },
    select: {
      ...businessSetupSelect,
      memberships: {
        select: {
          providesServices: true,
        },
        take: 1,
        where: {
          userId,
        },
      },
    },
    where: {
      id: businessId,
    },
  });

const toNullableText = (value: string | undefined) => value?.trim() || null;

const toNullableEmail = (value: string | undefined) =>
  value?.trim().toLowerCase() || null;

const toNullableUrl = (value: string | undefined) => {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    return null;
  }

  return /^https?:\/\//i.test(normalizedValue)
    ? normalizedValue
    : `https://${normalizedValue}`;
};

const toPriceAmount = (price: string) =>
  Math.round(Number(price.replace(",", ".")) * 100);

const toMobileServiceFixedFeeAmount = (location: BusinessLocationForm) =>
  location.mobileServicesEnabled && location.mobileServiceFeeType === "FIXED"
    ? toPriceAmount(location.mobileServiceFixedFee)
    : null;

const toMinutesAfterMidnight = (value: string) => {
  const [hours = 0, minutes = 0] = value.split(":").map(Number);

  return hours * 60 + minutes;
};

const updateBusinessLocation = ({
  businessId,
  completedSteps,
  location,
  onboardingCurrentStep,
  onboardingStatus,
  userId,
}: {
  businessId: string;
  completedSteps: BusinessSetupStep[];
  location: BusinessLocationForm;
  onboardingCurrentStep: BusinessSetupStep | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  userId: string;
}) =>
  prisma.business.update({
    data: {
      apartmentNumber: toNullableText(location.apartmentNumber),
      buildingNumber: location.buildingNumber,
      city: location.city,
      locationNote: toNullableText(location.locationNote),
      mobileServiceFeeType: location.mobileServicesEnabled
        ? location.mobileServiceFeeType
        : null,
      mobileServiceFixedFeeAmount:
        toMobileServiceFixedFeeAmount(location),
      mobileServiceMaxDistanceKm: location.mobileServicesEnabled
        ? Number(location.mobileServiceMaxDistanceKm)
        : null,
      mobileServicesEnabled: location.mobileServicesEnabled,
      mobileServiceTravelTimeMinutes: location.mobileServicesEnabled
        ? Number(location.mobileServiceTravelTimeMinutes)
        : null,
      onboardingCompletedSteps: {
        set: completedSteps,
      },
      onboardingCurrentStep,
      onboardingStatus,
      parkingNote: toNullableText(location.parkingNote),
      postalCode: location.postalCode,
      street: toNullableText(location.street),
    },
    select: {
      ...businessSetupSelect,
      memberships: {
        select: {
          providesServices: true,
        },
        take: 1,
        where: {
          userId,
        },
      },
    },
    where: {
      id: businessId,
    },
  });

const updateBusinessOpeningHours = ({
  businessId,
  completedSteps,
  onboardingCurrentStep,
  onboardingStatus,
  openingHours,
  userId,
}: {
  businessId: string;
  completedSteps: BusinessSetupStep[];
  onboardingCurrentStep: "PUBLIC_PROFILE" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  openingHours: BusinessOpeningHoursForm["openingHours"];
  userId: string;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.businessOpeningHour.deleteMany({
      where: {
        businessId,
      },
    });

    await transaction.businessOpeningHour.createMany({
      data: openingHours.map((item) => ({
        businessId,
        closesAtMinutes: item.isOpen
          ? toMinutesAfterMidnight(item.closesAt)
          : null,
        dayOfWeek: item.dayOfWeek,
        isOpen: item.isOpen,
        opensAtMinutes: item.isOpen
          ? toMinutesAfterMidnight(item.opensAt)
          : null,
      })),
    });

    await transaction.business.update({
      data: {
        onboardingCompletedSteps: {
          set: completedSteps,
        },
        onboardingCurrentStep,
        onboardingStatus,
      },
      where: {
        id: businessId,
      },
    });

    return transaction.business.findUnique({
      select: {
        ...businessSetupSelect,
        memberships: {
          select: {
            providesServices: true,
          },
          take: 1,
          where: {
            userId,
          },
        },
      },
      where: {
        id: businessId,
      },
    });
  });

const updateBusinessBookingRules = ({
  bookingRules,
  businessId,
  completedSteps,
  onboardingCurrentStep,
  onboardingStatus,
  userId,
}: {
  bookingRules: BusinessBookingRulesForm;
  businessId: string;
  completedSteps: BusinessSetupStep[];
  onboardingCurrentStep: "PUBLIC_PROFILE" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  userId: string;
}) =>
  prisma.$transaction(async (transaction) => {
    const settings = {
      allowAnyTeamMember: bookingRules.allowAnyTeamMember,
      allowSpecificTeamMember: bookingRules.allowSpecificTeamMember,
      bookingHorizonDays:
        bookingRules.bookingReleaseMode === "ROLLING"
          ? Number(bookingRules.bookingHorizonDays)
          : null,
      bookingReleaseMode: bookingRules.bookingReleaseMode,
      cancellationDeadlineHours: Number(
        bookingRules.cancellationDeadlineHours,
      ),
      inSalonConfirmationMode: bookingRules.inSalonConfirmationMode,
      minimumAdvanceMinutes: Number(bookingRules.minimumAdvanceMinutes),
    };

    await transaction.businessBookingSettings.upsert({
      create: {
        businessId,
        ...settings,
      },
      update: settings,
      where: {
        businessId,
      },
    });

    await transaction.business.update({
      data: {
        onboardingCompletedSteps: {
          set: completedSteps,
        },
        onboardingCurrentStep,
        onboardingStatus,
      },
      where: {
        id: businessId,
      },
    });

    return transaction.business.findUnique({
      select: {
        ...businessSetupSelect,
        memberships: {
          select: {
            providesServices: true,
          },
          take: 1,
          where: {
            userId,
          },
        },
      },
      where: {
        id: businessId,
      },
    });
  });

const updateBusinessServices = ({
  activeSpecializations,
  businessId,
  completedSteps,
  onboardingCurrentStep,
  onboardingStatus,
  services,
  userId,
}: {
  activeSpecializations: BusinessSpecialization[];
  businessId: string;
  completedSteps: BusinessSetupStep[];
  onboardingCurrentStep: "ADDONS" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  services: BusinessServicesForm["services"];
  userId: string;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.businessService.deleteMany({
      where: {
        businessId,
        specialization: {
          in: activeSpecializations,
        },
      },
    });

    await transaction.businessService.createMany({
      data: services.map((service) => ({
        businessId,
        description: toNullableText(service.description),
        durationMinutes: Number(service.durationMinutes),
        isActive: service.isActive,
        name: service.name,
        priceAmount: toPriceAmount(service.price),
        specialization: service.specialization,
      })),
    });

    await transaction.business.update({
      data: {
        onboardingCompletedSteps: {
          set: completedSteps,
        },
        onboardingCurrentStep,
        onboardingStatus,
      },
      where: {
        id: businessId,
      },
    });

    return transaction.business.findUnique({
      select: {
        ...businessSetupSelect,
        memberships: {
          select: {
            providesServices: true,
          },
          take: 1,
          where: {
            userId,
          },
        },
      },
      where: {
        id: businessId,
      },
    });
  });

const updateBusinessTeam = ({
  businessId,
  completedSteps,
  onboardingCurrentStep,
  onboardingStatus,
  teamMembers,
  userId,
}: {
  businessId: string;
  completedSteps: BusinessSetupStep[];
  onboardingCurrentStep: "AVAILABILITY" | "PUBLIC_PROFILE" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  teamMembers: BusinessTeamForm["teamMembers"];
  userId: string;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.businessTeamMember.deleteMany({
      where: {
        businessId,
      },
    });

    if (teamMembers.length > 0) {
      await transaction.businessTeamMember.createMany({
        data: teamMembers.map((member) => ({
          businessId,
          email: toNullableEmail(member.email),
          fullName: member.fullName,
          providesServices: member.providesServices,
          role: member.role,
        })),
      });
    }

    await transaction.business.update({
      data: {
        onboardingCompletedSteps: {
          set: completedSteps,
        },
        onboardingCurrentStep,
        onboardingStatus,
      },
      where: {
        id: businessId,
      },
    });

    return transaction.business.findUnique({
      select: {
        ...businessSetupSelect,
        memberships: {
          select: {
            providesServices: true,
          },
          take: 1,
          where: {
            userId,
          },
        },
      },
      where: {
        id: businessId,
      },
    });
  });

export {
  findBusinessSetupById,
  findBusinessSetupStatusById,
  markBusinessSetupCompleted,
  markBusinessSetupStarted,
  updateBusinessType,
  updateBusinessBasics,
  updateBusinessDetails,
  updateBusinessBookingRules,
  updateBusinessLocation,
  updateBusinessOpeningHours,
  updateBusinessServices,
  updateBusinessTeam,
};
