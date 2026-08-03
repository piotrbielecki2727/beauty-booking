import { z } from "zod"

const verificationCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Wpisz 6-cyfrowy kod SMS."),
})

type VerificationCodeValues = z.infer<typeof verificationCodeSchema>

export { verificationCodeSchema }
export type { VerificationCodeValues }
