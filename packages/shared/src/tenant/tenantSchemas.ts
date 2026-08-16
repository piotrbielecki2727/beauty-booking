import { z } from "zod";

export const tenantBusinessSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
});

export const tenantContextResponseSchema = z.object({
  business: tenantBusinessSchema,
});

export type TenantBusiness = z.infer<typeof tenantBusinessSchema>;
export type TenantContextResponse = z.infer<
  typeof tenantContextResponseSchema
>;
