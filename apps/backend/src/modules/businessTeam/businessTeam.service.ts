import { createHash, randomBytes, randomUUID } from "crypto";

import {
  canManageSalonSettings,
  type AuthUser,
  type BusinessTeamInvitationPreview,
  type BusinessTeamMember,
  type BusinessTeamMemberListStatus,
  type BusinessTeamMemberRole,
  type BusinessTeamResponse,
  type CreateBusinessTeamMemberRequest,
  type CreateBusinessTeamInvitationResponse,
  type UpdateBusinessTeamMemberRequest,
  type UpdateBusinessTeamOwnerRequest,
} from "@beauty-booking/shared";

import {
  acceptTeamInvitation,
  cancelTeamInvitation,
  createTeamMember,
  createTeamInvitation,
  deactivateTeamMember,
  findActiveTeamInvitationByTeamMemberId,
  findBusinessTeamMembers,
  findInvitationByTokenHash,
  findOwnerTeamSettings,
  findTeamMemberByEmail,
  findTeamMemberById,
  reactivateTeamMember,
  updateOwnerTeamSettings,
  updateTeamMember,
  type BusinessTeamInvitationRow,
  type BusinessTeamMemberAccessRow,
} from "@/modules/businessTeam/businessTeam.repository";
import { ApiError } from "@/utils/apiError";

const teamInvitationValidityDays = 3;
const millisecondsInDay = 24 * 60 * 60 * 1000;
const invitationValidityMilliseconds =
  teamInvitationValidityDays * millisecondsInDay;
const technicalBirthdayYear = 2000;

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

const getBirthdayPartsFromDate = (date: Date | null) => ({
  birthdayDay: date ? date.getUTCDate() : null,
  birthdayMonth: date ? date.getUTCMonth() + 1 : null,
});

const getBirthdayDate = ({
  currentBirthDate,
  day,
  month,
}: {
  currentBirthDate: Date | null;
  day: number | null;
  month: number | null;
}) => {
  if (!day || !month) {
    return null;
  }

  const year = currentBirthDate?.getUTCFullYear() ?? technicalBirthdayYear;

  return new Date(Date.UTC(year, month - 1, day));
};

const getInviteUrl = (inviteBaseUrl: string, token: string) =>
  `${inviteBaseUrl}/team-invitations/${token}`;

const toBusinessTeamInvitation = ({
  createdAt,
  email,
  expiresAt,
  id,
  inviteBaseUrl,
  teamMemberId,
  token,
}: {
  createdAt: Date;
  email: string;
  expiresAt: Date;
  id: string;
  inviteBaseUrl: string;
  teamMemberId: string;
  token: string;
}): CreateBusinessTeamInvitationResponse["invitation"] => ({
  email,
  expiresAt: expiresAt.toISOString(),
  id,
  inviteUrl: getInviteUrl(inviteBaseUrl, token),
  sentAt: createdAt.toISOString(),
  teamMemberId,
});

