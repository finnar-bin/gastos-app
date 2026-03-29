## Supabase Migration Follow-up

This scaffold intentionally does not port the existing Drizzle migration history.

Recommended follow-up:

1. Export the current production schema as SQL from the existing source of truth.
2. Initialize Supabase-native migrations with the Supabase CLI in this repo.
3. Recreate the baseline schema as an initial migration and verify it matches the live database.
4. Move future schema changes to Supabase migrations only, then retire Drizzle migrations once parity is confirmed.
