# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- In Progress

## Current Goal

- Feature 04 (TBD — see feature-specs/)

## Completed

- **01-design-system**: shadcn/ui installed (Tailwind v4 mode), components Button/Card/Dialog/Input/Tabs/Textarea/ScrollArea added, lucide-react installed, `lib/utils.ts` with `cn()` helper created, `globals.css` updated with project dark theme tokens and shadcn semantic vars.
- **02-editor**: `components/editor/editor-navbar.tsx`, `components/editor/project-sidebar.tsx`, and `components/editor/editor-shell.tsx` created. Shell wired into `app/layout.tsx` as the root content wrapper. shadcn Dialog confirmed ready for future use. Zero TS errors, zero lint errors.
- **03-auth**: proxy.ts (Next.js 16 route protection), ClerkProvider with dark theme and CSS vars, sign-in/sign-up two-panel pages, editor layout wrapping EditorShell, root page auth redirect, UserButton in editor navbar.

## In Progress

## Next Up

- Feature 04 (TBD — see feature-specs/)

## Open Questions

- None.

## Architecture Decisions

- Next.js 16 uses `proxy.ts` (not `middleware.ts`) with `export const proxy = clerkMiddleware(...)`.
- `EditorShell` moved from root layout to `app/editor/layout.tsx` so auth pages don't inherit the editor chrome.
- Clerk appearance uses CSS custom properties (`var(--bg-base)`, `var(--accent-cyan)`, etc.) — no hardcoded colors.
- Auth route group `(auth)` at `app/(auth)/` groups sign-in and sign-up without adding a URL segment.

- Dark-only theme: no light mode. All shadcn semantic tokens (--background, --foreground, etc.) in `:root` are set to dark values — no `.dark` class switch needed.
- CSS custom properties are the source of truth for all colors. Tailwind utilities reference them via `@theme inline`.
- shadcn/ui components live in `components/ui/` and must not be modified after installation.
- `lib/utils.ts` exports `cn` from the `cn` package (shadcn Tailwind v4 standard).
- Fonts: Geist Sans (`--font-geist-sans`) and Geist Mono (`--font-geist-mono`) wired into Tailwind via `@theme inline`.
- Editor sidebar floats above canvas (fixed overlay, z-50), does not push content.
- EditorNavbar accepts `isOpen` + `onToggle`; ProjectSidebar accepts `isOpen` + `onClose`.

## Session Notes

- Stack: Next.js 16.4.2, React 19.3.0, Tailwind v4, TypeScript strict.
- shadcn version: 4.22.0. No tailwind.config.js — all config lives in globals.css.
