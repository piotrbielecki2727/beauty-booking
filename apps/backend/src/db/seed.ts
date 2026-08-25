import type { AccountRole } from "@beauty-booking/shared";

import { prisma } from "@/db/prisma";
import { hashPassword } from "@/utils/password";

type SeedUser = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: AccountRole;
};

type SeedBusiness = {
  domains: string[];
  name: string;
  slug: string;
  users: SeedUser[];
};

const seedBusinesses = [
  {
    domains: ["beauty-booking.localhost", "app.beautybooking.test"],
    name: "Beauty Booking",
    slug: "beauty-booking",
    users: [
      {
        email: "customer@beauty-booking.local",
        firstName: "Katarzyna",
        lastName: "Zielinska",
        phone: "501502503",
        role: "Customer",
      },
      {
        email: "owner@beauty-booking.local",
        firstName: "Anna",
        lastName: "Kowalska",
        phone: "501100200",
        role: "Owner",
      },
      {
        email: "admin@beauty-booking.local",
        firstName: "Natalia",
        lastName: "Admin",
        phone: "501200300",
        role: "Admin",
      },
      {
        email: "employee@beauty-booking.local",
        firstName: "Marta",
        lastName: "Nowak",
        phone: "501300400",
        role: "Employee",
      },
    ],
  },
  {
    domains: ["karolinakurandanails.localhost", "karolinakurandanails.com"],
    name: "Karolina Kuranda Nails",
    slug: "karolina-kuranda-nails",
    users: [
      {
        email: "owner@karolinakurandanails.local",
        firstName: "Karolina",
        lastName: "Kuranda",
        phone: "502100200",
        role: "Owner",
      },
      {
        email: "customer@karolinakurandanails.local",
        firstName: "Amelia",
        lastName: "Kowalska",
        phone: "502300400",
        role: "Customer",
      },
    ],
  },
  {
    domains: ["ateliermagnolia.localhost", "ateliermagnolia.pl"],
    name: "Atelier Magnolia",
    slug: "atelier-magnolia",
    users: [
      {
        email: "owner@ateliermagnolia.local",
        firstName: "Magdalena",
        lastName: "Wisniewska",
        phone: "503100200",
        role: "Owner",
      },
      {
        email: "employee@ateliermagnolia.local",
        firstName: "Oliwia",
        lastName: "Nowak",
        phone: "503300400",
        role: "Employee",
      },
    ],
  },
] satisfies SeedBusiness[];

const shouldCreateMembership = (role: AccountRole) => role !== "Customer";

const seed = async () => {
  const passwordHash = await hashPassword("Password123!");
  const emailVerifiedAt = new Date();
  const acceptedAt = new Date();

  for (const seedBusiness of seedBusinesses) {
    const business = await prisma.business.upsert({
      create: {
        name: seedBusiness.name,
        slug: seedBusiness.slug,
      },
      update: {
        name: seedBusiness.name,
      },
      where: {
        slug: seedBusiness.slug,
      },
    });

    await Promise.all(
      seedBusiness.domains.map((hostname, index) =>
        prisma.businessDomain.upsert({
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

    for (const user of seedBusiness.users) {
      const seededUser = await prisma.user.upsert({
        create: {
          businessId: business.id,
          emailVerifiedAt,
          passwordHash,
          termsAndPrivacyPolicyAcceptedAt: acceptedAt,
          ...user,
        },
        update: {
          emailVerifiedAt,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          role: user.role,
          termsAndPrivacyPolicyAcceptedAt: acceptedAt,
        },
        where: {
          businessId_email: {
            businessId: business.id,
            email: user.email,
          },
        },
      });

      if (shouldCreateMembership(user.role)) {
        await prisma.businessMembership.upsert({
          create: {
            businessId: business.id,
            role: user.role,
            userId: seededUser.id,
          },
          update: {
            role: user.role,
          },
          where: {
            businessId_userId: {
              businessId: business.id,
              userId: seededUser.id,
            },
          },
        });
      }
    }
  }
};

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
