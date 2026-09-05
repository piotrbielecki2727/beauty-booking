# Business Setup

## Status

The current MVP initial owner setup and permanent salon-settings flow are implemented.

Implemented steps:

- business basics,
- location,
- booking-page contact details,
- summary view.

The team and booking-rules forms, shared contracts and persistence endpoints are
kept in the codebase for reuse by the permanent employee and booking-settings
pages, but they are not part of the initial setup flow.

Current wizard order:

- business basics,
- location,
- booking-page contact details,
- summary.

The first `BUSINESS_BASICS` form contains the business model, salon name and
specializations. Contact e-mail, phone and optional social-profile links belong
to the separate `PUBLIC_PROFILE` step labelled “Booking page”. The logo picker
already validates and previews local image files, while durable logo upload is
deferred until an image-storage adapter is selected. The chosen `businessType`
does not change the wizard path. Availability mode, salon-wide opening hours,
team, booking rules, services, add-ons and employee-service assignments belong
to operational configuration after onboarding and are not wizard steps.

## Backend

Module:

- `apps/backend/src/modules/businessSetup`

Routes:

- `GET /business/setup/status`
- `GET /business/setup`
- `PATCH /business/setup/complete`
- `PATCH /business/setup/start`
- `PATCH /business/setup/business-basics`
- `PATCH /business/setup/business-details`
- `PATCH /business/setup/location`
- `PATCH /business/setup/opening-hours`
- `PATCH /business/setup/booking-rules`
- `PATCH /business/setup/team`
- `PATCH /business/setup/business-type`
- `PATCH /business/setup/services`
- `GET /business/team`
- `POST /business/team/members/:teamMemberId/invitations`
- `POST /business/team/invitations/:invitationId/cancel`
- `GET /team-invitations/:token`
- `POST /team-invitations/:token/accept`

Reading the lightweight setup status requires an authenticated salon-team
account and returns both `status` and the nullable `businessType`. Reading or
changing setup data requires salon-management permissions.
Operational business routes use the setup-completion middleware and reject
requests while onboarding is not `COMPLETED`. Setup routes and invitation
acceptance remain available before completion.

Employee-management endpoints additionally require `businessType = TEAM`.
Switching to `SOLO` blocks those endpoints without deleting team members,
invitations, service assignments or other preserved team data.

`PATCH /business/setup/complete` is the only operation that finishes the
onboarding. It verifies that `BUSINESS_BASICS`, `LOCATION` and
`PUBLIC_PROFILE` are persisted, then atomically sets the status to `COMPLETED`,
clears `onboardingCurrentStep`, records `onboardingCompletedAt` and adds
`SUMMARY` to the completed steps. Repeating the request after completion is
idempotent and does not replace the original completion timestamp.

`PATCH /business/setup/start` is the explicit entry into onboarding. For a
`NOT_STARTED` business it sets `IN_PROGRESS` and points
`onboardingCurrentStep` at `BUSINESS_BASICS` without modifying any step data.
The operation is idempotent for `IN_PROGRESS` and `COMPLETED` businesses.

## Data

Business setup state is stored on `Business`:

- `onboardingStatus`,
- `onboardingCurrentStep`,
- `onboardingCompletedSteps`,
- `onboardingCompletedAt`.

Business basics, salon location and default mobile-service settings are stored
on `Business`. `availabilityMode` stores whether availability is bounded by
salon-wide `FIXED_HOURS` or comes only from `INDIVIDUAL_SCHEDULES`. The salon
address is always the primary location. The optional
`mobileServicesEnabled` capability exposes a maximum travel distance, a default
travel-time buffer and a fee configured as `FREE`, `FIXED` or `CUSTOM`. Fixed
fees are persisted in integer minor units. Enabling the capability does not
make every service mobile; service-level location availability belongs to the
later operational services configuration. Mobile bookings will require manual
salon confirmation in the MVP.

The Polish address contract accepts letters, Polish characters, spaces and
hyphen for locality, requires it to start with an uppercase letter and contain
2-50 characters; postal code uses `NN-NNN`; street is optional and accepts
letters, Polish characters, digits, spaces, hyphen and dot; building number
accepts digits plus an optional single letter; apartment number is optional
digits only; arrival and parking notes are optional text up to 500 characters
without links, HTML or emoji.

Salon-wide weekly opening hours are stored in `BusinessOpeningHour`. The
preserved endpoint replaces the complete seven-day schedule in one transaction
and marks the `AVAILABILITY` setup step as completed, but it is no longer called
by the initial wizard. Open and close times are persisted as
integer minutes after midnight, while the API uses `HH:mm`. A closed day stores
null times. Closing time must be later than opening time. These values describe
the salon as a whole; employee schedules, breaks, leave and exceptions belong
to the later operational management flow. The opening-hours endpoint rejects
writes when the business uses `INDIVIDUAL_SCHEDULES`; saved fixed hours are kept
when switching modes so they can be restored by switching back.

Global booking rules are stored separately from employee and salon
availability. `BusinessBookingSettings` contains the publication mode,
rolling-window horizon, minimum booking notice, self-service cancellation
deadline, in-salon confirmation mode and the team-member selection options.
The publication modes are:

- `ROLLING` — the visible booking window moves forward automatically by a
  configured number of days,
- `MANUAL` — the salon decides which explicit date ranges to publish and when.

`SCHEDULED` is deliberately not a third business setting. Immediate publication
and scheduled publication are actions performed for a concrete manual range.
Those ranges are represented by `BookingReleaseWindow`. A window stores
date-only `startDate` and `endDate`, an optional local publication plan, and the
eventual `publishedAt` timestamp. The business stores its IANA `timeZone`
(currently defaulting to `Europe/Warsaw`), so a future publication worker can
resolve local scheduled times correctly across daylight-saving changes.

