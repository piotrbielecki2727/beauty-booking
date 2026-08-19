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
- `apps/backend/src/modules/tenant`
- `apps/backend/src/modules/users`
- `apps/backend/prisma/schema.prisma`

Frontend:

- `apps/webapp/src/auth.ts`
- `apps/webapp/src/app/api/auth/[...nextauth]/route.ts`
- `apps/webapp/src/app/[locale]/(auth)/register/verify/page.tsx`
- `apps/webapp/src/features/account/api/accountAuthApi.ts`
- `apps/webapp/src/features/account/providers/NextAuthProvider.tsx`
- `apps/webapp/src/features/tenant`
- `apps/webapp/src/features/account/config/roleRoutes.ts`
- `apps/webapp/src/proxy.ts`

## Roles

Account roles are shared through `@beauty-booking/shared`:

- `Admin`
- `Owner`
- `Manager`
- `Employee`
- `Customer`

Frontend and backend should use these role names as the canonical role set.

New public registrations receive `Customer`.

Management accounts are not publicly registered. `Owner`, `Manager` and
`Employee` accounts should be created through invite-based flows controlled by
`Admin` or an already-authorized salon owner/manager.

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

- Beauty Booking:
  - `customer@beauty-booking.local`
  - `owner@beauty-booking.local`
  - `admin@beauty-booking.local`
  - `employee@beauty-booking.local`
- Karolina Kuranda Nails:
  - `owner@karolinakurandanails.local`
  - `customer@karolinakurandanails.local`
- Atelier Magnolia:
  - `owner@ateliermagnolia.local`
  - `employee@ateliermagnolia.local`

All seeded accounts use password `Password123!`.

## Backend API

Base backend app mounts auth routes at `/auth` and tenant routes at `/tenant`.

### `GET /tenant/context`

Resolves the active business from request host.

Host resolution order:

1. `X-Tenant-Host`,
2. `Origin`,
3. `Host`.

Development fallback:

- if no tenant domain is matched and backend runs outside production for
  `localhost`, `127.0.0.1` or `::1`, backend falls back to the seeded
  `beauty-booking` business.
- in development, hosts ending with `.localhost` are also resolved without that
  suffix, so a database domain such as `example-salon.pl` can be tested through
  `example-salon.pl.localhost:3000`.

Response contract:

- shared schema: `tenantContextResponseSchema`

Seeded tenant domains:

- `beauty-booking.localhost`
- `app.beautybooking.test`
- `karolinakurandanails.localhost`
- `karolinakurandanails.com`
- `ateliermagnolia.localhost`
- `ateliermagnolia.pl`

### `POST /auth/register`

Creates a new pending user with role `Customer`, stores a password hash, stores the legal acceptance timestamp and creates an e-mail verification code.

If the e-mail belongs to an unverified, non-expired user, the backend continues that pending registration. If it belongs to a verified user, the backend returns `409`.

Registration is resolved inside the active business. The same e-mail can create
separate customer accounts for different businesses.

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
- e-mail lookup is scoped to the active business.

### `GET /auth/me`

Protected route. Reads `Authorization: Bearer <token>` and returns the current user.

### `POST /auth/logout`

Idempotent logout route. Stateless for now, returns `204`.

Important behavior:

- it is not blocked by `requireAuth`,
- frontend treats this request as best effort,
- expired or missing access tokens must not prevent local logout,
- repeated logout attempts should have the same successful outcome.

## Frontend Auth

Auth.js/NextAuth configuration lives in:

- `apps/webapp/src/auth.ts`

The Credentials Provider calls backend `POST /auth/login`, then stores:

- account data in the NextAuth JWT/session,
- backend `accessToken` in the NextAuth session.

Browser-side auth requests add `X-Tenant-Host` from `window.location.host`.
NextAuth Credentials login forwards the request host to backend with the same
header.

Tenant context is loaded in `TenantProvider` through `GET /tenant/context`.
Customer-facing layout pieces can read the active business through
`useTenantContext`.

The old `apps/web` `AccountProvider` was an app-facing adapter for legacy account screens. It read the NextAuth session through `useSession` and exposed the previous `useAccountSession` API. `apps/webapp` currently uses NextAuth session state directly.

