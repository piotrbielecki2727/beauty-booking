import {
  defaultAccountRole,
  type AccountLoginValues,
  type AuthRegistrationFlowResponse,
  type AuthRegistrationTokenRequest,
  type AuthRegisterRequest,
  type AuthResponse,
  type AuthVerifyEmailRequest,
  type AuthVerifyEmailResponse,
} from "@beauty-booking/shared";
import type { User } from "@prisma/client";

import {
  generateEmailVerificationCode,
  sendVerificationEmail,
} from "@/modules/auth/emailVerification.adapter";
import {
  countEmailVerificationCodes,
  countEmailVerificationFailedAttempts,
  createEmailVerificationCode,
  findLatestActiveEmailVerificationCode,
  findLatestUnusedEmailVerificationCode,
  incrementEmailVerificationFailedAttempts,
  markEmailVerificationCodeUsed,
  markUnusedEmailVerificationCodesUsed,
} from "@/modules/auth/emailVerification.repository";
import { toAuthUser } from "@/modules/users/user.mapper";
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findUserById,
  markUserEmailVerified,
} from "@/modules/users/user.repository";
import { ApiError } from "@/utils/apiError";
import { hashVerificationCode } from "@/utils/codeHash";
import { hashPassword, verifyPassword } from "@/utils/password";
import {
  signAccessToken,
  signRegistrationToken,
  verifyRegistrationToken,
} from "@/utils/tokens";

const registrationTtlMs = 15 * 60 * 1000;
const maxRegistrationResends = 2;
const maxVerificationFailedAttempts = 3;
const resendCooldownMs = 60 * 1000;

const parseOptionalBirthDate = (birthDate: string) =>
  birthDate ? new Date(`${birthDate}T00:00:00.000Z`) : null;

const buildAuthResponse = (
  user: ReturnType<typeof toAuthUser>,
): AuthResponse => ({
  tokens: {
    accessToken: signAccessToken(user),
  },
  user,
});

const getRegistrationExpiresAt = (user: User) =>
  new Date(user.createdAt.getTime() + registrationTtlMs);

const isRegistrationExpired = (user: User) =>
  getRegistrationExpiresAt(user).getTime() <= Date.now();

const expirePendingRegistration = async (
  user: User,
): Promise<AuthRegistrationFlowResponse> => {
  await deleteUserById(user.id);

  return {
    email: user.email,
    status: "REGISTRATION_EXPIRED",
    verificationRequired: false,
  };
};

const buildRegistrationResponse = async (
  user: User,
): Promise<AuthRegistrationFlowResponse> => {
  if (user.emailVerifiedAt) {
    return {
      email: user.email,
      status: "VERIFIED",
      verificationRequired: false,
    };
  }

  if (isRegistrationExpired(user)) {
    return expirePendingRegistration(user);
  }

  const latestCode = await findLatestUnusedEmailVerificationCode(user.id);
  const now = Date.now();

  if (!latestCode || latestCode.expiresAt.getTime() <= now) {
    return expirePendingRegistration(user);
  }

  const codeCount = await countEmailVerificationCodes(user.id);
  const remainingResends = Math.max(
    0,
    maxRegistrationResends - Math.max(0, codeCount - 1),
  );
  const resendAllowedAt = new Date(
    latestCode.createdAt.getTime() + resendCooldownMs,
  );

  return {
    canResendAt:
      remainingResends > 0 && resendAllowedAt.getTime() > now
        ? resendAllowedAt.toISOString()
        : null,
    codeExpiresAt: latestCode.expiresAt.toISOString(),
    email: user.email,
    remainingResends,
    registrationExpiresAt: getRegistrationExpiresAt(user).toISOString(),
    registrationToken: signRegistrationToken(user.id),
    status: "PENDING",
    verificationRequired: true,
  };
};

const createAndSendVerificationCode = async (user: User) => {
  const code = generateEmailVerificationCode();

  await markUnusedEmailVerificationCodesUsed(user.id);
  await createEmailVerificationCode({
    codeHash: hashVerificationCode(code),
    expiresAt: getRegistrationExpiresAt(user),
    userId: user.id,
  });
  await sendVerificationEmail({
    code,
    email: user.email,
    firstName: user.firstName,
  });
};

const createPendingUser = async (
  values: AuthRegisterRequest,
  businessId: string,
) => {
  const passwordHash = await hashPassword(values.password);
  const acceptedAt = new Date();

  return createUser({
    birthDate: parseOptionalBirthDate(values.birthDate),
    businessId,
    email: values.email,
    firstName: values.firstName,
    lastName: values.lastName,
    passwordHash,
    phone: values.phone || null,
    role: defaultAccountRole,
    termsAndPrivacyPolicyAcceptedAt: acceptedAt,
  });
};

const getUserFromRegistrationToken = async (registrationToken: string) => {
  const tokenResult = verifyRegistrationToken(registrationToken);

  if (tokenResult.status !== "valid") {
    return {
      status:
        tokenResult.status === "expired"
          ? "REGISTRATION_EXPIRED"
          : "INVALID",
      verificationRequired: false,
    } satisfies AuthRegistrationFlowResponse;
  }

  const user = await findUserById(tokenResult.userId);

  if (!user) {
    return {
      status: "INVALID",
      verificationRequired: false,
    } satisfies AuthRegistrationFlowResponse;
  }

  return user;
};

