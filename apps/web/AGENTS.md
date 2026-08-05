<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes: APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Beauty Booking - Agent Instructions

## Before Making Changes

1. Read this entire file.
2. Inspect the existing repository structure and relevant source files.
3. For Next.js-specific work, follow the generated rules above and consult the local documentation in `node_modules/next/dist/docs/`.
4. Do not introduce a new architecture or library without explaining why it is necessary.
5. Keep changes limited to the requested scope.
6. Preserve the frontend-first direction until backend work is explicitly requested.

## Current Project Stage

The project is frontend-first. The app uses mocked data, `localStorage` and `sessionStorage` only where currently implemented, and UI flows are being shaped to match the later backend/API contract.

Current priorities:

- build a reusable frontend design system on top of shadcn/Base UI,
- keep booking and account flows cleanly separated by feature,
- support both customer self-booking and salon/team-managed booking,
- keep salon configuration flexible for solo and multi-person businesses,
- focus on mobile-first UX while using available desktop width well,
- do not implement Express/PostgreSQL/backend persistence yet.

## Current Implementation Snapshot

- `/booking` contains the customer booking wizard using mocked business, services, staff, local reservations and generated time-slot data.
- Booking currently requires a frontend-only account session before a reservation can be created.
- Customer self-booking supports service, optional staff, date/time, summary and success screens.
- Staff-created booking is entered through `/booking?source=staff`; it adds a first step for customer/client details before service, staff, date/time and summary.
- In staff-created booking, UI copy must not say "Konto klientki", "Twoja rezerwacja", or wording that assumes the logged-in user is booking for themself. Use neutral wording such as `Klient/ka`, `Rezerwacja`, and `zapisz wizytę w kalendarzu`.
- Solo-business mode skips the staff step in the booking flow. Solo and multi-person behavior must stay modeled through `features/business-settings` and availability utilities, not scattered conditional logic inside presentational UI components.
- Available booking slots are generated from business settings, staff schedules, per-staff service duration/pricing and existing local reservations. This frontend generator is a mock stand-in for the future backend availability API.
- Booking drafts are not restored after refresh for now; keep booking flow stateless until persistence is intentionally reintroduced.
- SMS verification is not part of the current booking flow while the product direction focuses on account-based reservations.
- Booking consents currently include required terms acceptance; optional SMS/e-mail notification consents are intentionally hidden for now.
- `/regulamin` contains placeholder reservation terms for the required terms link.

## Accounts And Roles

- Account roles are represented as `Owner | Manager | Worker | Customer | Admin`.
- Newly registered accounts receive `Customer` by default.
- Role changes are expected to happen later from database/admin tooling.
- Customer account creation is frontend-only: `/register` redirects to `/register/form`, which collects required first name, required last name, e-mail, password, password confirmation, optional phone and optional birth date, then simulates e-mail code confirmation.
- Customer login is frontend-only at `/login`; it signs in against mock registered account storage and creates a session used by `/` and `/booking`.
- `/` is the account entry screen:
  - logged-out users see account benefits and auth actions,
  - `Customer` users see a customer panel with their visit overview,
  - `Owner`, `Manager`, `Worker` and `Admin` users see `Plan dnia`: a date-driven daily plan with compact day metrics and visit cards grouped into `Wizyty aktywne`, `Wykonane`, and `Odwołane`.
- The salon/team main panel should avoid customer-only phrasing. The primary action is `Utwórz rezerwację`, which starts the staff-created booking flow.
- Salon/team dashboard reads real local reservations from `localStorage` through `useStoredReservations`; mock reservations are only a fallback when local storage is empty. `Plan dnia` metrics recalculate for the selected date: visits, completed, remaining, predicted revenue, actual revenue, and lost revenue.
- In `Plan dnia`, owner-facing status labels are simplified to `Aktywna`, `Wykonana`, and `Odwołana`. Status can be changed from the visit card; stored reservations update local storage, while mock reservations can be overridden in the current UI session.
- `Statystyki i finanse` is present in the sidebar as `/account/stats`, but currently remains an empty placeholder page.
- `/account/visits` lists the logged-in customer's locally stored reservations and supports frontend-only cancellation/edit actions.
- Numeric count badges in section headers are intentionally avoided. Do not add small badges whose only purpose is showing item counts.

## Salon Management

- Business settings are implemented frontend-first under `features/business-settings`.
- `/account/settings` is labeled as `Zarządzanie salonem`.
- The sidebar shows `Zarządzanie salonem` only for `Owner` and `Admin`.
- Direct access by other roles should show a clear no-access state rather than exposing editable salon settings.
- Salon management is organized into tabs:
  - `Rezerwacje online`,
  - `Wykonawcy, grafiki i usługi`.
