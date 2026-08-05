import { z } from "zod"

const managerLoginSchema = z.object({
  email: z.string().trim().email("Podaj poprawny adres e-mail."),
  password: z.string().min(1, "Podaj hasło."),
})

type ManagerLoginValues = z.infer<typeof managerLoginSchema>

export { managerLoginSchema }
export type { ManagerLoginValues }
