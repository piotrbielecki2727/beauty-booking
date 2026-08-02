<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Beauty Booking — Agent Instructions

## Before making changes

1. Read this entire file.
2. Inspect the existing repository structure and relevant source files.
3. For Next.js-specific work, follow the generated rules above and consult the local documentation in `node_modules/next/dist/docs/`.
4. Do not introduce a new architecture or library without explaining why it is necessary.
5. Keep changes limited to the requested scope.

## Current project stage

The project is currently frontend-first.

Current priorities:

- build the reusable frontend design system,
- prepare the public booking flow using mocked data,
- focus on mobile-first UX,
- do not implement the Express backend or PostgreSQL yet.

## Product context

This is a multi-tenant booking platform for beauty and appointment-based service businesses, including:

- nail stylists,
- makeup artists,
- lash and brow stylists,
- hairdressers,
- cosmetologists,
- massage providers,
- similar service businesses.

The platform must not be designed only for nail salons.

Instagram remains the main marketing and portfolio channel. The public application should focus on a fast booking process rather than replacing Instagram.

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

## Frontend architecture

Prefer this structure:

```text
src/
├── app/
├── components/
│   ├── ui/
│   ├── common/
│   └── layout/
├── features/
│   └── booking/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── mocks/
│       ├── schemas/
│       ├── types/
│       └── utils/
├── config/
├── lib/
├── styles/
└── types/

Rules:

components/ui contains low-level shadcn components.
components/common contains reusable application components.
features/booking contains booking-specific code.
Do not put feature-specific logic inside generic UI components.
Do not build one large component for the entire booking flow.
Reusable components

Use existing shadcn components as foundations whenever possible.

Reusable application components should:

accept standard HTML or shadcn props where appropriate,
support className,
remain accessible,
work on mobile and desktop,
avoid feature-specific assumptions,
use semantic design tokens rather than hardcoded colors.

Do not create an overly generic “universal component” with many unrelated boolean props.

Prefer composition and narrowly focused components.

Styling

The intended visual direction is premium, modern and restrained.

Primary palette:

cream,
mocha,
brown,
burgundy,
grey,
near-black.

Rules:

use semantic CSS variables,
do not place raw hex colors directly inside feature components,
keep typography and spacing consistent,
prioritize usability over decorative effects,
design mobile-first.
Data and API preparation

During the frontend-first stage:

use mocked data,
keep mock data outside components,
design components against explicit TypeScript contracts,
do not calculate real appointment availability in the frontend,
treat future backend availability responses as the source of truth.

The future backend will own:

available-slot calculation,
service duration,
staff availability,
booking validation,
overbooking prevention,
appointment creation.
TypeScript and code quality
Use strict TypeScript.
Do not use any.
Validate assumptions before adding type assertions.
Prefer small, testable functions.
Avoid duplicated constants and domain types.
Keep imports and naming consistent with the existing project.
Do not leave dead code or commented-out implementations.
Verification

Before completing a task, run the relevant commands available in the repository, including:

pnpm lint
pnpm typecheck
pnpm build

Run tests as soon as tests are present.

If a command fails:

investigate the failure,
fix issues caused by the changes,
clearly report unrelated existing failures.
Completion response

At the end of each task, briefly report:

files created or changed,
important implementation decisions,
commands executed,
whether lint, typecheck and build passed,
any remaining limitations.
```
