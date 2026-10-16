# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature 02 (TBD — see feature-specs/)

## Completed

- **01-design-system**: shadcn/ui installed (Tailwind v4 mode), components Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added, lucide-react installed, `lib/utils.ts` with `cn()` helper created, `globals.css` updated with project dark theme tokens and shadcn semantic vars.

## In Progress

- None yet.

## Next Up

- Feature 02 (TBD — see feature-specs/)

## Open Questions

- None.

## Architecture Decisions

- Dark-only theme: no light mode. All shadcn semantic tokens (--background, --foreground, etc.) in `:root` are set to dark values — no `.dark` class switch needed.
- CSS custom properties are the source of truth for all colors. Tailwind utilities reference them via `@theme inline`.
- shadcn/ui components live in `components/ui/` and must not be modified after installation.
- `lib/utils.ts` exports `cn` from the `cn` package (shadcn Tailwind v4 standard).
- Fonts: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`) wired into Tailwind via `@theme inline`.

## Session Notes

- Stack: Next.js 16.4.2, React 19.3.0, Tailwind v4, TypeScript strict.
- shadcn version: 4.22.0. No tailwind.config.js — all config lives in globals.css.
- `components/ui/button.tsx` was already generated during `init`; subsequent `add` skipped it (identical).
