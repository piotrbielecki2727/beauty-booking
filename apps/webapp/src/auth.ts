import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import {
  accountLoginSchema,
  isAccountRole,
  type AccountSession,
  type AuthUser,
} from "@beauty-booking/shared";

import { loginAccount } from "@/features/account/api";

type BackendCredentialsUser = AccountSession & {
  accessToken: string;
  emailVerifiedAt: string | null;
  name: string;
};

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: DefaultSession["user"] & AccountSession;
  }

  interface User extends Partial<AuthUser> {
    accessToken?: string;
  }
}

const toAccountSession = (user: AuthUser): AccountSession => ({
  birthDate: user.birthDate,
  businessId: user.businessId,
  createdAt: user.createdAt,
  email: user.email,
  firstName: user.firstName,
  id: user.id,
  lastName: user.lastName,
  phone: user.phone,
  role: user.role,
});

const getTenantHostFromRequest = (request: Request) =>
  request.headers.get("x-forwarded-host") ??
  request.headers.get("host") ??
  undefined;

const authConfig = {
  callbacks: {
    jwt: ({ session, token, trigger, user }) => {
      if (trigger === "update") {
        const nextToken = token as typeof token & {
          accountSession?: AccountSession;
        };
        const nextSession = session as
          | { user?: Partial<AccountSession> }
          | undefined;

        if (
          nextToken.accountSession &&
          isAccountRole(nextSession?.user?.role)
        ) {
          nextToken.accountSession = {
            ...nextToken.accountSession,
            role: nextSession.user.role,
          };
        }

        return token;
      }

      if (
        user?.id &&
        user.email &&
        user.firstName &&
        user.lastName &&
        user.role
      ) {
        const nextToken = token as typeof token & {
          accessToken?: string;
          accountSession?: AccountSession;
        };

        nextToken.accessToken = user.accessToken;
        nextToken.accountSession = {
          birthDate: user.birthDate ?? "",
          businessId: user.businessId ?? "",
          createdAt: user.createdAt ?? new Date().toISOString(),
          email: user.email,
          firstName: user.firstName,
          id: user.id,
          lastName: user.lastName,
          phone: user.phone ?? "",
          role: user.role,
        };
      }

      return token;
    },
    session: ({ session, token }) => {
      const nextToken = token as typeof token & {
        accessToken?: string;
        accountSession?: AccountSession;
      };

      if (nextToken.accountSession) {
        session.accessToken = nextToken.accessToken;
        session.user = {
          ...session.user,
          ...nextToken.accountSession,
        };
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      authorize: async (credentials, request) => {
        const parsedCredentials = accountLoginSchema.safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const response = await loginAccount(parsedCredentials.data, {
          tenantHost: getTenantHostFromRequest(request),
        });
        const accountSession = toAccountSession(response.user);

        return {
          ...accountSession,
          accessToken: response.tokens.accessToken,
          emailVerifiedAt: response.user.emailVerifiedAt,
          name: `${accountSession.firstName} ${accountSession.lastName}`,
        } satisfies BackendCredentialsUser;
      },
      credentials: {
        email: {},
        password: {},
      },
    }),
  ],
  secret: process.env.AUTH_SECRET ?? "beauty-booking-local-auth-secret",
  jwt: {
    maxAge: 60 * 60,
  },
  session: {
    maxAge: 60 * 60,
    strategy: "jwt",
  },
  trustHost: true,
} satisfies NextAuthConfig;

const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth(authConfig);

export { auth, GET, POST, signIn, signOut };
