# State Management Guide

This project uses different tools for different kinds of state. Keep the boundary clear.

## 1) Server State (Data from Supabase)

Use TanStack Query for server state:

- Data fetching and caching
- Background refetching
- Loading/error states
- Mutations and invalidation
- Optimistic updates

Examples:

- Transactions
- Budgets
- Categories
- Profile/account data loaded from Supabase

## 2) Client/UI State (App-only state)

Use client state patterns for UI-only concerns:

- Local `useState`/`useReducer` first
- Context for small shared state
- Zustand only when client state is complex and shared across many screens

Examples:

- Modal open/close flags
- Active tab/filter selection
- Wizard step
- Temporary form drafts before submit

## Decision Rule

- If state comes from backend or needs cache/refetch/invalidation: use TanStack Query.
- If state is UI behavior only and not persisted remotely: use local state, Context, or Zustand.
