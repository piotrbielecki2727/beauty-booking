import { z } from "zod";

const accountVerificationCodeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Wpisz 6-cyfrowy kod z e-maila."),
});

type AccountVerificationCodeValues = z.infer<
  typeof accountVerificationCodeSchema
>;

export { accountVerificationCodeSchema };
export type { AccountVerificationCodeValues };
