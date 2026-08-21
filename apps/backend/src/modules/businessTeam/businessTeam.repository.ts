import { randomUUID } from "crypto";

import { prisma } from "@/db/prisma";

import type {
  AccountRole,
  BusinessTeamMemberRole,
} from "@beauty-booking/shared";

type BusinessTeamMemberAccessRow = {
  acceptedAt: Date | null;
  email: string | null;
  expiresAt: Date | null;
  fullName: string;
  id: string;
  invitationEmail: string | null;
  invitationId: string | null;
  providesServices: boolean;
  role: AccountRole;
  userId: string | null;
};

type BusinessTeamInvitationRow = {
  acceptedAt: Date | null;
  businessId: string;
  businessName: string;
  cancelledAt: Date | null;
  email: string;
  expiresAt: Date;
  fullName: string;
  id: string;
  providesServices: boolean;
  role: AccountRole;
  teamMemberId: string;
  userId: string | null;
};

const findBusinessTeamMembers = (businessId: string) =>
  prisma.$queryRaw<BusinessTeamMemberAccessRow[]>`
    SELECT
      tm."id",
      tm."fullName",
      tm."email",
      tm."role",
      tm."providesServices",
      tm."userId",
      invite."id" AS "invitationId",
      invite."email" AS "invitationEmail",
      invite."expiresAt",
      invite."acceptedAt"
    FROM "BusinessTeamMember" tm
    LEFT JOIN LATERAL (
      SELECT i."id", i."email", i."expiresAt", i."acceptedAt"
      FROM "BusinessTeamInvitation" i
      WHERE
        i."teamMemberId" = tm."id"
        AND i."acceptedAt" IS NULL
        AND i."cancelledAt" IS NULL
        AND i."expiresAt" > NOW()
      ORDER BY i."createdAt" DESC
      LIMIT 1
    ) invite ON TRUE
    WHERE tm."businessId" = ${businessId}
    ORDER BY tm."createdAt" ASC
  `;

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
      tm."fullName",
      tm."email",
      tm."role",
      tm."providesServices",
      tm."userId",
      NULL AS "invitationId",
      NULL AS "invitationEmail",
      NULL AS "expiresAt",
      NULL AS "acceptedAt"
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
  excludedTeamMemberId: string;
}) =>
  prisma.$queryRaw<{ id: string }[]>`
    SELECT tm."id"
    FROM "BusinessTeamMember" tm
    WHERE
      tm."businessId" = ${businessId}
      AND tm."email" = ${email}
      AND tm."id" <> ${excludedTeamMemberId}
    LIMIT 1
  `;

const createTeamInvitation = ({
  email,
  expiresAt,
  invitationId,
  teamMemberId,
  tokenHash,
}: {
  email: string;
  expiresAt: Date;
  invitationId: string;
  teamMemberId: string;
  tokenHash: string;
}) =>
  prisma.$transaction(async (transaction) => {
    await transaction.$executeRaw`
      UPDATE "BusinessTeamInvitation"
      SET "cancelledAt" = NOW(), "updatedAt" = NOW()
      WHERE
        "teamMemberId" = ${teamMemberId}
        AND "acceptedAt" IS NULL
        AND "cancelledAt" IS NULL
    `;

    await transaction.$executeRaw`
      UPDATE "BusinessTeamMember"
      SET "email" = ${email}, "updatedAt" = NOW()
      WHERE "id" = ${teamMemberId}
    `;

    await transaction.$executeRaw`
      INSERT INTO "BusinessTeamInvitation" (
        "id",
        "email",
        "tokenHash",
        "expiresAt",
        "updatedAt",
        "teamMemberId"
      )
      VALUES (
        ${invitationId},
        ${email},
        ${tokenHash},
        ${expiresAt},
        NOW(),
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

const findInvitationByTokenHash = (tokenHash: string) =>
  prisma.$queryRaw<BusinessTeamInvitationRow[]>`
    SELECT
      i."id",
      i."email",
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
      WHERE "id" = ${teamMemberId}
    `;

    await transaction.$executeRaw`
      UPDATE "BusinessTeamInvitation"
      SET "acceptedAt" = NOW(), "updatedAt" = NOW()
      WHERE "id" = ${invitationId}
    `;
  });

export {
  acceptTeamInvitation,
  cancelTeamInvitation,
  createTeamInvitation,
  findBusinessTeamMembers,
  findInvitationByTokenHash,
  findTeamMemberByEmail,
  findTeamMemberById,
};
export type { BusinessTeamInvitationRow, BusinessTeamMemberAccessRow };
