# UI Primitives

This project prefers shared primitives over one-off UI implementations.

## Principles

- Follow KISS: keep components simple and predictable.
- Reuse existing primitives before creating new one-off UI.
- Avoid copy-pasting styles or behavior across screens.
- If a pattern repeats, extract it once and reuse it.

## Text Inputs

- Use `TextField` from `src/ui/text-field.tsx` for form inputs.
- Do not use raw `TextInput` directly in app screens unless there is a justified exception.
- `TextField` centralizes:
  - shared visual style (`input-field` in `global.css`)
  - cross-platform text rendering/alignment behavior

Example:

```tsx
import { TextField } from "@/src/ui/text-field";

<TextField
  value={email}
  onChangeText={setEmail}
  placeholder="you@example.com"
  autoCapitalize="none"
/>;
```

## When To Add A New Primitive

Create a reusable component/function when:

- The same UI structure or behavior appears in multiple places.
- Platform-specific fixes are needed and should be centralized.
- Reuse improves consistency and reduces maintenance cost.

Keep primitives focused, small, and easy to understand.
