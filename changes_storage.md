What changed
============

- Added SQL policies for Supabase Storage in `sql/supabase_storage_policies.sql` that:
  - Provide a helper `public.is_active_admin()` to map auth.uid() to `admins.supabase_auth_id` and `a.is_active = true`.
  - Provide a named policy `public_read_instrument_images` to allow public SELECT on `storage.objects` where `bucket_id = 'instrument-images'`.
  - Provide a named policy `admin_write_only` to allow only active admins to insert/update/delete on `storage.objects`.

- Added TypeScript helper `src/services/storage.ts` with typed functions for:
  - `uploadInstrumentImage(file, path)`
  - `getPublicImageUrl(path)`
  - `getSignedDocumentUrl(path, expiresIn)`

- Added `docs/backend-storage-setup.md` explaining bucket purposes, access rules, and how Admin UI should use the helpers.

Why
===

- This prepares storage and security rules to make Admin UI development safe: images are publicly readable while private documents remain protected.

Risk
====

- Low risk: No schema changes. Policies must be applied in Supabase UI; the SQL file is idempotent where applicable. Helpers are not wired to UI.

Rollback
========

- Delete the added files and remove the SQL script if already applied:

  - Delete `src/services/storage.ts` and `docs/backend-storage-setup.md`.
  - Revert SQL changes in Supabase UI if applied.
