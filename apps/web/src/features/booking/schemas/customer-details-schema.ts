import { z } from "zod"

const namePattern = /^[\p{L}][\p{L}\s'-]*$/u
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const customerDetailsSchema = z.object({
  email: z
    .string()
    .trim()
    .max(254, "Podaj poprawny adres e-mail")
    .refine((value) => {
      if (!value) {
        return true
      }

      const [localPart = "", domainPart = ""] = value.split("@")

      return localPart.length <= 64 && domainPart.length <= 253 && emailPattern.test(value)
    }, "Podaj poprawny adres e-mail"),
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
  note: z.string().max(500, "Notatka może mieć maksymalnie 500 znaków."),
  phone: z.string().regex(/^\d{9}$/, "Podaj poprawny numer telefonu, 9 cyfr."),
})

type BookingCustomerDetails = z.infer<typeof customerDetailsSchema>

const emptyCustomerDetails: BookingCustomerDetails = {
  email: "",
  firstName: "",
  lastName: "",
  note: "",
  phone: "",
}

export { customerDetailsSchema, emptyCustomerDetails }
export type { BookingCustomerDetails }
