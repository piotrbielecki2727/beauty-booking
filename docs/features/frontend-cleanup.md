# Frontend Cleanup

## Auth Page Background

- `apps/web/src/hooks/useResponsiveImageSource.ts` is intentionally unused for now.
- Auth pages use one static 2K background image from `sm` up to avoid flicker while resizing the viewport: `apps/web/public/images/register_login_background_2k.png`.
- Revisit the hook when responsive image switching is needed outside the auth pages, or remove it if it stays unused.
