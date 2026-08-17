# Beauty Booking Backend - Agent Instructions

## Before Making Changes

1. Read this file before editing backend code.
2. Inspect the relevant module, Prisma schema and shared contracts before implementing.
3. Keep backend changes scoped to the requested feature.
4. Use `packages/shared` for request/response schemas and domain types that must stay aligned with the frontend.
5. Update feature documentation in `docs/features` whenever behavior, endpoints, data flow or module boundaries change.

## Current Backend Stage

The backend is in the first implementation stage.

Current stack:

- Node.js,
- Express,
- TypeScript,
- PostgreSQL,
- Prisma,
- Zod,
- shared contracts from `@beauty-booking/shared`.

From the repository root, `pnpm dev` builds `@beauty-booking/shared`, then starts shared watch mode, the web app and the backend in parallel.

Current implemented module:

- `auth`: registration, e-mail verification mock, login, current user, logout.
- `tenant`: active business context resolution from host.

The backend auth module is connected to the frontend through Auth.js/NextAuth Credentials. Booking and salon data are still local/mock until their backend modules are added.

Current auth persistence includes a legal acceptance timestamp on `User`:

- `termsAndPrivacyPolicyAcceptedAt`.

This timestamp is set during registration after the shared request schema confirms the required terms and privacy policy consent is accepted.

## Architecture

Backend source lives in `apps/backend/src`.

Preferred structure:

```text
src/
├── app.ts
├── server.ts
├── config/
├── db/
├── middlewares/
├── modules/
│   └── feature-name/
│       ├── feature.controller.ts
│       ├── feature.routes.ts
│       ├── feature.service.ts
│       ├── feature.repository.ts
│       ├── feature.schemas.ts
│       └── feature.types.ts
├── types/
└── utils/
```

Rules:

- `controller` handles HTTP request/response only.
- `routes` wires Express routes, validation and middleware.
- `service` owns business rules and orchestration.
- `repository` owns Prisma/database access only.
- `schemas` should re-export shared Zod schemas when possible.
- `types` are module-specific only. Shared API/domain contracts belong in `packages/shared`.
- `utils` contain small reusable pure helpers or infrastructure helpers.
- Do not access Prisma directly from controllers.
- Do not put business rules inside routes.

## Shared Contracts

Use `packages/shared` as the source of truth for:

- account roles,
- auth request schemas,
- registration password policy,
- registration legal consent validation,
- registration/login/verification Zod schemas,
- public account/session response types,
- future shared booking/business contracts.

Do not duplicate a Zod schema in backend and frontend. If a schema is needed in both places, move it or add it to `packages/shared`, then import it from there.

Backend modules may keep private internal validation schemas only when they are not part of the frontend/API contract.

## Naming

Follow the project naming convention:

- Non-component files use lower camelCase and no hyphens, for example `authService.ts` is preferred only if the local module style changes. The current backend module files use suffix groups such as `auth.service.ts`; keep that style inside backend modules for clarity.
- Do not introduce mixed naming styles inside the same module.
- Prefer `const` for functions and helpers.
- Use `class` only where the runtime behavior benefits from it, such as `ApiError`.
- Do not use `any`.

## Imports

Sort imports consistently:

1. Node built-ins.
2. External packages.
3. `@beauty-booking/shared`.
4. Internal aliases such as `@/config`, `@/db`, `@/modules`, `@/utils`.
5. Relative imports only when they are necessary.

Avoid broad barrels that hide module boundaries. Small `index.ts` files are acceptable only when they improve ergonomics without hiding client/server/runtime concerns.

## Auth And Security

Auth is the first backend module and should stay close to the future NextAuth integration.

Current intended flow:

1. Frontend sends registration data to backend.
2. Backend validates with shared Zod schemas, including password strength and required legal consents.
3. Backend stores password hash, default role `Customer` and `termsAndPrivacyPolicyAcceptedAt`.
4. Backend creates an e-mail verification code record.
5. Current e-mail delivery is mocked with a fixed/dev code.
6. Verification returns an auth response with user and access token.
7. Login returns an auth response with user and access token.
8. Frontend Auth.js/NextAuth Credentials Provider calls backend `/auth/login`.

Security rules:

- Never store plaintext passwords.
- Never return `passwordHash`.
- Do not leak whether internal database operations failed.
- Use `Authorization: Bearer <token>` for protected backend API calls.
- Keep role checks explicit.
- Role changes should not happen through public registration endpoints.
- New public registrations receive `Customer`.
- Login requires a verified e-mail address.
- Do not persist legal consents as simple booleans. Use nullable acceptance timestamps so the system knows whether and when the user accepted the documents.
- `authRegisterRequestSchema` should keep validating the consent boolean from the request and remove only fields that should not be persisted, such as `confirmPassword`.
- Do not duplicate frontend-only password checks. The shared password schema is the contract used by both frontend and backend.