- Tabs use the reusable `AppTabs` wrapper over shadcn/Base UI tabs. Tabs should be visually clear, larger than compact controls, and must not show scroll artifacts or clipped text on desktop.
- `Rezerwacje online` controls:
  - solo/team business mode,
  - default staff member when relevant,
  - how many months ahead customers can book,
  - slot step size.
- `Wykonawcy, grafiki i usługi` controls:
  - staff selector only for team businesses,
  - weekly schedule,
  - enabled services,
  - per-staff service duration,
  - per-staff concrete price.
- In solo-business mode, do not show a staff dropdown or explanatory copy that calls out "działalność jednoosobowa" unnecessarily. The UI should simply show the relevant solo configuration.
- In team mode, choose the staff member from a dropdown first, then edit only that person's schedule/services/pricing.
- Each salon-management tab has its own `Zatwierdź` button.
- Saved message copy should be neutral: `Ustawienia zostały zapisane.`
- If there are unsaved salon-management changes and the user tries to switch tabs or navigate away, show a confirmation dialog with:
  - stay/cancel,
  - leave without saving,
  - `Zapisz i opuść`.
- The `Zapisz i opuść` action is specific to salon settings; do not add it to booking abandon dialogs.

## Manager Area

- Manager authentication is represented by a frontend-only mocked session.
- `/manager/login` and `/manager` should keep auth UX and guards close to the future backend contract.
- The first manager dashboard shows mocked bookings, day metrics, upcoming appointments and logout.
- The separate customer/account shell and manager shell should not drift into one ambiguous layout. Keep their responsibilities explicit.

## Design System And Shared Components

- Low-level shadcn/Base UI components live in `components/ui`.
- Reusable application components live in `components/common`.
- Current reusable app components include:
  - `AppButton`,
  - `AppDropdown`,
  - `AppNumberInput`,
  - `AppTabs`,
  - `ConfirmationDialog`,
  - `FormField`,
  - `PhoneNumberInput`,
  - `SectionCard`,
  - `TimePicker`.
- `AppDropdown` is the app-level dropdown wrapper over shadcn/Base UI dropdown menu. It should:
  - use a down chevron when closed and an up chevron when open,
  - visually distinguish the active option inside the menu,
  - close after selecting an option,
  - avoid native `<select>` styling.
- `TimePicker` uses `AppDropdown`; do not use native `input[type="time"]` in salon management.
- `AppNumberInput` is used where native number input arrows would look unpolished. Prefer it for numeric controls in app forms such as duration and price.
- `ConfirmationDialog` supports an optional third action, but use it only where the product flow needs it.
- `CustomerAppShell` is the account/salon shell with sidebar. It should use available desktop width by default while remaining mobile-safe. Avoid per-page width overrides unless there is a strong layout reason.
- `CustomerAppShell` accepts an optional `eyebrow`. Do not default app-wide copy to `Konto klientki`; pass context-specific labels only when useful.

## Product Context

This is a multi-tenant booking platform for beauty and appointment-based service businesses, including:

- nail stylists,
- makeup artists,
- lash and brow stylists,
- hairdressers,
- cosmetologists,
- massage providers,
- similar service businesses.

The platform must not be designed only for nail salons.

Instagram remains an important marketing and portfolio channel. The public application should focus on a fast booking process rather than replacing Instagram.

## Technology

Frontend:

- Next.js App Router,
- TypeScript,
- React Compiler,
- Tailwind CSS,
- shadcn/ui using Base UI and the Luma preset.

Planned backend:

- Node.js,
- Express,
- PostgreSQL.

Do not implement backend code unless explicitly requested.

## Frontend Architecture

