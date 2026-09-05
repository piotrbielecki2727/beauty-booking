# Business Setup

## Status

The current MVP initial owner setup and permanent salon-settings flow are implemented.

Implemented steps:

- business basics,
- locations,
- booking-page contact details,
- summary view.

The team and booking-rules forms, shared contracts and persistence endpoints are
kept in the codebase for reuse by the permanent employee and booking-settings
pages, but they are not part of the initial setup flow.

Current wizard order:

- business basics,
- locations,
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
- `POST /business/team/members`
- `PATCH /business/team/members/:teamMemberId`
- `PATCH /business/team/owner`
- `POST /business/team/members/:teamMemberId/deactivate`
- `POST /business/team/members/:teamMemberId/reactivate`
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

Business basics are stored on `Business`. Salon locations and per-location
mobile-service defaults are stored in `BusinessLocation`. `availabilityMode`
stores whether availability is bounded by salon-wide `FIXED_HOURS` or comes
only from `INDIVIDUAL_SCHEDULES`. A business must have at least one saved
location and may have multiple locations; no location is marked as primary.
Single-location businesses can use that location implicitly in later service
and booking flows, while multi-location businesses will require explicit
location selection where it matters. Each location stores an address, arrival
notes and optional mobile-service settings: maximum travel distance, default
travel-time buffer and a fee configured as `FREE`, `FIXED` or `CUSTOM`. Fixed
fees are persisted in integer minor units. Enabling mobile services for a
location does not make every service mobile; service-level location
availability belongs to the later operational services configuration. Mobile
bookings will require manual salon confirmation in the MVP.

The location contract accepts 1-10 locations and rejects duplicate addresses.
The Polish address fields accept letters, Polish characters, spaces and hyphen
for locality, require it to start with an uppercase letter and contain 2-50
characters; postal code uses `NN-NNN`; street is optional and accepts letters,
Polish characters, digits, spaces, hyphen and dot; building number accepts
digits plus an optional single letter; apartment number is optional digits only;
arrival and parking notes are optional text up to 500 characters without links,
HTML or emoji.

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
The operational employees page creates and updates these profiles through the
team management endpoints. The shared request contract contains full name,
optional e-mail, optional phone number, optional birthday day/month, role
(`Manager`, `Employee` or `Intern`) and `providesServices`. Backend validation
rejects the owner's e-mail, duplicate member e-mails in the same business and
e-mail changes for a profile that already has active account access. Updating an
active profile also updates the linked `User.role` and `BusinessMembership`
role/service-provider flag. Removing a member is implemented as deactivation:
active invitations are cancelled, the profile remains stored and can be
reactivated later.
`GET /business/team` returns the owner as a complete `owner` object with name,
e-mail, phone, birthday day/month and `providesServices`, plus `teamMembers`.
Each member `access` object is discriminated by `status` and only exposes an
`inviteUrl` for active pending invitations.

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
stores a random token so the active link can be copied again after refresh, and
also stores `tokenHash` for token lookup. Invitation responses include `sentAt`,
`expiresAt` and the current `inviteUrl`. Creating an invitation reuses an
existing active invitation for the same team member instead of generating a new
link; expired or cancelled invitations can be replaced. Accepting an invitation
requires an authenticated user in the same business with the same e-mail as the
invitation, then links `BusinessTeamMember.userId`, creates or updates
`BusinessMembership`, and updates `User.role` to the invited role.

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

The employees page lists saved team members, shows invitation/access status
(`NO_ACCESS`, `INVITED`, `EXPIRED`, `ACTIVE`), uses modal-based create/edit
forms and can create, copy or cancel panel invitations. Employee e-mail, phone
number and birthday day/month are optional operational fields. An e-mail can be
added later, but once saved it cannot be changed by the standard edit flow.
Clicking `Invite` creates or returns a 3-day invitation link only when there is
no active link for that employee; active links are returned by
`GET /business/team` with `sentAt` so they remain copyable and display the
actual send date after refresh. Real e-mail delivery is intentionally not
implemented yet.

The invitation link opens `/team-invitations/:token` in the web app. The page
prefetches the invitation preview on the server and hydrates it into React
Query. It shows expired, cancelled and accepted states, sends unauthenticated
users to login with a return path, checks that the signed-in account e-mail
matches the invitation and accepts the invite through a mutation. After
acceptance, the client session role is refreshed and the user is sent to
`/management`.

Permanent salon settings live at `/management/settings` under one `Salon` tab.
The page groups editable persisted values into separate basic-information,
locations and customer-data forms instead of mirroring the wizard steps. The
locations form reuses the wizard list UI and lets the owner add, remove, edit
and save multiple locations. Each form validates with the shared wizard schema
and saves independently. Save actions are enabled only for a form whose values
differ from its persisted baseline. Leaving the page with dirty forms opens a
shared guard with stay, discard-and-leave and save-and-leave actions.
Save-and-leave validates every dirty form and cancels navigation when any form
is invalid or a request fails.
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
