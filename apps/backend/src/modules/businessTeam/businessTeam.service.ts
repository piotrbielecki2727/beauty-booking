import { createHash, randomBytes, randomUUID } from "crypto";

import {
  canManageSalonSettings,
  type AuthUser,
  type BusinessTeamInvitationPreview,
  type BusinessTeamMember,
  type BusinessTeamMemberRole,
  type BusinessTeamResponse,
  type CreateBusinessTeamInvitationRequest,
  type CreateBusinessTeamInvitationResponse,
} from "@beauty-booking/shared";

import {
  acceptTeamInvitation,
  cancelTeamInvitation,
  createTeamInvitation,
  findBusinessTeamMembers,
  findInvitationByTokenHash,
  findTeamMemberByEmail,
  findTeamMemberById,
  type BusinessTeamInvitationRow,
  type BusinessTeamMemberAccessRow,
} from "@/modules/businessTeam/businessTeam.repository";
import { ApiError } from "@/utils/apiError";

const invitationValidityDays = 7;

const assertCanManageBusinessTeam = (user: AuthUser) => {
  if (!canManageSalonSettings(user.role)) {
    throw new ApiError(403, "Brak uprawnień do zarządzania zespołem.");
  }
};

const normalizeEmail = (email: string | undefined | null) =>
  email?.trim().toLowerCase() || "";

const hashInvitationToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const createInvitationToken = () => randomBytes(32).toString("base64url");

const toIsoString = (date: Date | null) => date?.toISOString() ?? null;

const toBusinessTeamMember = (
  row: BusinessTeamMemberAccessRow,
): BusinessTeamMember => {
  const isActive = Boolean(row.userId);
  const isInvited = Boolean(row.invitationId);

  return {
    access: {
      acceptedAt: toIsoString(row.acceptedAt),
      email: row.invitationEmail ?? row.email ?? "",
      expiresAt: toIsoString(row.expiresAt),
      invitationId: row.invitationId,
      status: isActive ? "ACTIVE" : isInvited ? "INVITED" : "NO_ACCESS",
    },
    email: row.email ?? "",
    fullName: row.fullName,
    id: row.id,
    providesServices: row.providesServices,
    role: row.role as BusinessTeamMemberRole,
  };
};

const toBusinessTeamResponse = (
  rows: BusinessTeamMemberAccessRow[],
): BusinessTeamResponse => ({
  teamMembers: rows.map(toBusinessTeamMember),
});

const getBusinessTeam = async (user: AuthUser) => {
  assertCanManageBusinessTeam(user);

  const teamMembers = await findBusinessTeamMembers(user.businessId);

  return toBusinessTeamResponse(teamMembers);
};

const createBusinessTeamInvitation = async ({
  inviteBaseUrl,
  teamMemberId,
  user,
  values,
}: {
  inviteBaseUrl: string;
  teamMemberId: string;
  user: AuthUser;
  values: CreateBusinessTeamInvitationRequest;
}): Promise<CreateBusinessTeamInvitationResponse> => {
  assertCanManageBusinessTeam(user);

  const [teamMember] = await findTeamMemberById({
    businessId: user.businessId,
    teamMemberId,
  });

  if (!teamMember) {
    throw new ApiError(404, "Nie znaleziono członka zespołu.");
  }

  if (teamMember.userId) {
    throw new ApiError(409, "Ten członek zespołu ma już aktywny dostęp.");
  }

  const email = normalizeEmail(values.email) || normalizeEmail(teamMember.email);

  if (!email) {
    throw new ApiError(400, "Podaj adres e-mail do wysłania zaproszenia.");
  }

  if (email === normalizeEmail(user.email)) {
    throw new ApiError(409, "Właściciel jest już częścią zespołu.");
  }

  const [duplicateMember] = await findTeamMemberByEmail({
    businessId: user.businessId,
    email,
    excludedTeamMemberId: teamMemberId,
  });

  if (duplicateMember) {
    throw new ApiError(
      409,
      "Ten adres e-mail jest już przypisany do członka zespołu.",
    );
  }

  const token = createInvitationToken();
  const invitationId = randomUUID();
  const expiresAt = new Date(
    Date.now() + invitationValidityDays * 24 * 60 * 60 * 1000,
  );

  await createTeamInvitation({
    email,
    expiresAt,
    invitationId,
    teamMemberId,
    tokenHash: hashInvitationToken(token),
  });

  const teamMembers = await findBusinessTeamMembers(user.businessId);

  return {
    invitation: {
      email,
      expiresAt: expiresAt.toISOString(),
      id: invitationId,
      inviteUrl: `${inviteBaseUrl}/team-invitations/${token}`,
      teamMemberId,
      token,
    },
    teamMembers: teamMembers.map(toBusinessTeamMember),
  };
};

