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

## Reusable Components

- Build reusable components on top of `components/ui` primitives.
- Do not reimplement behavior already provided by Base UI or shadcn-style primitives.
- Controlled components should wrap reusable components, not `components/ui` directly.
- Keep controlled components thin: connect value, blur/change handlers and translated errors.
- Do not add styling-heavy wrappers when a primitive plus a small reusable component is enough.
- Prefer one reusable component with clear variants over multiple near-identical components.
- Add props only for real current use cases.

## Forms

- Use shared schemas from `packages/shared` for FE/BE contracts.
- Validation message values in shared schemas should be translation keys, not final user-facing text.
- Translate field errors in webapp using the existing translated field error pattern.
- Do not hardcode form labels, placeholders, actions or errors in components.
- Use i18n keys for all user-facing form copy.

## Auth And Account

- Auth pages should use the same customer-facing navbar unless a page intentionally requires a focused flow.
- Login and register forms should reuse shared account schemas from `packages/shared`.
- Shared validation schemas should return translation keys.
- Webapp translates validation keys close to the controlled field layer.
- Keep auth form logic separate from visual layout components.
- Avoid duplicating register/login form infrastructure if hooks and reusable controls already exist.

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

## Theme And Colors

- The active visual palette is selected centrally in the theme config.
- Components should use semantic tokens and should not know which palette is active.
- Add new colors as named CSS variables in `theme/themePalettes.css`.
- Use palette tokens consistently across light/dark variants when possible.
- Prefer existing semantic roles before adding a new token.
- Use component-local CSS variable references only when a token is intentionally feature-specific.

## UI And Visual Design

- Keep app screens functional first; do not turn internal app views into landing pages.
- Avoid excessive Tailwind class lists and visual noise.
- Use subtle borders, spacing and token-based color differences before adding shadows or effects.
- Do not add decorative effects that do not improve clarity or interaction.
- Forms should feel calm, clean and readable.
- Hover and active states should be visible but restrained.
- Mobile views should be intentionally designed, not accidental desktop shrinkage.

## Layout

- Desktop, mobile and shared layout pieces should be split when the file becomes hard to scan.
- Route groups should express layout ownership, for example customer, auth and management surfaces.
- Do not duplicate navigation item rendering if one component can handle variants cleanly.
- Keep mobile behavior explicit instead of hiding complex desktop assumptions in CSS only.

## Navbar And Shells

- `CustomerNavbar` is the shared navbar for customer-facing and auth pages.
- Desktop customer navigation should be centered when actions live on the right.
- Desktop actions should stay at the right edge of the navbar.
- Mobile drawer navigation should preserve the same active and hover language as desktop navigation.
- Language and theme controls should be grouped in reusable menu/dropdown patterns on desktop when needed.
- Keep customer, auth and management shells explicit instead of mixing their layout concerns.

## Verification

- After TypeScript changes, run `pnpm exec tsc --noEmit`.
- After code/style changes, run `pnpm lint`.
- Mention warnings that remain outside the task scope.
- Do not fix unrelated warnings or refactor unrelated files without an explicit request.

## Comments

- Do not add comments for obvious code.
- Use comments only to preserve intentional temporary alternatives or explain non-obvious behavior.
- Remove stale commented code once it is no longer useful.
