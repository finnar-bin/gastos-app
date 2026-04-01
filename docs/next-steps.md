# Next Steps (Handoff Note)

Last updated: March 30, 2026

## Current Status

- Auth flow implemented (`login`, `signup`, Supabase auth requests/helpers split).
- New authenticated landing screen is `Sheet Selection`.
- Sheet list query implemented with TanStack Query:
  - Reads user-accessible sheets from `sheet_users` joined to `sheets`.
- Phase 1 offline foundation implemented:
  - TanStack Query provider
  - Persisted query cache
  - Global offline banner
- Project rules/docs updated:
  - Offline phases and phase gate
  - `src/lib` separation rule (`*-requests.ts` vs `*-utils.ts`)

## Important Conventions

- Keep Supabase I/O in `src/lib/*-requests.ts`.
- Keep pure mapping/helpers in `src/lib/*-utils.ts`.
- Do not implement Phase 2/3 offline behavior unless explicitly requested.

## Immediate Next Tasks

1. Build remaining app screens and routes (core product flows).
2. For each screen, add TanStack Query read hooks for Supabase data.
3. Add loading/empty/error states on each screen.
4. Add “last updated” metadata on key read screens (Phase 1 requirement).
5. Run offline checks on device/simulator:
- Load data online
- Relaunch offline
- Confirm cached data renders + offline banner shows

## Suggested First Screen To Build Next

- Sheet details / dashboard screen after selection (read-only first).

## Validation Checklist Before Starting Phase 2

- Core read screens migrated to TanStack Query.
- Offline read behavior validated on real device/simulator.
- UX states for loading/empty/error/offline are consistent.
