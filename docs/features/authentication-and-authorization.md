# Authentication And Authorization

## Status

Backend auth foundation is implemented and the web app is now wired to Auth.js/NextAuth Credentials.

Current flow:

1. Registration form calls backend `POST /auth/register`.
2. Backend creates a pending `Customer` user, hashes the password and creates an e-mail verification code.
3. E-mail delivery is mocked by `emailVerification.adapter.ts`; dev code defaults to `111111`.
4. Frontend stores only `registrationToken` in `localStorage` and redirects to `/register/verify`.
5. `/register` redirects to `/register/verify` when a pending registration token is still stored locally.
6. `/register/verify` resumes the pending flow through `POST /auth/register/resume`.
7. The user has 15 minutes to confirm the e-mail. During that window, they can resend the code twice, with a 60-second cooldown.
8. The user can cancel the pending registration from `/register/verify`; frontend calls `POST /auth/register/cancel`, clears `registrationToken` and returns to `/register`.
9. Verification form calls backend `POST /auth/verify-email`.
10. After successful verification, the frontend clears `registrationToken` and links to login. It does not auto-login.
11. Login form signs in through NextAuth Credentials, which delegates password validation to backend `POST /auth/login`.
12. `proxy.ts` reads the Auth.js session and enforces role-based route access.

## Owner Modules

Shared contracts:

- `packages/shared/src/account`
- `packages/shared/src/auth`
- `packages/shared/src/roles`

Backend:

- `apps/backend/src/modules/auth`
- `apps/backend/src/modules/users`
- `apps/backend/prisma/schema.prisma`

Frontend:

- `apps/web/src/auth.ts`
- `apps/web/src/app/api/auth/[...nextauth]/route.ts`
- `apps/web/src/app/register/verify/page.tsx`
- `apps/web/src/features/account/api/accountAuthApi.ts`
- `apps/web/src/features/account/providers/NextAuthProvider.tsx`
- `apps/web/src/features/account/providers/accountProvider.tsx`
- `apps/web/src/features/account/config/roleRoutes.ts`
- `apps/web/src/proxy.ts`

## Roles

Account roles are shared through `@beauty-booking/shared`:

- `Admin`
- `Owner`
- `Manager`
- `Employee`
- `Customer`

Frontend and backend should use these role names as the canonical role set.

New public registrations receive `Customer`.

Salon/team roles are:

- `Admin`
- `Owner`
- `Manager`
- `Employee`

Application areas:

- Customer area: `Customer`, `Admin`
- Management area: `Admin`, `Owner`, `Manager`, `Employee`

`Admin` belongs to the management area, but should also be allowed to access the
customer area. The final UX and authorization model for switching between those
areas is intentionally left for later.

Salon management roles are:

- `Admin`
- `Owner`

Seeded test accounts use password `Password123!`:

- `customer@beautybooking.test`
- `owner@beautybooking.test`
- `admin@beautybooking.test`
- `employee@beautybooking.test`

## Backend API

Base backend app mounts auth routes at `/auth`.

### `POST /auth/register`

Creates a new pending user with role `Customer`, stores a password hash, stores legal acceptance timestamps and creates an e-mail verification code.

If the e-mail belongs to an unverified, non-expired user, the backend continues that pending registration. If it belongs to a verified user, the backend returns `409`.

Request contract:

- shared schema: `authRegisterRequestSchema`

Response contract:

- shared schema: `authRegistrationFlowResponseSchema`

```json
{
  "registrationToken": "jwt",
  "email": "customer@example.com",
  "status": "PENDING",
  "verificationRequired": true,
  "codeExpiresAt": "2026-08-06T16:15:00.000Z",
  "registrationExpiresAt": "2026-08-06T16:15:00.000Z",
  "canResendAt": "2026-08-06T16:01:00.000Z",
  "remainingResends": 2
}
```

### `POST /auth/register/resume`

Resumes a pending registration from `registrationToken`.

Request contract:

- shared schema: `authRegistrationTokenSchema`

Response contract:

- shared schema: `authRegistrationFlowResponseSchema`

Statuses:

