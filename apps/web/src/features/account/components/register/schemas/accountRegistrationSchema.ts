import { z } from "zod";

const minimumBirthYear = 1900;
const namePattern = /^[\p{L}][\p{L}\s'-]*$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const accountRegistrationSchema = z
  .object({
    birthDate: z
      .string()
      .refine(
        (value) => value === "" || isValidBirthDate(value),
        "Podaj poprawną datę urodzenia.",
      ),
    confirmPassword: z.string().min(8, "Hasło musi mieć minimum 8 znaków."),
    email: z
      .string()
      .trim()
      .min(1, "Podaj adres e-mail.")
      .max(254, "Podaj poprawny adres e-mail")
      .refine(
        (value) => emailPattern.test(value),
        "Podaj poprawny adres e-mail",
      ),
    firstName: z
      .string()
      .trim()
      .min(2, "Imię musi mieć minimum 2 znaki.")
      .max(40, "Imię może mieć maksymalnie 40 znaków.")
      .regex(namePattern, "Imię może zawierać tylko litery."),
    lastName: z
      .string()
      .trim()
      .min(2, "Nazwisko musi mieć minimum 2 znaki.")
      .max(40, "Nazwisko może mieć maksymalnie 40 znaków.")
      .regex(namePattern, "Nazwisko może zawierać tylko litery."),
    password: z.string().min(8, "Hasło musi mieć minimum 8 znaków."),
    phone: z
      .string()
      .refine(
        (value) => value === "" || /^\d{9}$/.test(value),
        "Podaj poprawny numer telefonu, 9 cyfr.",
      ),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Hasła muszą być takie same.",
    path: ["confirmPassword"],
  });

type AccountRegistrationValues = z.infer<typeof accountRegistrationSchema>;

export { accountRegistrationSchema };
export type { AccountRegistrationValues };
