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

## Autocomplete Inputs

- Use `Autocomplete` from `src/ui/Autocomplete.tsx` for searchable dropdown selection.
- Keep option fetching outside the primitive (for example with TanStack Query) and pass options in as props.
- Use `selectedOptionId` + `value` to support both selected state and search text.
- Show validation messages through `errorMessage`.

Example:

```tsx
import { Autocomplete } from "@/src/ui/Autocomplete";

<Autocomplete
  label="Category"
  placeholder="Search category"
  value={categorySearchValue}
  selectedOptionId={categoryId}
  options={categoryOptions}
  onChangeValue={setCategorySearchValue}
  onSelectOption={(option) => {
    setCategoryId(option.id);
    setCategorySearchValue(option.label);
  }}
  emptyMessage="No matching categories"
/>;
```

## Date Inputs

- Use `DatePicker` from `src/ui/DatePicker.tsx` for native date selection.
- Keep storage values as `YYYY-MM-DD`; display values are formatted for readability.
- Reuse exported helpers from the same module:
  - `toDateOnlyValue`
  - `isDateOnlyValue`
  - `toDateFromDateOnlyValue`
  - `formatDateOnlyForDisplay`

Example:

```tsx
import { DatePicker } from "@/src/ui/DatePicker";

<DatePicker
  label="Date"
  value={date}
  onChangeValue={setDate}
  errorMessage={fieldErrors.date}
/>;
```

## Toast Notifications

- Use the `ToastProvider` from `src/providers/ToastProvider.tsx` at app root for global stackable toasts.
- Use `useToast()` to trigger notifications from any screen/component.
- Supported toast types:
  - `success` (primary background)
  - `error` (danger background)
- Default auto-dismiss duration is `1000` ms; override using `durationMs`.

Example:

```tsx
import { useToast } from "@/src/providers/ToastProvider";

const { showToast } = useToast();

showToast({ message: "Saved.", type: "success" });
showToast({ message: "Failed.", type: "error", durationMs: 2000 });
```
