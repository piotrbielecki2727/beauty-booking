import { randomBytes } from "node:crypto";

import {
  emailSchema,
  passwordSchema,
  type AccountRole,
} from "@beauty-booking/shared";

import { prisma } from "@/db/prisma";
import { hashPassword } from "@/utils/password";

type CreateBusinessOwnerConfig = {
  businessDomains: string[];
  businessName: string;
  businessSlug: string;
  ownerEmail: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPassword: string;
  ownerPhone: string | null;
  shouldPrintPassword: boolean;
};

export type CreateBusinessOwnerLocalConfig = Omit<
  CreateBusinessOwnerConfig,
  "ownerPassword" | "shouldPrintPassword"
> & {
  ownerPassword?: string;
};

const ownerRole = "Owner" satisfies AccountRole;
const localConfigModulePath = "./createBusinessOwner.config.local";

const getRequiredEnv = (key: string) => {
  const value = process.env[key]?.trim();

  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }

  return value;
};

const normalizeHostname = (value: string) => {
  const rawValue = value.trim().toLowerCase();

  if (!rawValue) {
    return "";
  }

  try {
    return new URL(
      rawValue.includes("://") ? rawValue : `https://${rawValue}`,
    ).hostname;
  } catch {
    return rawValue.split("/")[0]?.split(":")[0] ?? rawValue;
  }
};

const parseBusinessDomains = (value: string) => {
  const domains = value
    .split(",")
    .map(normalizeHostname)
    .filter(Boolean);

  return [...new Set(domains)];
};

const normalizeBusinessDomains = (domains: string[]) => {
  const normalizedDomains = domains.map(normalizeHostname).filter(Boolean);

  return [...new Set(normalizedDomains)];
};

const getRequiredConfigValue = (key: string, value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    throw new Error(`Missing required config value: ${key}`);
  }

  return trimmedValue;
};

const generateTemporaryPassword = () => {
  const password = `${randomBytes(12).toString("base64url")}Aa1!`;
  const result = passwordSchema.safeParse(password);

  if (!result.success) {
    throw new Error("Generated temporary password does not match policy.");
  }

  return password;
};

const readLocalConfig = async () => {
  try {
    const module = (await import(localConfigModulePath)) as {
      createBusinessOwnerConfig?: CreateBusinessOwnerLocalConfig;
    };

    return module.createBusinessOwnerConfig ?? null;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message.includes("Cannot find module")
    ) {
      return null;
    }

    throw error;
  }
};

const readEnvConfig = () => {
  const ownerPassword = process.env.OWNER_PASSWORD?.trim();
  const finalPassword = ownerPassword || generateTemporaryPassword();
  const businessDomains = parseBusinessDomains(
    getRequiredEnv("BUSINESS_DOMAINS"),
  );

  if (!businessDomains.length) {
    throw new Error("BUSINESS_DOMAINS must contain at least one hostname.");
  }

  const ownerEmail = emailSchema.parse(getRequiredEnv("OWNER_EMAIL"));
  passwordSchema.parse(finalPassword);

  return {
    businessDomains,
    businessName: getRequiredEnv("BUSINESS_NAME"),
    businessSlug: getRequiredEnv("BUSINESS_SLUG"),
    ownerEmail,
    ownerFirstName: getRequiredEnv("OWNER_FIRST_NAME"),
    ownerLastName: getRequiredEnv("OWNER_LAST_NAME"),
    ownerPassword: finalPassword,
    ownerPhone: process.env.OWNER_PHONE?.trim() || null,
    shouldPrintPassword: !ownerPassword,
  } satisfies CreateBusinessOwnerConfig;
};

