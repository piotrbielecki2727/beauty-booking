import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/auth";
import {
  canAccessRoleRoute,
  findRoleRouteRule,
  getDefaultAccountRedirectPath,
  isAuthRoute,
  isPublicRoute,
  isSameOrNestedPath,
} from "@/features/account/config/roleRoutes";
import { isLocale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const intlProxy = createMiddleware(routing);

const getLocalizedPathname = (pathname: string) => {
  const [, maybeLocale, ...segments] = pathname.split("/");

  if (!isLocale(maybeLocale)) {
    return null;
  }

  return {
    locale: maybeLocale,
    pathname: segments.length > 0 ? `/${segments.join("/")}` : "/",
  };
};

const createLocalizedUrl = (
  request: NextRequest,
  locale: string,
  pathname: string,
) => {
  const localizedPathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return new URL(localizedPathname, request.url);
};

const createLoginRedirect = (
  request: NextRequest,
  locale: string,
  nextPathname: string,
) => {
  const loginUrl = createLocalizedUrl(request, locale, "/login");
  loginUrl.searchParams.set(
    "next",
    `${nextPathname}${request.nextUrl.search}`,
  );

  return NextResponse.redirect(loginUrl);
};

const proxy = auth((request) => {
  const localizedPathname = getLocalizedPathname(request.nextUrl.pathname);

  if (!localizedPathname) {
    return intlProxy(request);
  }

  const { locale, pathname } = localizedPathname;
  const session = request.auth?.user;

  if (isPublicRoute(pathname) && session) {
    const redirectPath = getDefaultAccountRedirectPath(session.role);

    if (redirectPath !== pathname) {
      return NextResponse.redirect(
        createLocalizedUrl(request, locale, redirectPath),
      );
    }
  }

  if (isPublicRoute(pathname)) {
    return intlProxy(request);
  }

  if (isAuthRoute(pathname) && session) {
    return NextResponse.redirect(
      createLocalizedUrl(
        request,
        locale,
        getDefaultAccountRedirectPath(session.role),
      ),
    );
  }

  if (session) {
    const redirectPath = getDefaultAccountRedirectPath(session.role);

    if (
      redirectPath === "/management" &&
      !isSameOrNestedPath(pathname, redirectPath)
    ) {
      return NextResponse.redirect(
        createLocalizedUrl(request, locale, redirectPath),
      );
    }
  }

  const routeRule = findRoleRouteRule(pathname);

  if (!routeRule) {
    return intlProxy(request);
  }

  if (!session) {
    return createLoginRedirect(request, locale, pathname);
  }

  if (!canAccessRoleRoute(session.role, routeRule)) {
    return NextResponse.redirect(createLocalizedUrl(request, locale, "/"));
  }

  return intlProxy(request);
});

export default proxy;

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
