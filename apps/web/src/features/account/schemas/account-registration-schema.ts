import { z } from "zod"

import { customerDetailsSchema } from "@/features/booking/schemas/customer-details-schema"

const minimumBirthYear = 1900

const isValidBirthDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day || year < minimumBirthYear) {
    return false
  }

  const date = new Date(year, month - 1, day)
  const today = new Date()
  const currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= currentDay
  )
}

const accountRegistrationSchema = customerDetailsSchema
  .pick({
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
  })
  .extend({
    birthDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Podaj datę urodzenia.")
      .refine(isValidBirthDate, "Podaj poprawną datę urodzenia."),
    confirmPassword: z.string().min(8, "Hasło musi mieć minimum 8 znaków."),
    email: customerDetailsSchema.shape.email.refine(Boolean, "Podaj poprawny adres e-mail"),
    password: z.string().min(8, "Hasło musi mieć minimum 8 znaków."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Hasła muszą być takie same.",
    path: ["confirmPassword"],
  })

type AccountRegistrationValues = z.infer<typeof accountRegistrationSchema>

export { accountRegistrationSchema }
export type { AccountRegistrationValues }
