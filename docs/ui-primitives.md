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
  - shared visual style defaults (inside the component)
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

## Buttons

- Use `Button` from `src/ui/button.tsx` for tappable actions.
- Prefer `size` props for consistent sizing across screens.
- Use `isLoading` for pending actions. It disables the button and shows a spinner before content.
- Supported sizes:
  - `xl`
  - `lg`
  - `md`
  - `sm`
- Supported variants:
  - `primary`
  - `secondary`
  - `warning`
  - `outline`
  - `ink`

Example:

```tsx
import { Button } from "@/src/ui/button";

<Button
  size="lg"
  variant="primary"
  label="Save"
  isLoading={isSaving}
  onPress={handleSave}
/>;
```
