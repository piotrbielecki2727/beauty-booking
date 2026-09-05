import { randomUUID } from "crypto";
import { Prisma } from "@prisma/client";

import { prisma } from "@/db/prisma";

import type {
  AccountRole,
  BusinessTeamMemberListStatus,
  BusinessTeamMemberRole,
} from "@beauty-booking/shared";

type BusinessTeamMemberAccessRow = {
  acceptedAt: Date | null;
  birthdayDay: number | null;
  birthdayMonth: number | null;
  createdAt: Date;
  deactivatedAt: Date | null;
  email: string | null;
  expiresAt: Date | null;
  fullName: string;
  id: string;
  invitationEmail: string | null;
  invitationId: string | null;
  invitationSentAt: Date | null;
  invitationToken: string | null;
  phoneNumber: string | null;
  providesServices: boolean;
  role: AccountRole;
  userId: string | null;
};

type BusinessTeamActiveInvitationRow = {
  createdAt: Date;
  email: string;
  expiresAt: Date;
  id: string;
  teamMemberId: string;
  token: string | null;
};

type BusinessTeamInvitationRow = {
  acceptedAt: Date | null;
  businessId: string;
  businessName: string;
  cancelledAt: Date | null;
  createdAt: Date;
  email: string;
  expiresAt: Date;
  fullName: string;
  id: string;
  providesServices: boolean;
  role: AccountRole;
  teamMemberId: string;
  userId: string | null;
};

type BusinessTeamMemberMutationValues = {
  birthdayDay: number | null;
  birthdayMonth: number | null;
  email: string | null;
  fullName: string;
  phoneNumber: string | null;
  providesServices: boolean;
  role: BusinessTeamMemberRole;
};

type BusinessTeamOwnerMutationValues = {
  birthDate: Date | null;
  phoneNumber: string | null;
  providesServices: boolean;
};

const findBusinessTeamMembers = ({
  businessId,
  status,
}: {
  businessId: string;
  status: BusinessTeamMemberListStatus;
}) => {
  const statusCondition =
    status === "DEACTIVATED"
      ? Prisma.sql`tm."deactivatedAt" IS NOT NULL`
      : Prisma.sql`tm."deactivatedAt" IS NULL`;

  return prisma.$queryRaw<BusinessTeamMemberAccessRow[]>`
    SELECT
      tm."id",
      tm."createdAt",
      tm."deactivatedAt",
      tm."fullName",
      tm."email",
      tm."phoneNumber",
      tm."birthdayMonth",
      tm."birthdayDay",
      tm."role",
      tm."providesServices",
      tm."userId",
      invite."id" AS "invitationId",
      invite."email" AS "invitationEmail",
      invite."token" AS "invitationToken",
      invite."expiresAt",
      invite."acceptedAt",
      invite."createdAt" AS "invitationSentAt"
    FROM "BusinessTeamMember" tm
    LEFT JOIN LATERAL (
      SELECT i."id", i."email", i."token", i."expiresAt", i."acceptedAt", i."createdAt"
      FROM "BusinessTeamInvitation" i
      WHERE
        i."teamMemberId" = tm."id"
        AND i."acceptedAt" IS NULL
        AND i."cancelledAt" IS NULL
      ORDER BY i."createdAt" DESC
      LIMIT 1
    ) invite ON TRUE
    WHERE tm."businessId" = ${businessId} AND ${statusCondition}
    ORDER BY tm."createdAt" DESC
  `;
};

const findOwnerTeamSettings = ({
  businessId,
  userId,
}: {
  businessId: string;
  userId: string;
}) =>
  prisma.businessMembership.findUnique({
    select: {
      providesServices: true,
      user: {
        select: {
          birthDate: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
        },
      },
    },
    where: {
      businessId_userId: {
        businessId,
        userId,
      },
    },
  });

