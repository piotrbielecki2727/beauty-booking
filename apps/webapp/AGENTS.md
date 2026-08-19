<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project Code Patterns

## General

- Use existing project patterns before introducing new abstractions.
- Keep changes scoped to the requested feature or bug.
- Prefer small reusable components over duplicated JSX.
- Prefer semantic props and tokens over hardcoded implementation details.
- Do not add new libraries unless the existing stack cannot reasonably solve the problem.
- Implement large features incrementally. Keep each step usable and reviewable before starting the next one.
- Do not commit or push unless the user explicitly asks for it.
- When preparing commits in a dirty worktree, stage only a coherent, independently buildable snapshot. Never use `git add .` when unrelated or later-step changes are present.

## Token Efficiency

- Keep responses concise and focused on the requested outcome.
- Do not repeat the user's request or restate obvious context.
- Read only the files needed for the current task.
- Prefer targeted `rg` searches over broad recursive file reads.
- Summarize large files or command outputs instead of pasting them back.
- Avoid showing full files unless explicitly requested.
- Prefer small, scoped patches over rewriting whole components.
- Do not propose long alternative lists unless the user asks for options.
- Mention verification results briefly, including only relevant warnings.

## Files And Exports

- Component files use `PascalCase`, for example `CustomerNavbar.tsx`.
- Hook, config, util and type files use `camelCase`, for example `usePersistentBoolean.ts`.
- Do not use hyphens in local feature/component file or folder names.
- Use `export const` for components.
- Avoid `export function` for project components.
- Export reusable public modules through local `index.ts` files.

## Imports

- Group imports with a blank line between groups:
  - external packages,
  - project imports,
  - type imports.
- Keep type imports in `import type`.
- Remove unused imports instead of leaving commented code dependent on them.

## Naming

- Boolean variables and props start with `is`, `has`, `should` or `can`.
- Prefer `isCollapsed`, `isActive`, `isFullWidth` over `collapsed`, `active`, `fullWidth`.
- Setter names should match the state name, for example `setIsSidebarCollapsed`.
- Props types use `Properties`, for example `InputProperties`.
- Do not name props types with `Props` unless matching an external API.

## Components

- Reusable app components live in `components/reusable`.
- Controlled React Hook Form wrappers live in `components/controlled`.
- Base/shadcn/Base UI primitives live in `components/ui`.
- Reusable components should wrap `components/ui` primitives when possible.
- Controlled components should only connect form state and pass translated validation errors.
- Keep reusable components flexible, but avoid adding props before there is a real use case.
- Prefer clear component composition over large files with many conditional branches.
- Use the project `Button` for application actions instead of a raw HTML `<button>`.
- Native structural elements such as `form`, `fieldset`, `legend`, `nav`, `ol` and `section` are encouraged when they improve semantics and accessibility.
- Components reused only inside one feature belong in that feature, for example `features/businessSetup/components/reusable`, not in the global reusable folder.

## Reusable Components

- Build reusable components on top of `components/ui` primitives.
- Do not reimplement behavior already provided by Base UI or shadcn-style primitives.
- Controlled components should wrap reusable components, not `components/ui` directly.
- Keep controlled components thin: connect value, blur/change handlers and translated errors.
- Do not add styling-heavy wrappers when a primitive plus a small reusable component is enough.
- Prefer one reusable component with clear variants over multiple near-identical components.
- Add props only for real current use cases.
- Reusable form controls should allow intentional styling of the outer wrapper, label and underlying control when a real layout needs it.
- Do not remove behavior or accessibility classes from `components/ui` merely to shorten Tailwind class lists.
- Avoid editing imported Base UI/shadcn primitives for feature-specific styling. Put application variants in reusable wrappers.

## Forms

- Use shared schemas from `packages/shared` for FE/BE contracts.
- Validation message values in shared schemas should be translation keys, not final user-facing text.
- Translate field errors in webapp using the existing translated field error pattern.
- Do not hardcode form labels, placeholders, actions or errors in components.
- Use i18n keys for all user-facing form copy.
- Field descriptions are optional, but every controlled field should support them. Render descriptions directly below the label and before the control.
- Validation feedback must not make surrounding layout jump. Reserve stable feedback space or use the established overlay mode where the form composition requires it.
- Disable submit/navigation actions while a request is pending and prevent edits to values already included in that request.
- After a failed submit, keep the user on the current form, show translated error feedback and allow retry.
- Do not show success toasts for routine wizard step saves; successful persistence should advance the flow. Keep failure toasts.
- A submit action is disabled while the active form has validation errors.
- Distinguish `Continue` from `Save and continue`: show the save wording only when current values differ from the persisted baseline.
- Dirty state must be based on value equality with the persisted/default baseline, not only on whether a field was touched. Reverting values clears dirty state.
- Keep selection indicators in the layout even when hidden so selected controls do not resize or wrap differently.

