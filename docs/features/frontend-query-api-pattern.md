# Frontend Query And API Pattern

## Status

The web app uses TanStack Query for client-side server state and hydration.
Feature API modules should stay thin and validate responses with shared Zod
schemas.

## Request Client

- Use `apiRequest` from `apps/webapp/src/lib/apiRequest.ts`.
- Pass the shared response schema for every request.
- Pass `signal` for query reads so React Query can cancel stale requests.
- Treat `cancelled` as query cancellation. Treat `timeout`, HTTP errors,
  connection errors and invalid responses as real errors.
- Keep endpoint-specific wrappers in the feature `api` folder.

## Queries

- Put query keys and query options in a feature query module.
- Include tenant/business identity in keys for authenticated business data.
- Include route identity, such as invitation token, in public route keys.
- Convert `ApiRequestError` with code `cancelled` to React Query
  `CancelledError`.
- Server pages may prefetch with `makeQueryClient`, `prefetchQuery`,
  `dehydrate` and `HydrationBoundary`.

## Mutations

- Put mutation keys in the feature API layer.
- Put screen-level mutation orchestration in a feature hook when a screen owns
  several related mutations.
- Use a shared mutation `scope` when one feature should run only one mutation at
  a time.
- Mutation endpoints should return only the resource data needed by the caller,
  not a full list snapshot.
- Await invalidation after success when the next UI state depends on refreshed
  query data.
- Keep optimistic updates out unless a flow needs them and rollback is clear.

## Forms

- Keep React Hook Form values limited to real user-editable fields.
- Keep flow state such as create/edit/owner outside form values.
- Map form values to API requests in feature helper modules.
- Reset a dialog form only when the dialog/entity intentionally changes, not on
  every background refetch.