const cancelBusinessTeamInvitation = async ({
  invitationId,
  user,
}: {
  invitationId: string;
  user: AuthUser;
}) => {
  assertCanManageBusinessTeam(user);

  await cancelTeamInvitation({
    businessId: user.businessId,
    invitationId,
  });

  const teamMembers = await findBusinessTeamMembers(user.businessId);

  return toBusinessTeamResponse(teamMembers);
};

const getInvitationStatus = (invitation: BusinessTeamInvitationRow) => {
  if (invitation.acceptedAt) {
    return "ACCEPTED";
  }

  if (invitation.cancelledAt) {
    return "CANCELLED";
  }

  if (invitation.expiresAt.getTime() <= Date.now()) {
    return "EXPIRED";
  }

  return "PENDING";
};

const getBusinessTeamInvitationPreview = async (
  token: string,
): Promise<BusinessTeamInvitationPreview> => {
  const [invitation] = await findInvitationByTokenHash(
    hashInvitationToken(token),
  );

  if (!invitation) {
    throw new ApiError(404, "Nie znaleziono zaproszenia.");
  }

  return {
    businessName: invitation.businessName,
    email: invitation.email,
    expiresAt: invitation.expiresAt.toISOString(),
    fullName: invitation.fullName,
    role: invitation.role as BusinessTeamMemberRole,
    status: getInvitationStatus(invitation),
  };
};

const acceptBusinessTeamInvitation = async ({
  token,
  user,
}: {
  token: string;
  user: AuthUser;
}) => {
  const [invitation] = await findInvitationByTokenHash(
    hashInvitationToken(token),
  );

  if (!invitation) {
    throw new ApiError(404, "Nie znaleziono zaproszenia.");
  }

  if (getInvitationStatus(invitation) !== "PENDING") {
    throw new ApiError(409, "Zaproszenie nie jest już aktywne.");
  }

  if (invitation.businessId !== user.businessId) {
    throw new ApiError(403, "Zaproszenie dotyczy innego biznesu.");
  }

  if (normalizeEmail(invitation.email) !== normalizeEmail(user.email)) {
    throw new ApiError(403, "Zaproszenie dotyczy innego adresu e-mail.");
  }

  if (invitation.userId && invitation.userId !== user.id) {
    throw new ApiError(409, "Ten profil zespołu jest już połączony z kontem.");
  }

  await acceptTeamInvitation({
    businessId: invitation.businessId,
    invitationId: invitation.id,
    providesServices: invitation.providesServices,
    role: invitation.role as BusinessTeamMemberRole,
    teamMemberId: invitation.teamMemberId,
    userId: user.id,
  });

  const [teamMember] = await findTeamMemberById({
    businessId: user.businessId,
    teamMemberId: invitation.teamMemberId,
  });

  if (!teamMember) {
    throw new ApiError(404, "Nie znaleziono członka zespołu.");
  }

  return {
    teamMember: toBusinessTeamMember(teamMember),
  };
};

export {
  acceptBusinessTeamInvitation,
  cancelBusinessTeamInvitation,
  createBusinessTeamInvitation,
  getBusinessTeam,
  getBusinessTeamInvitationPreview,
};
