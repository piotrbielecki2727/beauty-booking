import { z } from "zod";

import { accountRoleSchema } from "../roles";

const minimumBirthYear = 1900;
const namePattern = /^[\p{L}\p{M}'’ -]+$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uppercaseLetterPattern = /\p{Lu}/u;
const lowercaseLetterPattern = /\p{Ll}/u;
const digitPattern = /\d/;
const specialCharacterPattern = /[^\p{L}\p{N}\s]/u;
const acceptedConsentSchema = (message: string) =>
  z.boolean(message).refine((value) => value, message);

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Podaj adres e-mail.")
  .max(254, "Podaj poprawny adres e-mail")
  .refine((value) => emailPattern.test(value), "Podaj poprawny adres e-mail");

export const passwordSchema = z
  .string()
  .min(8, "Hasło musi mieć minimum 8 znaków.")
  .regex(lowercaseLetterPattern, "Hasło musi zawierać małą literę.")
  .regex(uppercaseLetterPattern, "Hasło musi zawierać wielką literę.")
  .regex(digitPattern, "Hasło musi zawierać cyfrę.")
  .regex(specialCharacterPattern, "Hasło musi zawierać znak specjalny.");

const confirmPasswordSchema = z.string().min(1, "Powtórz hasło.");

export const publicAccountSchema = z.object({
  birthDate: z.string(),
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
  acceptPrivacyPolicy: acceptedConsentSchema(
    "Zaakceptuj politykę prywatności.",
  ),
  acceptTerms: acceptedConsentSchema("Zaakceptuj regulamin."),
  birthDate: z
    .string()
    .refine(
      (value) => value === "" || isValidBirthDate(value),
      "Podaj poprawną datę urodzenia.",
    ),
  email: emailSchema,
  firstName: z
    .string()
    .trim()
    .min(2, "Imię musi mieć minimum 2 znaki.")
    .max(40, "Imię może mieć maksymalnie 40 znaków.")
    .regex(namePattern, "Imię może zawierać litery, spacje, apostrof i myślnik."),
  lastName: z
    .string()
    .trim()
    .min(2, "Nazwisko musi mieć minimum 2 znaki.")
    .max(40, "Nazwisko może mieć maksymalnie 40 znaków.")
    .regex(
      namePattern,
      "Nazwisko może zawierać litery, spacje, apostrof i myślnik.",
    ),
  password: passwordSchema,
  phone: z
    .string()
    .refine(
      (value) => value === "" || /^\d{9}$/.test(value),
      "Podaj poprawny numer telefonu, 9 cyfr.",
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
      message: "Hasła muszą być takie same.",
      path: ["confirmPassword"],
    });
  });

export const accountVerificationCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Wpisz 6-cyfrowy kod z e-maila."),
});

export type AccountRegistrationValues = z.infer<typeof accountRegistrationSchema>;
export type AccountVerificationCodeValues = z.infer<
  typeof accountVerificationCodeSchema
>;