const readConfig = async () => {
  const localConfig = await readLocalConfig();

  if (!localConfig) {
    return readEnvConfig();
  }

  const ownerPassword = localConfig.ownerPassword?.trim();
  const finalPassword = ownerPassword || generateTemporaryPassword();
  const businessDomains = normalizeBusinessDomains(
    localConfig.businessDomains,
  );

  if (!businessDomains.length) {
    throw new Error("businessDomains must contain at least one hostname.");
  }

  const ownerEmail = emailSchema.parse(
    getRequiredConfigValue("ownerEmail", localConfig.ownerEmail),
  );

  passwordSchema.parse(finalPassword);

  return {
    businessDomains,
    businessName: getRequiredConfigValue(
      "businessName",
      localConfig.businessName,
    ),
    businessSlug: getRequiredConfigValue(
      "businessSlug",
      localConfig.businessSlug,
    ),
    ownerEmail,
    ownerFirstName: getRequiredConfigValue(
      "ownerFirstName",
      localConfig.ownerFirstName,
    ),
    ownerLastName: getRequiredConfigValue(
      "ownerLastName",
      localConfig.ownerLastName,
    ),
    ownerPassword: finalPassword,
    ownerPhone: localConfig.ownerPhone?.trim() || null,
    shouldPrintPassword: !ownerPassword,
  } satisfies CreateBusinessOwnerConfig;
};

const assertDomainOwnership = async (
  businessSlug: string,
  hostnames: string[],
) => {
  const existingDomains = await prisma.businessDomain.findMany({
    select: {
      business: {
        select: {
          slug: true,
        },
      },
      hostname: true,
    },
    where: {
      hostname: {
        in: hostnames,
      },
    },
  });

  const conflictingDomain = existingDomains.find(
    (domain) => domain.business.slug !== businessSlug,
  );

  if (conflictingDomain) {
    throw new Error(
      `Domain ${conflictingDomain.hostname} is already assigned to ${conflictingDomain.business.slug}.`,
    );
  }
};

const createBusinessOwner = async (config: CreateBusinessOwnerConfig) => {
  await assertDomainOwnership(config.businessSlug, config.businessDomains);

  const passwordHash = await hashPassword(config.ownerPassword);
  const acceptedAt = new Date();

  return prisma.$transaction(async (tx) => {
    const business = await tx.business.upsert({
      create: {
        name: config.businessName,
        slug: config.businessSlug,
      },
      update: {
        name: config.businessName,
      },
      where: {
        slug: config.businessSlug,
      },
    });

    await Promise.all(
      config.businessDomains.map((hostname, index) =>
        tx.businessDomain.upsert({
          create: {
            businessId: business.id,
            hostname,
            isPrimary: index === 0,
          },
          update: {
            businessId: business.id,
            isPrimary: index === 0,
          },
          where: {
            hostname,
          },
        }),
      ),
    );

    const owner = await tx.user.upsert({
      create: {
        businessId: business.id,
        email: config.ownerEmail,
        emailVerifiedAt: acceptedAt,
        firstName: config.ownerFirstName,
        lastName: config.ownerLastName,
        passwordHash,
        phone: config.ownerPhone,
        role: ownerRole,
        termsAndPrivacyPolicyAcceptedAt: acceptedAt,
      },
      update: {
        emailVerifiedAt: acceptedAt,
        firstName: config.ownerFirstName,
        lastName: config.ownerLastName,
        passwordHash,
        phone: config.ownerPhone,
        role: ownerRole,
        termsAndPrivacyPolicyAcceptedAt: acceptedAt,
      },
      where: {
        businessId_email: {
          businessId: business.id,
          email: config.ownerEmail,
        },
      },
    });

    await tx.businessMembership.upsert({
      create: {
        businessId: business.id,
        role: ownerRole,
        userId: owner.id,
      },
      update: {
        role: ownerRole,
      },
      where: {
        businessId_userId: {
          businessId: business.id,
          userId: owner.id,
        },
      },
    });

    return {
      business,
      owner,
    };
  });
};

const main = async () => {
  const config = await readConfig();
  const { business, owner } = await createBusinessOwner(config);

  console.log("Business owner provisioning completed.");
  console.log(`Business: ${business.name} (${business.slug})`);
  console.log(`Domains: ${config.businessDomains.join(", ")}`);
  console.log(`Owner: ${owner.email}`);

  if (config.shouldPrintPassword) {
    console.log(`Temporary owner password: ${config.ownerPassword}`);
  }
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
