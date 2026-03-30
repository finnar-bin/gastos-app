# Supabase Migrations Runbook

This repo uses Supabase CLI migrations as the single source of truth for schema changes.

## Rules

- Use only `supabase/migrations`.
- Apply changes to `dev` first, then `prod`.
- Do not create prod-only migrations.
- Use `supabase migration repair` only to fix migration history mismatches.

## Required Environment Variables

Use env files so contributors do not need shell exports.

1. Copy templates:

```bash
cp .env.development.example .env.development
cp .env.production.example .env.production
```

2. Fill values:

- `.env.development`:
  - `SUPABASE_PROJECT_REF_DEV`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `.env.production`:
  - `SUPABASE_PROJECT_REF_PROD`
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Normal Migration Flow

1. Create a migration file:

```bash
supabase migration new <name>
```

2. Add SQL statements to the new file under `supabase/migrations/`.
3. Apply and test in dev:

```bash
npm run db:push:dev
```

4. Validate app behavior against dev.
5. Promote the exact same migration to prod:

```bash
npm run db:push:prod
```

6. Verify migration status:

```bash
npm run db:list
```

## Linking Shortcuts

- `npm run db:link:dev`
- `npm run db:link:prod`

These scripts load `.env.development` or `.env.production` automatically via `dotenv-cli`.

## Repair Commands (History Only)

Use only when local/remote migration history is out of sync.

Mark a migration as applied:

```bash
supabase migration repair <version> --status applied
```

Mark a migration as reverted:

```bash
supabase migration repair <version> --status reverted
```

Then verify:

```bash
supabase migration list
```
