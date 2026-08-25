import { z } from "zod";

const addonNameRegex = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż0-9 -]{2,60}$/u;

export const businessServiceAddonFormItemSchema = z.object({
  durationMinutes: z
    .string()
    .trim()
    .regex(/^\d{1,3}$/, "validation.business.addons.durationInvalid")
    .refine(
      (value) => Number(value) >= 0 && Number(value) <= 600,
      "validation.business.addons.durationMax",
    ),
  id: z.string().optional(),
  isActive: z.boolean(),
  name: z
    .string()
    .trim()
    .min(2, "validation.business.addons.nameMinLength")
    .max(60, "validation.business.addons.nameMaxLength")
    .regex(addonNameRegex, "validation.business.addons.nameInvalid"),
  price: z
    .string()
    .trim()
    .regex(
      /^\d{1,4}([,.]\d{1,2})?$/,
      "validation.business.addons.priceInvalid",
    )
    .refine(
      (value) => Number(value.replace(",", ".")) <= 9999.99,
      "validation.business.addons.priceMax",
    ),
  serviceId: z.string().min(1, "validation.business.addons.serviceRequired"),
});

export const businessAddonsFormSchema = z.object({
  addons: z
    .array(businessServiceAddonFormItemSchema)
    .max(300, "validation.business.addons.maxItems"),
});

export type BusinessAddonsForm = z.infer<typeof businessAddonsFormSchema>;
export type BusinessServiceAddonFormItem = z.infer<
  typeof businessServiceAddonFormItemSchema
>;