This separation is intentional: a provider may already have working hours for
October while clients can only see a published September range. A slot is
publicly bookable only after later booking logic intersects availability,
existing appointments and a released range. Selecting the publication strategy,
creating ranges, immediately publishing them and scheduling them belong to the
later Calendar / Availability flow; the data structure is already prepared,
while its UI, background publisher and public slot engine are not yet
implemented.

The booking-rules step also records global minimum notice, cancellation and
in-salon confirmation rules. If mobile services are enabled, the UI explains
that mobile appointments always require manual salon confirmation. Team-member
selection controls are rendered only for `TEAM`; their stored values are kept
when changing the business model so returning to `TEAM` restores the previous
choice.

Team members are stored in `BusinessTeamMember` and belong to one business.

The first wizard step persists `businessType`, salon name and specializations
through `PATCH /business/setup/business-basics`. For `SOLO`, the owner's
membership automatically stores `providesServices = true`; for `TEAM`, it
stores `null` until the owner makes that decision in employee management.
`PATCH /business/setup/business-details` persists contact e-mail, phone, salon
description and optional Instagram, Facebook, TikTok, Pinterest and YouTube
links, then completes `PUBLIC_PROFILE`. The preserved
`PATCH /business/setup/business-type` endpoint can later support operational
settings without being mounted by the initial wizard. Changing from a team
business to a solo business keeps
team members stored so the permanent employee-management page can restore them.
They are business-owned profiles, not necessarily user accounts. `email` is
optional and unique per business when present; blank e-mails are allowed for
multiple members. `userId` is nullable and reserved for a later invite/accept
flow. Public registration should not automatically grant management access only
because a registered e-mail matches a team profile.

Panel access invitations are stored in `BusinessTeamInvitation`. The database
stores only `tokenHash`; the plaintext token is returned once from the temporary
test endpoint and can later be sent by a real e-mail adapter. Creating a new
invitation cancels any previous active invitation for the same team member.
Accepting an invitation requires an authenticated user in the same business with
the same e-mail as the invitation, then links `BusinessTeamMember.userId`,
creates or updates `BusinessMembership`, and updates `User.role` to the invited
role.

Services are stored in `BusinessService` and belong to one business. Prices are
stored as integer minor units in `priceAmount`. Service setup validates names as
2-60 characters using letters, Polish characters, digits, spaces and hyphen;
duration as 1-600 minutes; price as 0-9999.99 with comma or dot decimals; and
description as optional text up to 500 characters.

## Frontend

Wizard route:

- `/management/setup`

The management shell loads the authenticated setup status before rendering its
navigation. `NOT_STARTED` and `IN_PROGRESS` businesses are redirected to the
wizard and receive the setup navigation variant containing only initial setup
plus language, theme and logout controls. A `COMPLETED` business is redirected
away from the wizard to the regular management area; initial setup is not shown
in the full management navigation. Finishing the summary synchronizes the new
status with the mounted management shell, which redirects to `/management` and
immediately exposes all regular sidebar routes.

A `NOT_STARTED` business sees a mandatory welcome dialog over the loaded wizard.
Its only action calls the start endpoint. After the server returns
`IN_PROGRESS`, the dialog closes and the first step remains visible. Refreshing
or signing in again resumes `IN_PROGRESS` directly without showing the welcome
dialog; `COMPLETED` businesses never render it.

Feature files:

- `apps/webapp/src/features/businessSetup`

Forms use shared schemas from `packages/shared/src/businessSetup`.

The preserved team form renders the owner as a read-only row from the active
session/setup basics, lets the owner add team members with role (`Manager`,
`Employee` or `Intern`) and service-provider status, and persists those members
through `PATCH /business/setup/team`. Backend validation rejects duplicate
member e-mails inside the same business and rejects adding the owner e-mail as
a separate member. It is no longer mounted by the initial wizard.

The preserved booking-rules form supports rolling or manually managed
appointment publication. Manual mode explains that each later range may be
published immediately or scheduled. Team-only controls decide whether clients
may select a specific provider and whether they may choose “any team member”.
It is no longer mounted by the initial wizard.

The employees page contains a temporary testing section for panel invitations.
It lists saved team members, shows access status (`NO_ACCESS`, `INVITED`,
`ACTIVE`), generates a test invite URL, previews the token and can cancel or
attempt to accept the invitation as the currently signed-in account. Real e-mail
delivery is intentionally not implemented yet.

Permanent salon settings live at `/management/settings` under one `Salon` tab.
The page groups editable persisted values into separate basic-information,
location and customer-data forms instead of mirroring the wizard steps. Each
form validates with the shared wizard schema and saves independently. Save
actions are enabled only for a form whose values differ from its persisted
baseline. Leaving the page with dirty forms opens a shared guard with stay,
discard-and-leave and save-and-leave actions. Save-and-leave validates every
dirty form and cancels navigation when any form is invalid or a request fails.
Business model is a separate confirmed action rather than a regular select.
During a confirmed `SOLO`/`TEAM` change the frontend displays a viewport loader
and then synchronizes the mounted setup status so management navigation updates
without a hard reload. In `SOLO`, the Employees item is omitted and direct
employee-route navigation redirects to the management dashboard. Returning to
`TEAM` exposes the preserved team data again. Salon description is persisted on
`Business`; durable logo persistence remains deferred.

## Next Steps

- add-ons,
- team services,
- availability,
- scheduled publication worker and public slot filtering,
- durable logo upload.