The previous local registered-account storage and temporary `bb.account-session` cookie bridge have been removed.

Logout behavior:

- frontend always clears the local Auth.js/NextAuth session with `signOut`,
- backend `POST /auth/logout` is called only as best effort when an access token exists,
- backend logout failure must not block local logout,
- expired backend JWTs should not leave the user stuck in an authenticated UI state.

Required web env:

- `AUTH_SECRET`
- `BACKEND_API_URL`
- `NEXT_PUBLIC_BACKEND_API_URL`

## Frontend Route Protection

Route rules live in:

- `apps/webapp/src/features/account/config/roleRoutes.ts`

Next.js request guard lives in:

- `apps/webapp/src/proxy.ts`

Current protected rules:

- `/profile`: all roles
- `/bookings`: `Customer`, `Admin`
- `/management`: `Owner`, `Manager`, `Employee`, `Admin`
- `/management/settings`: `Owner`, `Admin`

The request guard is locale-aware and protects the localized routes under `/pl` and `/en`.

## Database

Current Prisma models:

- `User`
- `EmailVerificationCode`
- `Business`
- `BusinessDomain`
- `BusinessMembership`

Important decisions:

- `User.email` is unique per `businessId`, not globally.
- `User.businessId` is required.
- `User.role` defaults to `Customer`.
- `User.termsAndPrivacyPolicyAcceptedAt` stores the single acceptance timestamp for terms and privacy policy.
- `BusinessDomain.hostname` is unique and maps incoming hosts to businesses.
- pending registration is represented by `User.emailVerifiedAt = null`; there is no `PendingRegistration` table.
- registration lifetime is based on `User.createdAt` plus 15 minutes.
- `EmailVerificationCode` stores a hash, expiry, failed-attempt count and `usedAt`.
- `BusinessMembership` stores management/team membership for business roles.

## Invite-Based Management Accounts

Public registration remains customer-only:

- `/register` creates only `Customer` accounts.
- one shared login form is used for all roles.
- after login, backend/session role decides whether the user can access customer
  or management areas.

Owner, manager and employee accounts should use invite links in the target
production flow.

Temporary MVP owner provisioning:

- `apps/backend` exposes a local script: `pnpm db:create-business-owner`,
- the script creates or updates a business, its domains, an owner user and the
  owner `BusinessMembership`,
- input is read first from
  `apps/backend/src/db/createBusinessOwner.config.local.ts`,
- if the local config file does not exist, input is provided through env
  variables:
  - `BUSINESS_NAME`,
  - `BUSINESS_SLUG`,
  - `BUSINESS_DOMAINS`,
  - `OWNER_EMAIL`,
  - `OWNER_FIRST_NAME`,
  - `OWNER_LAST_NAME`,
  - optional `OWNER_PHONE`,
  - optional `OWNER_PASSWORD`,
- if `OWNER_PASSWORD` is omitted, the script generates and prints a temporary
  password once,
- the owner account is marked as e-mail verified and receives
  `termsAndPrivacyPolicyAcceptedAt` at provisioning time,
- this script is local/admin-only and should be replaced by an invite/admin UI
  flow before self-service onboarding.

Planned MVP flow:

1. `Admin` manually creates an invite for a salon/team account.
2. Invite stores `email`, `role`, optional `businessId`, `token`, `expiresAt`
   and `status`.
3. `Admin` sends the invite URL manually, for example
   `/invite/accept?token=...`.
4. Invited user opens the link and sets their own account data and password.
5. Backend creates the user with the role from the invite.
6. Backend attaches the user to the target business through
   `BusinessMembership` when the invite is business-specific.
7. Invite is marked as accepted and cannot be reused.

Important decisions:

- users must not be able to choose `Owner`, `Manager` or `Employee` from a
  public registration form,
- `Owner` accounts should not be created manually with a known password,
- manual invite generation is acceptable for MVP because it preserves control
  over who can access management,
- a dedicated admin UI for generating invites can be added later,
- an e-mail provider is optional for MVP; copied invite links are enough.

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
