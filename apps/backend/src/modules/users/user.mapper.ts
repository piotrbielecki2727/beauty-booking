import type { User } from "@prisma/client";
import type { AccountRole, AuthUser } from "@beauty-booking/shared";

const toAuthUser = (user: User): AuthUser => ({
  birthDate: user.birthDate ? user.birthDate.toISOString().slice(0, 10) : "",
  businessId: user.businessId,
  createdAt: user.createdAt.toISOString(),
  email: user.email,
  emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
  firstName: user.firstName,
  id: user.id,
  lastName: user.lastName,
  phone: user.phone ?? "",
  role: user.role as AccountRole,
});

export { toAuthUser };
