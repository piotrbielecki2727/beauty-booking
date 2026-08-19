import type {
  BusinessLocationForm,
  BusinessServicesForm,
  BusinessSetupStep,
  BusinessSpecialization,
  BusinessType,
  BusinessWorkstationsForm,
} from "@beauty-booking/shared";

import { prisma } from "@/db/prisma";

const businessSetupSelect = {
  apartmentNumber: true,
  buildingNumber: true,
  businessType: true,
  city: true,
  locationNote: true,
  name: true,
  onboardingCompletedAt: true,
  onboardingCompletedSteps: true,
  onboardingCurrentStep: true,
  onboardingStatus: true,
  parkingNote: true,
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
      workstationType: true,
    },
  },
  specialization: true,
  street: true,
  workstations: {
    orderBy: {
      createdAt: "asc",
    },
    select: {
      id: true,
      isActive: true,
      name: true,
      note: true,
      type: true,
    },
  },
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

const updateBusinessBasics = async ({
  businessId,
  businessType,
  completedSteps,
  name,
  onboardingCurrentStep,
  onboardingStatus,
  ownerProvidesServices,
  specialization,
  userId,
}: {
  businessId: string;
  businessType: BusinessType;
  completedSteps: BusinessSetupStep[];
  name: string;
  onboardingCurrentStep: "LOCATION" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  ownerProvidesServices: boolean;
  specialization: BusinessSpecialization;
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
        specialization,
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

const toNullableText = (value: string | undefined) => value?.trim() || null;

const toPriceAmount = (price: string) =>
  Math.round(Number(price.replace(",", ".")) * 100);

const toNullableSpecialization = (
  value: BusinessServicesForm["services"][number]["workstationType"],
) => (value === "ANY" ? null : value);

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
  onboardingCurrentStep: "WORKSTATIONS" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  userId: string;
}) =>
  prisma.business.update({
    data: {
      apartmentNumber: toNullableText(location.apartmentNumber),
      buildingNumber: location.buildingNumber,
      city: location.city,
      locationNote: toNullableText(location.locationNote),
      onboardingCompletedSteps: {
        set: completedSteps,
      },
      onboardingCurrentStep,
      onboardingStatus,
      parkingNote: toNullableText(location.parkingNote),
      postalCode: location.postalCode,
      street: location.street,
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

const updateBusinessWorkstations = ({
  businessId,
  completedSteps,
  onboardingCurrentStep,
  onboardingStatus,
  userId,
  workstations,
}: {
  businessId: string;
  completedSteps: BusinessSetupStep[];
  onboardingCurrentStep: "SERVICES" | null;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  userId: string;
  workstations: BusinessWorkstationsForm["workstations"];
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.businessWorkstation.deleteMany({
      where: {
        businessId,
      },
    });

    await transaction.businessWorkstation.createMany({
      data: workstations.map((workstation) => ({
        businessId,
        isActive: workstation.isActive,
        name: workstation.name,
        note: toNullableText(workstation.note),
        type: workstation.type,
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

const updateBusinessServices = ({
  businessId,
  completedSteps,
  onboardingCurrentStep,
  onboardingStatus,
  services,
  userId,
}: {
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
        workstationType: toNullableSpecialization(service.workstationType),
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

export {
  findBusinessSetupById,
  updateBusinessBasics,
  updateBusinessLocation,
  updateBusinessServices,
  updateBusinessWorkstations,
};
