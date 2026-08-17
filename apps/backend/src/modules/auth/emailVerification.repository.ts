import { prisma } from "@/db/prisma";

type CreateVerificationCodeData = {
  codeHash: string;
  expiresAt: Date;
  userId: string;
};

const createEmailVerificationCode = (data: CreateVerificationCodeData) =>
  prisma.emailVerificationCode.create({
    data,
  });

const countEmailVerificationCodes = (userId: string) =>
  prisma.emailVerificationCode.count({
    where: {
      userId,
    },
  });

const countEmailVerificationFailedAttempts = async (userId: string) => {
  const result = await prisma.emailVerificationCode.aggregate({
    _sum: {
      failedAttempts: true,
    },
    where: {
      userId,
    },
  });

  return result._sum.failedAttempts ?? 0;
};

const findLatestActiveEmailVerificationCode = (userId: string) =>
  prisma.emailVerificationCode.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      expiresAt: {
        gt: new Date(),
      },
      usedAt: null,
      userId,
    },
  });

const findLatestUnusedEmailVerificationCode = (userId: string) =>
  prisma.emailVerificationCode.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      usedAt: null,
      userId,
    },
  });

const markUnusedEmailVerificationCodesUsed = (userId: string) =>
  prisma.emailVerificationCode.updateMany({
    data: {
      usedAt: new Date(),
    },
    where: {
      usedAt: null,
      userId,
    },
  });

const markEmailVerificationCodeUsed = (id: string) =>
  prisma.emailVerificationCode.update({
    data: {
      usedAt: new Date(),
    },
    where: {
      id,
    },
  });

const incrementEmailVerificationFailedAttempts = (id: string) =>
  prisma.emailVerificationCode.update({
    data: {
      failedAttempts: {
        increment: 1,
      },
    },
    where: {
      id,
    },
  });

export {
  countEmailVerificationCodes,
  countEmailVerificationFailedAttempts,
  createEmailVerificationCode,
  findLatestActiveEmailVerificationCode,
  findLatestUnusedEmailVerificationCode,
  incrementEmailVerificationFailedAttempts,
  markEmailVerificationCodeUsed,
  markUnusedEmailVerificationCodesUsed,
};
export type { CreateVerificationCodeData };
