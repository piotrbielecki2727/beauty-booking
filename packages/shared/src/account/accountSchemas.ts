import { z } from "zod";

import { accountRoleSchema } from "../roles";

const minimumBirthYear = 1900;
const namePattern = /^[\p{L}\p{M}'\u2019 -]+$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uppercaseLetterPattern = /\p{Lu}/u;
const lowercaseLetterPattern = /\p{Ll}/u;
const digitPattern = /\d/;
const specialCharacterPattern = /[^\p{L}\p{N}\s]/u;
const acceptedConsentSchema = (message: string) =>
  z.boolean(message).refine((value) => value, message);

export const accountValidationMessageKeys = {
  birthDate: {
    invalid: "validation.account.birthDate.invalid",
  },
  confirmPassword: {
    mismatch: "validation.account.confirmPassword.mismatch",
    required: "validation.account.confirmPassword.required",
  },
  consents: {
    termsAndPrivacyPolicy:
      "validation.account.consents.termsAndPrivacyPolicy",
  },
  email: {
    invalid: "validation.account.email.invalid",
    required: "validation.account.email.required",
  },
  firstName: {
    invalidCharacters: "validation.account.firstName.invalidCharacters",
    maxLength: "validation.account.firstName.maxLength",
    minLength: "validation.account.firstName.minLength",
  },
  lastName: {
    invalidCharacters: "validation.account.lastName.invalidCharacters",
    maxLength: "validation.account.lastName.maxLength",
    minLength: "validation.account.lastName.minLength",
  },
  password: {
    digit: "validation.account.password.digit",
    lowercase: "validation.account.password.lowercase",
    minLength: "validation.account.password.minLength",
    required: "validation.account.password.required",
    specialCharacter: "validation.account.password.specialCharacter",
    uppercase: "validation.account.password.uppercase",
  },
  phone: {
    invalid: "validation.account.phone.invalid",
  },
  verificationCode: {
    invalid: "validation.account.verificationCode.invalid",
  },
} as const;

export const emailSchema = z
  .string()
  .trim()
  .min(1, accountValidationMessageKeys.email.required)
  .max(254, accountValidationMessageKeys.email.invalid)
  .refine(
    (value) => emailPattern.test(value),
    accountValidationMessageKeys.email.invalid,
  );

export const passwordSchema = z
  .string()
  .min(8, accountValidationMessageKeys.password.minLength)
  .regex(lowercaseLetterPattern, accountValidationMessageKeys.password.lowercase)
  .regex(uppercaseLetterPattern, accountValidationMessageKeys.password.uppercase)
  .regex(digitPattern, accountValidationMessageKeys.password.digit)
  .regex(
    specialCharacterPattern,
    accountValidationMessageKeys.password.specialCharacter,
  );

const confirmPasswordSchema = z
  .string()
  .min(1, accountValidationMessageKeys.confirmPassword.required);

export const publicAccountSchema = z.object({
  birthDate: z.string(),
  businessId: z.string().uuid(),
  createdAt: z.string(),
  email: emailSchema,
  emailVerifiedAt: z.string().nullable(),
  firstName: z.string(),
  id: z.string(),
  lastName: z.string(),
  phone: z.string(),
  role: accountRoleSchema,
});

const isValidBirthDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day || year < minimumBirthYear) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  const today = new Date();
  const currentDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= currentDay
  );
};

export const accountRegistrationFieldsSchema = z.object({
  acceptTermsAndPrivacyPolicy: acceptedConsentSchema(
    accountValidationMessageKeys.consents.termsAndPrivacyPolicy,
  ),
  birthDate: z
    .string()
    .refine(
      (value) => value === "" || isValidBirthDate(value),
      accountValidationMessageKeys.birthDate.invalid,
    ),
  email: emailSchema,
  firstName: z
    .string()
    .trim()
    .min(2, accountValidationMessageKeys.firstName.minLength)
    .max(40, accountValidationMessageKeys.firstName.maxLength)
    .regex(
      namePattern,
      accountValidationMessageKeys.firstName.invalidCharacters,
    ),
  lastName: z
    .string()
    .trim()
    .min(2, accountValidationMessageKeys.lastName.minLength)
    .max(40, accountValidationMessageKeys.lastName.maxLength)
    .regex(
      namePattern,
      accountValidationMessageKeys.lastName.invalidCharacters,
    ),
  password: passwordSchema,
  phone: z
    .string()
    .refine(
      (value) => value === "" || /^\d{9}$/.test(value),
      accountValidationMessageKeys.phone.invalid,
    ),
});

export const accountRegistrationSchema = accountRegistrationFieldsSchema
  .extend({
    confirmPassword: confirmPasswordSchema,
  })
  .superRefine((values, context) => {
    if (!values.confirmPassword || values.password === values.confirmPassword) {
      return;
    }

    context.addIssue({
      code: "custom",
      message: accountValidationMessageKeys.confirmPassword.mismatch,
      path: ["confirmPassword"],
    });
  });

export const accountVerificationCodeSchema = z.object({
  code: z
    .string()
    .regex(/^\d{6}$/, accountValidationMessageKeys.verificationCode.invalid),
});

export type AccountRegistrationValues = z.infer<
  typeof accountRegistrationSchema
>;
export type AccountVerificationCodeValues = z.infer<
  typeof accountVerificationCodeSchema
>;