## Auth And Account

- Auth pages should use the same customer-facing navbar unless a page intentionally requires a focused flow.
- Login and register forms should reuse shared account schemas from `packages/shared`.
- Shared validation schemas should return translation keys.
- Webapp translates validation keys close to the controlled field layer.
- Keep auth form logic separate from visual layout components.
- Avoid duplicating register/login form infrastructure if hooks and reusable controls already exist.
- Keep pending feedback local to the form first: disable fields and show a spinner in the submit button. Use a full-screen overlay only after success when a redirect/session transition is underway.
- Invalid credentials must remain on the login page and render translated feedback above the submit action.
- Logout is deterministic on the client: clear the Auth.js session and redirect even when the backend best-effort logout request fails or the access token is expired.
- While Auth.js session status is unresolved, do not briefly render the signed-out navigation for a signed-in user.

## Internationalization

- Use `const t = useTranslations()`.
- Do not pass a namespace to `useTranslations`.
- Use full translation keys in place, for example `t("navigation.settings")`.
- Add missing keys to both `messages/pl.json` and `messages/en.json`.

## Styling

- Use semantic CSS variables and Tailwind token classes.
- Do not hardcode raw hex colors in components.
- Add or reuse design tokens in `theme/themePalettes.css` when a new semantic color is needed.
- Keep Tailwind class lists minimal and purposeful.
- Avoid decorative styling that does not change the UI meaningfully.
- Prefer existing tokens such as `brand`, `background`, `border`, `muted`, `nav`, `sidebar`.
- For palette-specific styling, change tokens, not component code.
- Outside `components/ui`, do not create colors with opacity modifiers such as `brand/10` or one-off `color-mix` classes. Define the exact semantic state in the palette and use its token.
- Do not add feature-specific color names such as `form-*` or `nav-*` when the same role is useful elsewhere. Prefer roles such as `canvas`, `surface`, `surface-hover`, `copy`, `copy-muted`, `line` and `brand`.

## Theme And Colors

- The active visual palette is selected centrally in the theme config.
- Components should use semantic tokens and should not know which palette is active.
- Add new colors as named CSS variables in `theme/themePalettes.css`.
- Use palette tokens consistently across light/dark variants when possible.
- Prefer existing semantic roles before adding a new token.
- Use component-local CSS variable references only when a token is intentionally feature-specific.
- Palettes are code-owned and selected centrally. Do not store arbitrary customer-authored palettes in the database.
- Every maintained palette must expose the same semantic token contract so components never branch on palette names.
- Keep light and dark variants aligned to the same semantic roles.
- Burgundy is the current visual reference palette; preserve its approved visual values when consolidating token names.

## UI And Visual Design

- Keep app screens functional first; do not turn internal app views into landing pages.
- Avoid excessive Tailwind class lists and visual noise.
- Use subtle borders, spacing and token-based color differences before adding shadows or effects.
- Do not add decorative effects that do not improve clarity or interaction.
- Forms should feel calm, clean and readable.
- Hover and active states should be visible but restrained.
- Mobile views should be intentionally designed, not accidental desktop shrinkage.
- Use `focus-visible` for keyboard focus rings. Mouse clicks must not leave an additional persistent ring on already-active controls.
- Active, hover and focus are separate states: active uses the established surface/border, hover is subtle, and focus-visible adds the accessibility ring.
- Stable containers, reserved indicator space and fixed control dimensions should prevent text, validation and async data from shifting the interface.

## Layout

- Desktop, mobile and shared layout pieces should be split when the file becomes hard to scan.
- Route groups should express layout ownership, for example customer, auth and management surfaces.
- Do not duplicate navigation item rendering if one component can handle variants cleanly.
- Keep mobile behavior explicit instead of hiding complex desktop assumptions in CSS only.
- A sidebar is viewport-owned: keep it at `100dvh` and sticky/fixed independently from page content height.
- Persist desktop sidebar collapse state without a hydration flash. Read the initial value on the server and keep subsequent updates in the shared persistent-state hook.

