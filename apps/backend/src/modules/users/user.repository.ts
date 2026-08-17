import type { AccountRole } from "@beauty-booking/shared";

import { prisma } from "@/db/prisma";

type CreateUserData = {
  birthDate: Date | null;
  businessId: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  phone: string | null;
  role: AccountRole;
  termsAndPrivacyPolicyAcceptedAt: Date;
};

const findUserByEmail = ({
  businessId,
  email,
}: {
  businessId: string;
  email: string;
}) =>
  prisma.user.findUnique({
    where: {
      businessId_email: {
        businessId,
        email,
      },
    },
  });

const findUserById = (id: string) =>
  prisma.user.findUnique({
    where: {
      id,
    },
  });

const createUser = (data: CreateUserData) =>
  prisma.user.create({
    data,
  });

const markUserEmailVerified = (userId: string) =>
  prisma.user.update({
    data: {
      emailVerifiedAt: new Date(),
    },
    where: {
      id: userId,
    },
  });

const deleteUserById = (id: string) =>
  prisma.user.delete({
    where: {
      id,
    },
  });

export {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  markUserEmailVerified,
};
export type { CreateUserData };
