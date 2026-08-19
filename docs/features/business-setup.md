# Business Setup

## Status

Initial owner setup wizard is in progress.

Implemented steps:

- business basics,
- location,
- workstations,
- services.

## Backend

Module:

- `apps/backend/src/modules/businessSetup`

Routes:

- `GET /business/setup`
- `PATCH /business/setup/business-basics`
- `PATCH /business/setup/location`
- `PATCH /business/setup/workstations`
- `PATCH /business/setup/services`

All routes require an authenticated user with salon-management permissions.

## Data

Business setup state is stored on `Business`:

- `onboardingStatus`,
- `onboardingCurrentStep`,
- `onboardingCompletedSteps`,
- `onboardingCompletedAt`.

Business basics and location are stored on `Business`.

Workstations are stored in `BusinessWorkstation` and belong to one business.

Services are stored in `BusinessService` and belong to one business. Prices are
stored as integer minor units in `priceAmount`.

## Frontend

Wizard route:

- `/management/setup`

Feature files:

- `apps/webapp/src/features/businessSetup`

Forms use shared schemas from `packages/shared/src/businessSetup`.

## Next Steps

- add-ons,
- team,
- team services,
- availability,
- booking rules,
- public profile,
- summary and completion.