- `PENDING`: code is active,
- `REGISTRATION_EXPIRED`: 15-minute registration window expired,
- `VERIFIED`: account is already verified,
- `INVALID`: token cannot be used.

### `POST /auth/register/resend-code`

Sends a new verification code for a pending registration.

Request contract:

- shared schema: `authRegistrationTokenSchema`

Response contract:

- shared schema: `authRegistrationFlowResponseSchema`

Important behavior:

- registration token is required,
- registration must not be expired,
- resend cooldown is 60 seconds,
- maximum resend count is 2, so the user can receive at most 3 codes total,
- old unused codes are marked as used before creating the new code.

### `POST /auth/register/cancel`

Cancels a pending registration by deleting the unverified user.

Request contract:

- shared schema: `authRegistrationTokenSchema`

Response:

- `204`

### `POST /auth/verify-email`

Verifies the e-mail code and marks the user as verified.

Request contract:

- shared schema: `authVerifyEmailRequestSchema`

Response contract:

- shared schema: `authVerifyEmailResponseSchema`

Important behavior:

- request uses `registrationToken` and `code`,
- registration must not be expired,
- code must be the latest active unused code,
- after 3 wrong codes across the whole registration, the pending user is deleted and the flow must restart,
- successful verification does not return an access token.

### `POST /auth/login`

Validates e-mail and password and returns an auth response.

Request contract:

- shared schema: `accountLoginSchema`

Important behavior:

- unverified users cannot log in,
- successful login returns backend JWT access token for future backend API calls.

### `GET /auth/me`

Protected route. Reads `Authorization: Bearer <token>` and returns the current user.

### `POST /auth/logout`

Protected route. Stateless for now, returns `204`.

## Frontend Auth

Auth.js/NextAuth configuration lives in:

- `apps/web/src/auth.ts`

The Credentials Provider calls backend `POST /auth/login`, then stores:

- account data in the NextAuth JWT/session,
- backend `accessToken` in the NextAuth session.

`AccountProvider` remains as an app-facing adapter for existing account screens. It reads the NextAuth session through `useSession` and exposes the existing `useAccountSession` API to the rest of the app.

The previous local registered-account storage and temporary `bb.account-session` cookie bridge have been removed.

Required web env:

- `AUTH_SECRET`
- `BACKEND_API_URL`
- `NEXT_PUBLIC_BACKEND_API_URL`

## Frontend Route Protection

Route rules live in:

- `apps/web/src/features/account/config/roleRoutes.ts`

Next.js request guard lives in:

- `apps/web/src/proxy.ts`

Current protected rules:

- `/account/settings`: `Owner`, `Admin`
- `/account/stats`: `Owner`, `Admin`
- `/account/visits`: `Customer`
- `/account/profile`: all roles
- `/account`: all roles
- `/booking`: all roles

Additional rule:

- `/booking?source=staff` is allowed only for salon/team roles.

## Database

Current Prisma models:

- `User`
- `EmailVerificationCode`
- `Business`
- `BusinessMembership`

Important decisions:

- `User.email` is unique.
- `User.role` defaults to `Customer`.
- pending registration is represented by `User.emailVerifiedAt = null`; there is no `PendingRegistration` table.
- registration lifetime is based on `User.createdAt` plus 15 minutes.
- `EmailVerificationCode` stores a hash, expiry, failed-attempt count and `usedAt`.
- `BusinessMembership` is already present to avoid blocking multi-tenant salon permissions later.

## Temporary Mocks

E-mail verification is mocked:

- env key: `AUTH_EMAIL_VERIFICATION_CODE`
- default/example value: `111111`
- adapter: `apps/backend/src/modules/auth/emailVerification.adapter.ts`

Replace only this adapter when adding a real e-mail provider.

## Next Steps

1. Add `.env` files and run Prisma migration against PostgreSQL.
2. Add backend tests for registration, verification, login and guarded `/auth/me`.
3. Replace the e-mail mock adapter with a real provider when product is ready.
4. Start moving booking/customer data from `localStorage` to backend modules.
5. Add refresh-token/session invalidation strategy if backend APIs require long-lived sessions.