Prefer this structure:

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── common/
│   └── layout/
├── features/
│   ├── account/
│   ├── booking/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── mocks/
│   │   ├── schemas/
│   │   ├── types/
│   │   └── utils/
│   ├── business-settings/
│   ├── manager/
│   └── theme/
├── config/
├── hooks/
├── lib/
├── styles/
└── types/
```

Rules:

- `components/ui` contains low-level shadcn components.
- `components/common` contains reusable application components.
- Feature-specific code belongs inside the relevant `features/*` directory.
- Do not put feature-specific logic inside generic UI components.
- Do not build one large component for an entire flow.
- Mocks should stay outside presentational components.
- Route-level components, feature containers and feature hooks may compose mocks, storage and orchestration logic.

## Reusable Components

Use existing shadcn components as foundations whenever possible.

Reusable application components should:

- accept standard HTML or shadcn props where appropriate,
- support `className`,
- remain accessible,
- work on mobile and desktop,
- avoid feature-specific assumptions,
- use semantic design tokens rather than hardcoded colors.

Do not create an overly generic "universal component" with many unrelated boolean props. Prefer composition and narrowly focused components.

## Styling

The intended visual direction is premium, modern and restrained.

Primary palette:

- cream,
- mocha,
- brown,
- burgundy,
- grey,
- near-black.

Rules:

- use semantic CSS variables,
- do not place raw hex colors directly inside feature components,
- keep typography and spacing consistent,
- prioritize usability over decorative effects,
- design mobile-first,
- avoid clipped text, jumping containers and unnecessary count badges,
- use available desktop width where the shell allows it,
- do not add visible instructional copy that explains obvious UI mechanics.

## Data And API Preparation

During the frontend-first stage:

- use mocked data,
- keep mock data outside components,
- design components against explicit TypeScript contracts,
- keep storage utilities small and replaceable,
- treat future backend availability responses as the eventual source of truth.

The future backend will own:

- available-slot calculation,
- service duration,
- staff availability,
- booking validation,
- overbooking prevention,
- appointment creation,
- user authentication,
- permissions,
- notifications.

## TypeScript And Code Quality

Use strict TypeScript.

Do not use `any`.

Validate assumptions before adding type assertions.

Prefer small, testable functions.

Avoid duplicated constants and domain types.

Keep imports and naming consistent with the existing project.

Do not leave dead code or commented-out implementations.

## Code Style And Maintainability

Feature file naming is strict:

- Component files must use PascalCase and no hyphens, for example `AccountLoginForm.tsx`, `BookingSummaryCard.tsx`, and `BusinessSettingsPage.tsx`.
- Non-component files must use lower camelCase and no hyphens, for example `useBookingFlow.ts`, `accountRegistrationSchema.ts`, `reservationStorage.ts`, `accountSession.ts`, and `bookingSteps.ts`.
- Route files controlled by Next.js keep framework names such as `page.tsx` and `layout.tsx`.
- Prefer shallow `index.ts` exports inside focused feature subfolders when they make imports cleaner, but do not use a broad feature-wide barrel that hides client/server boundaries.

Prefer explicit React imports. Do not use `import * as React`; import concrete hooks and types instead, for example `useState`, `useCallback`, and `type ReactNode`.

Prefer `const` declarations for components, hooks, helpers, and local utilities. Use `function` only when there is a clear implementation reason.

Keep components focused and aligned with SOLID principles. A component should have one main reason to change. Move state orchestration and derived data into hooks, validation contracts into schemas, formatting and sanitizing into utils, and presentational UI into components.

Feature components should receive data through props. Do not import mocks or API clients directly inside presentational pickers, cards, or form sections. Import mocks or API calls in route-level components, feature containers, or feature hooks.

Keep domain types close to the domain. Place booking domain types in `features/booking/types`, or infer them from Zod schemas in `features/booking/schemas` when those schemas define data contracts.

Use Zod schemas as the source of truth for form data and request-like contracts that may later be shared with the backend. Derive TypeScript types with `z.infer` instead of duplicating shapes manually.

Use React Hook Form for non-trivial forms. Keep validation rules in Zod schemas, not duplicated as custom component-level checks.

Prefer literal unions derived from `as const` data for UI state such as wizard steps. Use TypeScript `enum` only when a runtime enum-like object is genuinely useful or required by an API/database contract.

Use shallow barrel exports with `index.ts` only where they improve ergonomics without hiding important boundaries. Avoid one large feature-wide barrel and avoid mixing client/server boundaries in the same barrel.

Sort imports consistently without section comments:

1. External libraries.
2. `@/components`.
3. `@/features`.
4. `@/config`, `@/hooks`, `@/lib`, `@/styles`, `@/types`.
5. Relative imports when they are necessary.

Avoid overly generic components with many unrelated boolean props. Prefer composition and narrowly focused components.

## Verification

Before completing a code task, run the relevant commands available in the repository, including:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

Run tests as soon as tests are present.

If a command fails:

- investigate the failure,
- fix issues caused by the changes,
- clearly report unrelated existing failures.

For documentation-only changes, at minimum verify the edited file content and report if code commands were intentionally not run.

## Completion Response

At the end of each task, briefly report:

- files created or changed,
- important implementation decisions,
- commands executed,
- whether lint, typecheck and build passed,
- any remaining limitations.