const findTeamMemberById = ({
  businessId,
  teamMemberId,
}: {
  businessId: string;
  teamMemberId: string;
}) =>
  prisma.$queryRaw<BusinessTeamMemberAccessRow[]>`
    SELECT
      tm."id",
      tm."createdAt",
      tm."deactivatedAt",
      tm."fullName",
      tm."email",
      tm."phoneNumber",
      tm."birthdayMonth",
      tm."birthdayDay",
      tm."role",
      tm."providesServices",
      tm."userId",
      NULL AS "invitationId",
      NULL AS "invitationEmail",
      NULL AS "invitationToken",
      NULL AS "expiresAt",
      NULL AS "acceptedAt",
      NULL AS "invitationSentAt"
    FROM "BusinessTeamMember" tm
    WHERE tm."businessId" = ${businessId} AND tm."id" = ${teamMemberId}
    LIMIT 1
  `;

const findTeamMemberByEmail = ({
  businessId,
  email,
  excludedTeamMemberId,
}: {
  businessId: string;
  email: string;
  excludedTeamMemberId?: string;
}) =>
  prisma.businessTeamMember.findMany({
    select: {
      id: true,
      userId: true,
    },
    take: 1,
    where: {
      businessId,
      email,
      ...(excludedTeamMemberId
        ? {
            id: {
              not: excludedTeamMemberId,
            },
          }
        : {}),
    },
  });

const createTeamMember = ({
  businessId,
  teamMemberId,
  values,
}: {
  businessId: string;
  teamMemberId: string;
  values: BusinessTeamMemberMutationValues;
}) =>
  prisma.$executeRaw`
    INSERT INTO "BusinessTeamMember" (
      "id",
      "fullName",
      "email",
      "phoneNumber",
      "birthdayMonth",
      "birthdayDay",
      "role",
      "providesServices",
      "updatedAt",
      "businessId"
    )
    VALUES (
      ${teamMemberId},
      ${values.fullName},
      ${values.email},
      ${values.phoneNumber},
      ${values.birthdayMonth},
      ${values.birthdayDay},
      ${values.role}::"AccountRole",
      ${values.providesServices},
      NOW(),
      ${businessId}
    )
  `;

const updateTeamMember = ({
  businessId,
  shouldCancelActiveInvitations,
  teamMemberId,
  userId,
  values,
}: {
  businessId: string;
  shouldCancelActiveInvitations: boolean;
  teamMemberId: string;
  userId: string | null;
  values: BusinessTeamMemberMutationValues;
}) =>
  prisma.$transaction(async (transaction) => {
    if (shouldCancelActiveInvitations) {
      await transaction.$executeRaw`
        UPDATE "BusinessTeamInvitation" i
        SET "cancelledAt" = NOW(), "updatedAt" = NOW()
        FROM "BusinessTeamMember" tm
        WHERE
          i."teamMemberId" = tm."id"
          AND tm."businessId" = ${businessId}
          AND i."teamMemberId" = ${teamMemberId}
          AND i."acceptedAt" IS NULL
          AND i."cancelledAt" IS NULL
      `;
    }

    await transaction.$executeRaw`
      UPDATE "BusinessTeamMember"
      SET
        "email" = ${values.email},
        "birthdayDay" = ${values.birthdayDay},
        "birthdayMonth" = ${values.birthdayMonth},
        "fullName" = ${values.fullName},
        "phoneNumber" = ${values.phoneNumber},
        "providesServices" = ${values.providesServices},
        "role" = ${values.role}::"AccountRole",
        "updatedAt" = NOW()
      WHERE "businessId" = ${businessId} AND "id" = ${teamMemberId}
    `;

    if (!userId) {
      return;
    }

    await transaction.user.update({
      data: {
        role: values.role,
      },
      where: {
        id: userId,
      },
    });

    await transaction.businessMembership.update({
      data: {
        providesServices: values.providesServices,
        role: values.role,
      },
      where: {
        businessId_userId: {
          businessId,
          userId,
        },
      },
    });
  });

