import { z } from "zod"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const accountLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Podaj adres e-mail.")
    .max(254, "Podaj poprawny adres e-mail")
    .refine((value) => emailPattern.test(value), "Podaj poprawny adres e-mail"),
  password: z.string().min(1, "Podaj hasło."),
})

type AccountLoginValues = z.infer<typeof accountLoginSchema>

export { accountLoginSchema }
export type { AccountLoginValues }