## E-Mail Verification

The current e-mail implementation is a mock adapter:

- `AUTH_EMAIL_VERIFICATION_CODE` defaults to `111111`,
- code sending logs to the console,
- the adapter boundary is `emailVerification.adapter.ts`.

When a real provider is added, replace only the adapter implementation and keep auth service behavior stable.

## Database

Database access is through Prisma only.

Rules:

- Update `prisma/schema.prisma` before adding persistence logic.
- Keep migrations small and feature-oriented.
- Repositories should expose intent-focused functions, not raw generic database operations.
- Services should not pass arbitrary Prisma query objects from controllers.
- Use database constraints for uniqueness and integrity where possible.

Current foundational models:

- `User`,
- `EmailVerificationCode`,
- `Business`,
- `BusinessDomain`,
- `BusinessMembership`.

`User` currently includes `termsAndPrivacyPolicyAcceptedAt` for registration legal acceptance. When this field or other persisted auth fields change, add a Prisma migration and regenerate the client.

Seed users must satisfy the current shared password policy and should include legal acceptance timestamps when they represent already registered users.

Temporary MVP business owner provisioning is handled by a local script:

```bash
pnpm --filter @beauty-booking/backend db:create-business-owner
```

The script reads business and owner data from env variables, creates or updates the business, domains, owner user and owner membership, and is intended for manual admin use until invite/admin UI flows exist.

## Error Handling

Use `ApiError` for expected domain/API errors.

Let unexpected errors reach `errorMiddleware`.

Validation errors should come from Zod and be returned as structured `issues`.

Do not return stack traces to the client.

## Documentation

Feature documentation lives in `docs/features`.

When a backend feature changes, update or create the related feature document with:

- current status,
- module ownership,
- routes/endpoints,
- request/response contracts,
- database models used,
- role/permission rules,
- mocked or temporary parts,
- next backend/frontend integration steps.

Keep docs concise but specific enough that another agent can continue without rediscovering the module.

## Verification

Before finishing backend work, run the relevant commands:

```bash
pnpm --filter @beauty-booking/shared typecheck
pnpm --filter @beauty-booking/backend typecheck
pnpm --filter @beauty-booking/backend build
```

When frontend contracts or middleware change, also run:

```bash
pnpm --filter @beauty-booking/web lint
pnpm --filter @beauty-booking/web typecheck
pnpm --filter @beauty-booking/web build
```

For broad monorepo changes, run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Run database migrations only when PostgreSQL and `.env` are available.

## Completion Response

At the end of backend work, briefly report:

- modules/files changed,
- contracts added or updated,
- database changes,
- mocked parts,
- verification commands,
- remaining integration steps.

Odpowiadaj po polsku, chyba że poproszę o inny język.

Pisz zwięźle i konkretnie. Nie dodawaj wstępów, podsumowań ani powtórzeń mojego polecenia.

Generuj wyłącznie to, o co proszę. Nie dodawaj przykładów, alternatyw ani dodatkowych wyjaśnień, jeśli o nie poproszę.

Na początku pracy sprawdź, czy w repozytorium istnieje plik AGENTS.md. Jeśli istnieje, przeczytaj go i bezwzględnie stosuj opisane w nim zasady, konwencje, wzorce oraz workflow. W razie konfliktu instrukcje z AGENTS.md mają pierwszeństwo przed tymi instrukcjami.

Jeżeli brakuje informacji potrzebnych do wykonania zadania, zadaj jedno krótkie pytanie. W przeciwnym razie przyjmij rozsądne założenia i krótko je zaznacz.

Podczas programowania:

- twórz kod gotowy do użycia,
- preferuj modyfikację istniejącego kodu zamiast przepisywania całości,
- zwracaj tylko zmienione fragmenty, jeśli nie proszę o pełny plik,
- nie dodawaj komentarzy w kodzie, jeśli o nie nie proszę,
- nie zmieniaj kodu poza zakresem mojego polecenia,
- stosuj istniejący styl, architekturę i wzorce projektu,
- wyszukuj i naśladuj istniejące implementacje podobnych funkcjonalności zamiast tworzyć nowe wzorce,
- nie dodawaj nowych bibliotek ani zależności bez wyraźnej potrzeby,
- uwzględniaj typowe przypadki brzegowe.

Jeżeli istnieje prostsze, szybsze lub bardziej idiomatyczne rozwiązanie, zaproponuj je krótko.

Minimalizuj liczbę użytych tokenów.
