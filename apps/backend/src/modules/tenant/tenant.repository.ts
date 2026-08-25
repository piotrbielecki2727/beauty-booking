import { prisma } from "@/db/prisma";

const tenantBusinessSelect = {
  id: true,
  name: true,
  slug: true,
} as const;

const findTenantBusinessByHostname = (hostname: string) =>
  prisma.businessDomain.findUnique({
    select: {
      business: {
        select: tenantBusinessSelect,
      },
    },
    where: {
      hostname,
    },
  });

const findTenantBusinessBySlug = (slug: string) =>
  prisma.business.findUnique({
    select: tenantBusinessSelect,
    where: {
      slug,
    },
  });

export { findTenantBusinessByHostname, findTenantBusinessBySlug };
