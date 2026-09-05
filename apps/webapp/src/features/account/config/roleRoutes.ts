import {
  accountRoles,
  isSalonTeamRole,
  salonManagementRoles,
  salonTeamRoles,
} from "@beauty-booking/shared";

import type { AccountRole } from "@beauty-booking/shared";

type RoleRouteRule = {
  path: string;
  roles: readonly AccountRole[];
};

const customerAreaRoles = ["Customer", "Admin"] satisfies AccountRole[];

const authRoutes = ["/login", "/register", "/register/verify"];

const publicRoutes = ["/"];

const authOptionalRoutes = ["/team-invitations"];

const protectedRouteRules: RoleRouteRule[] = [
  {
    path: "/management/settings",
    roles: salonManagementRoles,
  },
  {
    path: "/management",
    roles: salonTeamRoles,
  },
  {
    path: "/bookings",
    roles: customerAreaRoles,
  },
  {
    path: "/profile",
    roles: accountRoles,
  },
];

const isSameOrNestedPath = (pathname: string, routePath: string) => {
  if (routePath === "/") {
    return pathname === routePath;
  }

  return pathname === routePath || pathname.startsWith(`${routePath}/`);
};

const findRoleRouteRule = (pathname: string) =>
  protectedRouteRules.find((rule) => isSameOrNestedPath(pathname, rule.path));

const isAuthRoute = (pathname: string) =>
  authRoutes.some((routePath) => isSameOrNestedPath(pathname, routePath));

const isPublicRoute = (pathname: string) =>
  publicRoutes.some((routePath) => isSameOrNestedPath(pathname, routePath));

const isAuthOptionalRoute = (pathname: string) =>
  authOptionalRoutes.some((routePath) =>
    isSameOrNestedPath(pathname, routePath),
  );

const canAccessRoleRoute = (role: AccountRole, rule: RoleRouteRule) =>
  rule.roles.some((allowedRole) => allowedRole === role);

const getDefaultAccountRedirectPath = (role: AccountRole) =>
  isSalonTeamRole(role) ? "/management" : "/";

export {
  authRoutes,
  authOptionalRoutes,
  canAccessRoleRoute,
  customerAreaRoles,
  findRoleRouteRule,
  getDefaultAccountRedirectPath,
  isAuthOptionalRoute,
  isAuthRoute,
  isPublicRoute,
  isSameOrNestedPath,
  protectedRouteRules,
};
export type { RoleRouteRule };