const toBusinessTeamMember = (
  row: BusinessTeamMemberAccessRow,
  inviteBaseUrl: string,
): BusinessTeamMember => {
  const isActive = Boolean(row.userId);
  const isInvitationExpired =
    Boolean(row.invitationId) &&
    row.expiresAt !== null &&
    row.expiresAt.getTime() <= Date.now();
  const isInvited = Boolean(row.invitationId) && !isInvitationExpired;

  const access = (() => {
    if (isActive) {
      return {
        acceptedAt: toIsoString(row.acceptedAt),
        email: row.email,
        expiresAt: null,
        invitationId: null,
        inviteUrl: null,
        sentAt: null,
        status: "ACTIVE" as const,
      };
    }

    if (
      isInvited &&
      row.expiresAt &&
      row.invitationId &&
      row.invitationSentAt &&
      row.invitationToken
    ) {
      return {
        acceptedAt: null,
        email: row.invitationEmail ?? row.email ?? "",
        expiresAt: row.expiresAt.toISOString(),
        invitationId: row.invitationId,
        inviteUrl: getInviteUrl(inviteBaseUrl, row.invitationToken),
        sentAt: row.invitationSentAt.toISOString(),
        status: "INVITED" as const,
      };
    }

    if (
      isInvitationExpired &&
      row.expiresAt &&
      row.invitationId &&
      row.invitationSentAt
    ) {
      return {
        acceptedAt: null,
        email: row.invitationEmail ?? row.email ?? "",
        expiresAt: row.expiresAt.toISOString(),
        invitationId: row.invitationId,
        inviteUrl: null,
        sentAt: row.invitationSentAt.toISOString(),
        status: "EXPIRED" as const,
      };
    }

    return {
      acceptedAt: null,
      email: row.email,
      expiresAt: null,
      invitationId: null,
      inviteUrl: null,
      sentAt: null,
      status: "NO_ACCESS" as const,
    };
  })();

  return {
    access,
    birthdayDay: row.birthdayDay,
    birthdayMonth: row.birthdayMonth,
    createdAt: row.createdAt.toISOString(),
    deactivatedAt: toIsoString(row.deactivatedAt),
    email: row.email,
    fullName: row.fullName,
    id: row.id,
    phoneNumber: row.phoneNumber,
    providesServices: row.providesServices,
    role: row.role as BusinessTeamMemberRole,
  };
};

const toBusinessTeamResponse = ({
  inviteBaseUrl,
  owner,
  rows,
}: {
  inviteBaseUrl: string;
  owner: BusinessTeamResponse["owner"];
  rows: BusinessTeamMemberAccessRow[];
}): BusinessTeamResponse => ({
  owner,
  teamMembers: rows.map((row) => toBusinessTeamMember(row, inviteBaseUrl)),
});

