# Current Application State

## Snapshot

This document describes the repository state as of 2026-08-27. It is a product
and implementation snapshot, not a replacement for the detailed feature
documents.

Beauty Booking currently has a working multi-tenant authentication and salon
onboarding foundation. A salon owner can enter the application, complete the
required initial setup, edit the same persisted salon data later and switch
between solo and team operation without losing team records. The actual booking
engine and most day-to-day management tools are not implemented yet.

## Application Structure

- `apps/webapp` owns the Next.js user interface, Auth.js session integration,
  tenant-aware shells and feature UI.
- `apps/backend` owns the Express API, authorization, business rules and Prisma
  persistence.
- `packages/shared` owns cross-application Zod schemas, request/response
  contracts, enums and domain types.
- `docs/features` records the current behavior, permissions, temporary mocks and
  planned follow-up work.

The active hostname selects the salon tenant. Tenant-aware requests forward
`X-Tenant-Host`, and both the frontend and backend scope salon data and access
to that context.

## Implemented Flows

### Authentication and tenant access

- Customer registration, resumable e-mail verification, cancellation and login
  are connected to backend persistence.
- Auth.js Credentials delegates password validation to the backend.
- Route access is role-aware, and management accounts render a dedicated
  management shell instead of the customer navigation.
- E-mail verification delivery is still mocked; development uses the configured
  verification code and logs delivery through the adapter boundary.

See [Authentication And Authorization](./authentication-and-authorization.md)
for the full flow and contracts.

### Initial salon setup

- `NOT_STARTED` users see a mandatory welcome dialog and explicitly start the
  configuration.
- `IN_PROGRESS` users resume the wizard without seeing the welcome dialog again.
- `COMPLETED` users enter the regular management area and do not see initial
  setup.
- The required wizard flow is:
  `BUSINESS_BASICS` -> `LOCATION` -> `PUBLIC_PROFILE` -> `SUMMARY`.
- Each data step validates with a shared schema and persists independently.
- The backend is the source of truth for status, current step and completed
  steps; local drafts only survive navigation within the current browser
  session.
- Completion is an explicit backend operation and unlocks the regular
  management navigation.

Business basics include salon name, `SOLO`/`TEAM` and specializations. Location
includes the address, arrival/parking notes and optional mobile-service defaults.
Public profile includes contact details, description and optional social links.
Logo files can be validated and previewed locally, but durable image storage is
not connected yet.

See [Business Setup](./business-setup.md) for endpoints, persistence and detailed
rules.

### Permanent salon settings

`/management/settings` currently exposes one `Salon` tab with three independent
forms:

- basic information,
- location,
- customer-facing data.

The forms reuse setup schemas and step UI while keeping independent dirty,
validation, submit and loading state. A save action is available only for a
changed, valid form. Leaving with unsaved changes offers stay, discard-and-leave
or save-and-leave; invalid data or a failed request prevents navigation.

Changing `SOLO`/`TEAM` requires a dedicated confirmation. The save preserves
team data and updates the mounted setup/tenant state without a hard reload.
`SOLO` hides and route-guards employee management; switching back to `TEAM`
restores access to preserved records.

### Team foundation

- Team members and invitations are persisted per business.
- Team reads and invitation-management endpoints require completed setup and a
  `TEAM` business.
- The employees page exposes the team table with active/deactivated tabs,
  modal-based member editing, owner detail editing, invitation link creation,
  link copying and invitation cancellation.
- Team reads return owner details as a nested `owner` object and member access
  as a status-discriminated object.
- Team member removal is implemented as deactivation: deactivated members stay
  persisted and can be activated again.
- Invitation links expire after 3 days. Active invitation links are exposed to
  the owner from the team list together with `sentAt` and `expiresAt`. The
  random token is stored to recreate the link after refresh, and `tokenHash` is
  used for invitation lookup.
- Switching to `SOLO` does not delete members, invitations or related saved
  configuration.
- Real invitation e-mail delivery is not implemented yet.

## Backend Foundation

Implemented backend modules:

- `auth`,
- `tenant`,
- `users`,
- `businessSetup`,
- `businessTeam`.

Persisted business foundations include onboarding status, salon basics,
location, public details, mobile-service defaults, opening hours, booking rules,
release windows, services, memberships, team members and team invitations.
Several operational contracts and endpoints are intentionally retained for
future management pages even though they are not part of the short initial
wizard.

## Current Management and Customer Pages

- Management setup and salon settings have functional feature flows.
- The employees route currently manages team members, owner team details and
  invitation links for `TEAM` businesses.
- Management dashboard, calendar, bookings and services are shells or
  placeholders and do not yet provide their final operational functionality.
- Customer home exposes session information for development; customer bookings
  and profile are currently page shells.
- Management pages use the shared page layout so their header remains stable and
  page-owned loading content can be centered in the remaining viewport space.

## Deliberately Outside the Current Scope

- appointment creation and the public booking journey,
- calendar and availability management UI,
- employee schedules, breaks, leave and exceptions,
- final service, add-on and employee-service management,
- publication worker and public slot filtering,
- durable logo and portfolio image storage,
- real e-mail delivery for verification and team invitations,
- finalized customer profile and booking history.

## Recommended Next Product Slice

Build the operational service catalogue first, then employee/service assignment
and availability. Those provide the minimum data needed before implementing the
calendar, public slot engine and end-to-end booking flow.