const deactivateTeamMember = ({
  businessId,
  teamMemberId,
  userId,
}: {
  businessId: string;
  teamMemberId: string;
  userId: string | null;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`
      UPDATE "BusinessTeamInvitation" i
      SET "cancelledAt" = NOW(), "updatedAt" = NOW()
      FROM "BusinessTeamMember" tm
      WHERE
        i."teamMemberId" = tm."id"
        AND tm."businessId" = ${businessId}
        AND i."teamMemberId" = ${teamMemberId}
        AND i."acceptedAt" IS NULL
        AND i."cancelledAt" IS NULL
    `;

    await transaction.businessTeamMember.updateMany({
      data: {
        deactivatedAt: new Date(),
      },
      where: {
        businessId,
        deactivatedAt: null,
        id: teamMemberId,
      },
    });

    if (!userId) {
      return;
    }

    await transaction.businessMembership.deleteMany({
      where: {
        businessId,
        userId,
      },
    });

    await transaction.user.update({
      data: {
        role: "Customer",
      },
      where: {
        id: userId,
      },
    });
  });

const reactivateTeamMember = ({
  businessId,
  teamMemberId,
  userId,
}: {
  businessId: string;
  teamMemberId: string;
  userId: string | null;
}) =>
  prisma.$transaction(async (transaction) => {
    const teamMember = await transaction.businessTeamMember.findFirstOrThrow({
      where: {
        businessId,
        id: teamMemberId,
      },
    });

    await transaction.businessTeamMember.updateMany({
      data: {
        deactivatedAt: null,
      },
      where: {
        businessId,
        id: teamMemberId,
      },
    });

    if (!userId) {
      return;
    }

    await transaction.user.update({
      data: {
        role: teamMember.role,
      },
      where: {
        id: userId,
      },
    });

    await transaction.businessMembership.upsert({
      create: {
        businessId,
        providesServices: teamMember.providesServices,
        role: teamMember.role,
        userId,
      },
      update: {
        providesServices: teamMember.providesServices,
        role: teamMember.role,
      },
      where: {
        businessId_userId: {
          businessId,
          userId,
        },
      },
    });
  });

const updateOwnerTeamSettings = ({
  businessId,
  userId,
  values,
}: {
  businessId: string;
  userId: string;
  values: BusinessTeamOwnerMutationValues;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.businessMembership.update({
      data: {
        providesServices: values.providesServices,
      },
      select: {
        providesServices: true,
      },
      where: {
        businessId_userId: {
          businessId,
          userId,
        },
      },
    });

    await transaction.user.update({
      data: {
        birthDate: values.birthDate,
        phone: values.phoneNumber,
      },
      where: {
        id: userId,
      },
    });
  });

const createTeamInvitation = ({
  businessId,
  createdAt,
  email,
  expiresAt,
  invitationId,
  teamMemberId,
  token,
  tokenHash,
}: {
  businessId: string;
  createdAt: Date;
  email: string;
  expiresAt: Date;
  invitationId: string;
  teamMemberId: string;
  token: string;
  tokenHash: string;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`
      UPDATE "BusinessTeamInvitation" i
      SET "cancelledAt" = NOW(), "updatedAt" = NOW()
      FROM "BusinessTeamMember" tm
      WHERE
        i."teamMemberId" = tm."id"
        AND tm."businessId" = ${businessId}
        AND i."teamMemberId" = ${teamMemberId}
        AND i."acceptedAt" IS NULL
        AND i."cancelledAt" IS NULL
    `;

    await transaction.$executeRaw`
      UPDATE "BusinessTeamMember"
      SET "email" = ${email}, "updatedAt" = NOW()
      WHERE "businessId" = ${businessId} AND "id" = ${teamMemberId}
    `;

    await transaction.$executeRaw`
      INSERT INTO "BusinessTeamInvitation" (
        "id",
        "email",
        "token",
        "tokenHash",
        "expiresAt",
        "createdAt",
        "updatedAt",
        "teamMemberId"
      )
      VALUES (
        ${invitationId},
        ${email},
        ${token},
        ${tokenHash},
        ${expiresAt},
        ${createdAt},
        ${createdAt},
        ${teamMemberId}
      )
    `;
  });

const cancelTeamInvitation = ({
  businessId,
  invitationId,
}: {
  businessId: string;
  invitationId: string;
}) =>
  prisma.$executeRaw`
    UPDATE "BusinessTeamInvitation" i
    SET "cancelledAt" = NOW(), "updatedAt" = NOW()
    FROM "BusinessTeamMember" tm
    WHERE
      i."teamMemberId" = tm."id"
      AND tm."businessId" = ${businessId}
      AND i."id" = ${invitationId}
      AND i."acceptedAt" IS NULL
      AND i."cancelledAt" IS NULL
  `;

