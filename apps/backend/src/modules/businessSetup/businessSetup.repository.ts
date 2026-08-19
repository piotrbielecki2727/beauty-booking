import type {
  BusinessSetupStep,
  BusinessSpecialization,
  BusinessType,
} from "@beauty-booking/shared";

import { prisma } from "@/db/prisma";

const businessSetupSelect = {
  businessType: true,
  name: true,
  onboardingCompletedAt: true,
  onboardingCompletedSteps: true,
  onboardingCurrentStep: true,
  onboardingStatus: true,
  specialization: true,
} as const;

const toPersistedBusinessSpecialization = (
  specialization: BusinessSpecialization,
) =>
  specialization === "BROWS_AND_LASHES" ? "BROWS" : specialization;

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
        specialization: toPersistedBusinessSpecialization(specialization),
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

export { findBusinessSetupById, updateBusinessBasics };
