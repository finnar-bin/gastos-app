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
- Keep styling consistent by reusing shared classes (for example, `input-field` in `global.css`).
- Only add platform-specific overrides inside shared primitives, not per-screen.

## Code Organization

- Keep business logic in reusable functions/modules.
- Keep screen files focused on composition and flow, not duplicated implementation details.
- Prefer small abstractions with clear names over many ad-hoc inline blocks.

## Documentation

- If you introduce a new reusable primitive, document it in `docs/ui-primitives.md`.