const getOwnerTeamSettings = async (user: AuthUser) => {
  const ownerSettings = await findOwnerTeamSettings({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!ownerSettings) {
    throw new ApiError(404, "Nie znaleziono profilu właściciela.");
  }

  const { birthdayDay, birthdayMonth } = getBirthdayPartsFromDate(
    ownerSettings.user.birthDate,
  );
  const fullName =
    `${ownerSettings.user.firstName} ${ownerSettings.user.lastName}`.trim() ||
    ownerSettings.user.email;

  return {
    owner: {
      birthdayDay,
      birthdayMonth,
      email: ownerSettings.user.email,
      fullName,
      phoneNumber: ownerSettings.user.phone,
      providesServices: ownerSettings.providesServices ?? false,
    },
  };
};

const getBusinessTeamResponse = async ({
  inviteBaseUrl,
  listStatus,
  user,
}: {
  inviteBaseUrl: string;
  listStatus: BusinessTeamMemberListStatus;
  user: AuthUser;
}) => {
  const [teamMembers, ownerSettings] = await Promise.all([
    findBusinessTeamMembers({
      businessId: user.businessId,
      status: listStatus,
    }),
    getOwnerTeamSettings(user),
  ]);

  return toBusinessTeamResponse({
    inviteBaseUrl,
    ...ownerSettings,
    rows: teamMembers,
  });
};

const getBusinessTeam = async ({
  inviteBaseUrl,
  listStatus,
  user,
}: {
  inviteBaseUrl: string;
  listStatus: BusinessTeamMemberListStatus;
  user: AuthUser;
}) => {
  assertCanManageBusinessTeam(user);

  return getBusinessTeamResponse({ inviteBaseUrl, listStatus, user });
};

const getNormalizedTeamMemberValues = (
  values: CreateBusinessTeamMemberRequest | UpdateBusinessTeamMemberRequest,
) => ({
  birthdayDay: values.birthdayDay ?? null,
  birthdayMonth: values.birthdayMonth ?? null,
  email: normalizeEmail(values.email) || null,
  fullName: values.fullName.trim(),
  phoneNumber: values.phoneNumber?.trim() || null,
  providesServices: values.providesServices,
  role: values.role,
});

const getNormalizedOwnerValues = (
  values: UpdateBusinessTeamOwnerRequest,
  currentBirthDate: Date | null,
) => ({
  birthDate: getBirthdayDate({
    currentBirthDate,
    day: values.birthdayDay ?? null,
    month: values.birthdayMonth ?? null,
  }),
  phoneNumber: values.phoneNumber?.trim() || null,
  providesServices: values.providesServices,
});

const assertTeamMemberCanBeSaved = async ({
  currentMember,
  excludedTeamMemberId,
  normalizedEmail,
  user,
}: {
  currentMember?: BusinessTeamMemberAccessRow;
  excludedTeamMemberId?: string;
  normalizedEmail: string | null;
  user: AuthUser;
}) => {
  if (!normalizedEmail) {
    return;
  }

  if (normalizedEmail === normalizeEmail(user.email)) {
    throw new ApiError(409, "Właściciel jest już częścią zespołu.");
  }

  if (
    currentMember?.email &&
    normalizedEmail !== normalizeEmail(currentMember.email)
  ) {
    throw new ApiError(
      409,
      "Nie można zmienić adresu e-mail pracownika z aktywnym dostępem.",
    );
  }

  const [duplicateMember] = await findTeamMemberByEmail({
    businessId: user.businessId,
    email: normalizedEmail,
    excludedTeamMemberId,
  });

  if (duplicateMember) {
    throw new ApiError(
      409,
      "Ten adres e-mail jest już przypisany do członka zespołu.",
    );
  }
};

const createBusinessTeamMember = async ({
  user,
  values,
}: {
  user: AuthUser;
  values: CreateBusinessTeamMemberRequest;
}) => {
  assertCanManageBusinessTeam(user);

  const normalizedValues = getNormalizedTeamMemberValues(values);
  const teamMemberId = randomUUID();

  await assertTeamMemberCanBeSaved({
    normalizedEmail: normalizedValues.email,
    user,
  });

  await createTeamMember({
    businessId: user.businessId,
    teamMemberId,
    values: normalizedValues,
  });

  return {
    teamMemberId,
  };
};

const updateBusinessTeamMember = async ({
  teamMemberId,
  user,
  values,
}: {
  teamMemberId: string;
  user: AuthUser;
  values: UpdateBusinessTeamMemberRequest;
}) => {
  assertCanManageBusinessTeam(user);

  const [teamMember] = await findTeamMemberById({
    businessId: user.businessId,
    teamMemberId,
  });

  if (!teamMember) {
    throw new ApiError(404, "Nie znaleziono członka zespołu.");
  }

  if (teamMember.deactivatedAt) {
    throw new ApiError(409, "Nie można edytować zdezaktywowanego pracownika.");
  }

  const normalizedValues = getNormalizedTeamMemberValues(values);

  await assertTeamMemberCanBeSaved({
    currentMember: teamMember,
    excludedTeamMemberId: teamMemberId,
    normalizedEmail: normalizedValues.email,
    user,
  });

  await updateTeamMember({
    businessId: user.businessId,
    shouldCancelActiveInvitations:
      normalizeEmail(teamMember.email) !== normalizedValues.email,
    teamMemberId,
    userId: teamMember.userId,
    values: normalizedValues,
  });

  return {
    teamMemberId,
  };
};

const deactivateBusinessTeamMember = async ({
  teamMemberId,
  user,
}: {
  teamMemberId: string;
  user: AuthUser;
}) => {
  assertCanManageBusinessTeam(user);

  const [teamMember] = await findTeamMemberById({
    businessId: user.businessId,
    teamMemberId,
  });

  if (!teamMember) {
    throw new ApiError(404, "Nie znaleziono członka zespołu.");
  }

  await deactivateTeamMember({
    businessId: user.businessId,
    teamMemberId,
    userId: teamMember.userId,
  });

  return {
    teamMemberId,
  };
};

const reactivateBusinessTeamMember = async ({
  teamMemberId,
  user,
}: {
  teamMemberId: string;
  user: AuthUser;
}) => {
  assertCanManageBusinessTeam(user);

  const [teamMember] = await findTeamMemberById({
    businessId: user.businessId,
    teamMemberId,
  });

  if (!teamMember) {
    throw new ApiError(404, "Nie znaleziono członka zespołu.");
  }

  await reactivateTeamMember({
    businessId: user.businessId,
    teamMemberId,
    userId: teamMember.userId,
  });

  return {
    teamMemberId,
  };
};

const updateBusinessTeamOwner = async ({
  user,
  values,
}: {
  user: AuthUser;
  values: UpdateBusinessTeamOwnerRequest;
}) => {
  assertCanManageBusinessTeam(user);

  const ownerSettings = await findOwnerTeamSettings({
    businessId: user.businessId,
    userId: user.id,
  });

  if (!ownerSettings) {
    throw new ApiError(404, "Nie znaleziono profilu właściciela.");
  }

  await updateOwnerTeamSettings({
    businessId: user.businessId,
    userId: user.id,
    values: getNormalizedOwnerValues(values, ownerSettings.user.birthDate),
  });

  return {
    ok: true as const,
  };
};

const createBusinessTeamInvitation = async ({
  inviteBaseUrl,
  teamMemberId,
  user,
}: {
  inviteBaseUrl: string;
  teamMemberId: string;
  user: AuthUser;
}): Promise<CreateBusinessTeamInvitationResponse> => {
  assertCanManageBusinessTeam(user);

  const [teamMember] = await findTeamMemberById({
    businessId: user.businessId,
    teamMemberId,
  });

  if (!teamMember) {
    throw new ApiError(404, "Nie znaleziono członka zespołu.");
  }

  if (teamMember.deactivatedAt) {
    throw new ApiError(409, "Nie można zaprosić zdezaktywowanego pracownika.");
  }

  if (teamMember.userId) {
    throw new ApiError(409, "Ten członek zespołu ma już aktywny dostęp.");
  }

  const email = normalizeEmail(teamMember.email);

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

  const [activeInvitation] = await findActiveTeamInvitationByTeamMemberId({
    businessId: user.businessId,
    teamMemberId,
  });

  if (activeInvitation?.token) {
    return {
      invitation: toBusinessTeamInvitation({
        createdAt: activeInvitation.createdAt,
        email: activeInvitation.email,
        id: activeInvitation.id,
        expiresAt: activeInvitation.expiresAt,
        inviteBaseUrl,
        teamMemberId: activeInvitation.teamMemberId,
        token: activeInvitation.token,
      }),
    };
  }

  const token = createInvitationToken();
  const invitationId = randomUUID();
  const sentAt = new Date();
  const expiresAt = new Date(sentAt.getTime() + invitationValidityMilliseconds);

  await createTeamInvitation({
    businessId: user.businessId,
    createdAt: sentAt,
    email,
    expiresAt,
    invitationId,
    teamMemberId,
    token,
    tokenHash: hashInvitationToken(token),
  });

  return {
    invitation: toBusinessTeamInvitation({
      createdAt: sentAt,
      email,
      expiresAt,
      id: invitationId,
      inviteBaseUrl,
      teamMemberId,
      token,
    }),
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

  const cancelledInvitationsCount = await cancelTeamInvitation({
    businessId: user.businessId,
    invitationId,
  });

  if (cancelledInvitationsCount === 0) {
    throw new ApiError(404, "Nie znaleziono aktywnego zaproszenia.");
  }

  return {
    invitationId,
  };
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
    sentAt: invitation.createdAt.toISOString(),
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

  return {
    role: invitation.role as BusinessTeamMemberRole,
  };
};

export {
  acceptBusinessTeamInvitation,
  cancelBusinessTeamInvitation,
  createBusinessTeamMember,
  createBusinessTeamInvitation,
  deactivateBusinessTeamMember,
  getBusinessTeam,
  getBusinessTeamInvitationPreview,
  reactivateBusinessTeamMember,
  updateBusinessTeamOwner,
  updateBusinessTeamMember,
};