## Navbar And Shells

- `CustomerNavbar` is the shared navbar for customer-facing and auth pages.
- Desktop customer navigation should be centered when actions live on the right.
- Desktop actions should stay at the right edge of the navbar.
- Mobile drawer navigation should preserve the same active and hover language as desktop navigation.
- Language and theme controls should be grouped in reusable menu/dropdown patterns on desktop when needed.
- Keep customer, auth and management shells explicit instead of mixing their layout concerns.
- Management roles render the management sidebar/drawer and must not also render the customer navbar/footer.
- Desktop management sidebar and mobile management drawer should expose the same navigation, account, language, theme and logout capabilities without nesting another dropdown inside the drawer.
- Keep desktop sidebar expanded/collapsed transitions dimensionally stable: icons stay centered and labels reveal without changing control gaps.
- Do not render partially loaded account/business data in the management sidebar. Gate the management shell with the shared loading overlay until session, tenant and setup context are ready.
- Long business/account names must wrap or truncate within their allocated column and never overlap sidebar controls.
- Account avatars render either the image with `object-cover` or the fallback icon, never both.
- Expanded and collapsed sidebar footers expose the same language, theme and logout actions. Labels may appear only when expanded, but controls must not jump while the sidebar animates.

## Tenant And Routing

- The current hostname identifies the business. Tenant-aware API requests use `getCurrentTenantHost` and forward `X-Tenant-Host`; do not duplicate host parsing in feature code.
- Locale changes, auth redirects, logout and expired-session redirects must preserve the current tenant hostname. Use localized relative navigation instead of constructing a `localhost:3000` URL.
- An unknown tenant renders the dedicated tenant-not-found state. Do not fall back to a default salon silently.
- Local tenant testing uses hostnames such as `salon.localhost`; production branding uses the real configured domain.
- Keep tenant context in the shared provider. Feature components consume the provider instead of refetching `/tenant/context` independently.

## Async Feedback And Loading

- Match loading scope to data ownership.
- Use an inline control spinner for an individual form request.
- Use a container-level loader when only a wizard, card or panel is loading.
- Use the full-screen `LoadingOverlay` for session resolution, locale changes, logout and confirmed redirects, or when the whole shell cannot render coherently.
- Do not add a global overlay for ordinary navigation links.
- Loading states must block duplicate actions and relevant navigation without resizing the layout.

## Business Setup Wizard

- Wizard ownership lives in `features/businessSetup`.
- Individual steps live in `components/steps`; components shared only by wizard steps live in `components/reusable`; the left progress/navigation column lives in `components/stepsColumn`.
- Each implemented step owns its React Hook Form instance and shared schema. Cross-step setup state, drafts, persistence and active-step navigation belong to `BusinessSetupProvider`.
- Draft values may survive step navigation in memory, but they disappear on refresh until persisted.
- A completed checkmark means the backend confirms that step in `completedSteps`; it must not represent a merely filled local draft.
- Step navigation does not implicitly save. When leaving dirty state, use the reusable confirmation dialog and offer leave/stay unless the active step is explicitly submitted.
- Steps with unmet dependencies remain navigable but render a clear requirements state instead of a broken form.
- While saving a step, disable the complete wizard interaction surface. Advance only after the request succeeds.
- Keep the step list and footer stable while only the central step content scrolls. On mobile, separate the step list and content visually and provide a useful scroll viewport.
- Put step labels, dependency metadata and helper item definitions in config files instead of embedding large maps in step components.

## Verification

- After TypeScript changes, run `pnpm exec tsc --noEmit`.
- After code/style changes, run `pnpm lint`.
- Mention warnings that remain outside the task scope.
- Do not fix unrelated warnings or refactor unrelated files without an explicit request.
- For webapp work prefer the scoped commands:
  - `pnpm --filter @beauty-booking/webapp exec tsc --noEmit`
  - `pnpm --filter @beauty-booking/webapp lint`
- When shared contracts change, typecheck `@beauty-booking/shared`, backend and webapp.

## Comments

- Do not add comments for obvious code.
- Use comments only to preserve intentional temporary alternatives or explain non-obvious behavior.
- Remove stale commented code once it is no longer useful.