const register = async (values: AuthRegisterRequest, businessId: string) => {
  const existingUser = await findUserByEmail({
    businessId,
    email: values.email,
  });

  if (existingUser) {
    if (existingUser.emailVerifiedAt) {
      throw new ApiError(409, "Konto z tym adresem e-mail już istnieje.");
    }

    if (!isRegistrationExpired(existingUser)) {
      return buildRegistrationResponse(existingUser);
    }

    await deleteUserById(existingUser.id);
  }

  const user = await createPendingUser(values, businessId);

  await createAndSendVerificationCode(user);

  return buildRegistrationResponse(user);
};

const resumeRegistration = async ({
  registrationToken,
}: AuthRegistrationTokenRequest) => {
  const userOrStatus = await getUserFromRegistrationToken(registrationToken);

  if ("status" in userOrStatus) {
    return userOrStatus;
  }

  return buildRegistrationResponse(userOrStatus);
};

const cancelRegistration = async ({
  registrationToken,
}: AuthRegistrationTokenRequest) => {
  const userOrStatus = await getUserFromRegistrationToken(registrationToken);

  if ("status" in userOrStatus || userOrStatus.emailVerifiedAt) {
    return;
  }

  await deleteUserById(userOrStatus.id);
};

const resendRegistrationCode = async ({
  registrationToken,
}: AuthRegistrationTokenRequest) => {
  const userOrStatus = await getUserFromRegistrationToken(registrationToken);

  if ("status" in userOrStatus) {
    throw new ApiError(400, "Nie można wznowić tej rejestracji.");
  }

  if (userOrStatus.emailVerifiedAt) {
    return buildRegistrationResponse(userOrStatus);
  }

  if (isRegistrationExpired(userOrStatus)) {
    return expirePendingRegistration(userOrStatus);
  }

  const codeCount = await countEmailVerificationCodes(userOrStatus.id);
  const remainingResends = Math.max(
    0,
    maxRegistrationResends - Math.max(0, codeCount - 1),
  );

  if (remainingResends === 0) {
    throw new ApiError(
      429,
      "Limit ponownych wysyłek kodu został wykorzystany.",
    );
  }

  const latestCode = await findLatestUnusedEmailVerificationCode(
    userOrStatus.id,
  );
  const canResendAt = latestCode
    ? new Date(latestCode.createdAt.getTime() + resendCooldownMs)
    : null;

  if (canResendAt && canResendAt.getTime() > Date.now()) {
    throw new ApiError(
      429,
      "Nowy kod możesz wysłać za chwilę. Spróbuj ponownie później.",
    );
  }

  await createAndSendVerificationCode(userOrStatus);

  return buildRegistrationResponse(userOrStatus);
};

const buildVerifyEmailResponse = (user: User): AuthVerifyEmailResponse => ({
  email: user.email,
  status: "VERIFIED",
  verificationRequired: false,
});

const verifyEmail = async (
  values: AuthVerifyEmailRequest,
): Promise<AuthVerifyEmailResponse> => {
  const userOrStatus = await getUserFromRegistrationToken(
    values.registrationToken,
  );

  if ("status" in userOrStatus) {
    if (userOrStatus.status === "REGISTRATION_EXPIRED") {
      throw new ApiError(
        410,
        "Czas na potwierdzenie rejestracji minął. Rozpocznij rejestrację ponownie.",
      );
    }

    throw new ApiError(400, "Nie można potwierdzić tej rejestracji.");
  }

  const user = userOrStatus;

  if (user.emailVerifiedAt) {
    return buildVerifyEmailResponse(user);
  }

  if (isRegistrationExpired(user)) {
    await deleteUserById(user.id);
    throw new ApiError(
      410,
      "Czas na potwierdzenie rejestracji minął. Rozpocznij rejestrację ponownie.",
    );
  }

  const verificationCode = await findLatestActiveEmailVerificationCode(user.id);

  if (!verificationCode) {
    await deleteUserById(user.id);
    throw new ApiError(
      410,
      "Czas na potwierdzenie rejestracji minął. Rozpocznij rejestrację ponownie.",
    );
  }

  if (verificationCode.codeHash !== hashVerificationCode(values.code)) {
    const failedAttempts =
      (await countEmailVerificationFailedAttempts(user.id)) + 1;

    await incrementEmailVerificationFailedAttempts(verificationCode.id);

    if (failedAttempts >= maxVerificationFailedAttempts) {
      await deleteUserById(user.id);
      throw new ApiError(
        410,
        "Przekroczono limit prób potwierdzenia. Rozpocznij rejestrację ponownie.",
      );
    }

    throw new ApiError(400, "Kod jest nieprawidłowy albo wygasł.");
  }

  await markEmailVerificationCodeUsed(verificationCode.id);
  const verifiedUser = await markUserEmailVerified(user.id);

  return buildVerifyEmailResponse(verifiedUser);
};

const login = async (values: AccountLoginValues, businessId: string) => {
  const user = await findUserByEmail({
    businessId,
    email: values.email,
  });

  if (!user || !(await verifyPassword(values.password, user.passwordHash))) {
    throw new ApiError(401, "Nieprawidłowy e-mail lub hasło.");
  }

  if (!user.emailVerifiedAt) {
    throw new ApiError(403, "Potwierdź adres e-mail przed logowaniem.");
  }

  return buildAuthResponse(toAuthUser(user));
};

const getCurrentUser = async (userId: string) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new ApiError(401, "Sesja jest nieaktualna.");
  }

  return toAuthUser(user);
};

export {
  cancelRegistration,
  getCurrentUser,
  login,
  register,
  resendRegistrationCode,
  resumeRegistration,
  verifyEmail,
};