const findActiveTeamInvitationByTeamMemberId = ({
  businessId,
  teamMemberId,
}: {
  businessId: string;
  teamMemberId: string;
}) =>
  prisma.$queryRaw<BusinessTeamActiveInvitationRow[]>`
    SELECT
      i."id",
      i."email",
      i."createdAt",
      i."token",
      i."expiresAt",
      i."teamMemberId"
    FROM "BusinessTeamInvitation" i
    JOIN "BusinessTeamMember" tm ON tm."id" = i."teamMemberId"
    WHERE
      tm."businessId" = ${businessId}
      AND i."teamMemberId" = ${teamMemberId}
      AND i."acceptedAt" IS NULL
      AND i."cancelledAt" IS NULL
      AND i."expiresAt" > NOW()
    ORDER BY i."createdAt" DESC
    LIMIT 1
  `;

const findInvitationByTokenHash = (tokenHash: string) =>
  prisma.$queryRaw<BusinessTeamInvitationRow[]>`
    SELECT
      i."id",
      i."email",
      i."createdAt",
      i."expiresAt",
      i."acceptedAt",
      i."cancelledAt",
      tm."id" AS "teamMemberId",
      tm."fullName",
      tm."role",
      tm."providesServices",
      tm."userId",
      b."id" AS "businessId",
      b."name" AS "businessName"
    FROM "BusinessTeamInvitation" i
    JOIN "BusinessTeamMember" tm ON tm."id" = i."teamMemberId"
    JOIN "Business" b ON b."id" = tm."businessId"
    WHERE i."tokenHash" = ${tokenHash}
    LIMIT 1
  `;

const acceptTeamInvitation = ({
  businessId,
  invitationId,
  providesServices,
  role,
  teamMemberId,
  userId,
}: {
  businessId: string;
  invitationId: string;
  providesServices: boolean;
  role: BusinessTeamMemberRole;
  teamMemberId: string;
  userId: string;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`
      UPDATE "User"
      SET "role" = ${role}::"AccountRole", "updatedAt" = NOW()
      WHERE "id" = ${userId}
    `;

    await transaction.$executeRaw`
      INSERT INTO "BusinessMembership" (
        "id",
        "role",
        "providesServices",
        "updatedAt",
        "businessId",
        "userId"
      )
      VALUES (
        ${randomUUID()},
        ${role}::"AccountRole",
        ${providesServices},
        NOW(),
        ${businessId},
        ${userId}
      )
      ON CONFLICT ("businessId", "userId")
      DO UPDATE SET
        "role" = EXCLUDED."role",
        "providesServices" = EXCLUDED."providesServices",
        "updatedAt" = NOW()
    `;

    await transaction.$executeRaw`
      UPDATE "BusinessTeamMember"
      SET "userId" = ${userId}, "updatedAt" = NOW()
      WHERE "businessId" = ${businessId} AND "id" = ${teamMemberId}
    `;

    await transaction.$executeRaw`
      UPDATE "BusinessTeamInvitation" i
      SET "acceptedAt" = NOW(), "updatedAt" = NOW()
      FROM "BusinessTeamMember" tm
      WHERE
        i."teamMemberId" = tm."id"
        AND tm."businessId" = ${businessId}
        AND i."id" = ${invitationId}
    `;
  });

export {
  acceptTeamInvitation,
  cancelTeamInvitation,
  createTeamMember,
  createTeamInvitation,
  deactivateTeamMember,
  findBusinessTeamMembers,
  findActiveTeamInvitationByTeamMemberId,
  findInvitationByTokenHash,
  findOwnerTeamSettings,
  findTeamMemberByEmail,
  findTeamMemberById,
  reactivateTeamMember,
  updateOwnerTeamSettings,
  updateTeamMember,
};
export type {
  BusinessTeamActiveInvitationRow,
  BusinessTeamInvitationRow,
  BusinessTeamMemberAccessRow,
};
