# AGENTS

This file defines coding preferences for AI assistants working in this repo.

## Core Principles

- Follow KISS: prefer the simplest solution that is correct and maintainable.
- Favor reusable components/functions over one-off implementations.
- Avoid copy-pasting logic or UI patterns across screens.
- When a pattern appears more than once, extract a shared primitive.

## UI Development

- Use shared UI primitives from `src/ui` whenever available.
- For text inputs, use `TextField` from `src/ui/text-field.tsx` instead of raw `TextInput` in app screens.
- For buttons/actions, use `Button` from `src/ui/button.tsx` and size props for consistency.
- Keep styling consistent by using primitive-owned defaults, then extend only when needed.
- Only add platform-specific overrides inside shared primitives, not per-screen.

## Code Organization

- Keep business logic in reusable functions/modules.
- Keep screen files focused on composition and flow, not duplicated implementation details.
- Prefer small abstractions with clear names over many ad-hoc inline blocks.

## State Management

- Separate server state from client/UI state.
- Use TanStack Query for Supabase-backed server state (fetching, caching, invalidation, optimistic updates).
- Do not use TanStack Query as a general UI state store.
- Prefer local `useState`/`useReducer` first for client/UI state.
- Use Context for lightweight shared client state.
- Introduce Zustand only when client/UI state becomes complex across multiple screens.

## Documentation

- If you introduce a new reusable primitive, document it in `docs/ui-primitives.md`.
- Follow and update `docs/state-management.md` for state patterns and boundaries.
