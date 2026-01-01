# Supabase Storage Setup for ATS

This document describes the storage buckets, required policies, and how frontend helpers will interact with Supabase Storage.

## Buckets

- `instrument-images` (PUBLIC)
  - Purpose: Host images used in instrument cards and galleries.
  - Public read access is allowed for anonymous users.
  - Admins manage uploads and deletions via the Admin UI.

- `documents` (PRIVATE)
  - Purpose: Store private documents (e.g., quotes, user files, internal docs).
  - No public read access; access is granted via signed URLs.
  - Admins (authenticated) can upload or remove documents.

## Access Rules Summary

- Only authenticated admins may INSERT, UPDATE, DELETE objects across buckets.
- Public SELECT is only allowed for `instrument-images`.
- `documents` must remain private; no anonymous reads.

## SQL Policies

- The SQL policy script in `sql/supabase_storage_policies.sql` creates a helper function `is_active_admin()` and the following policies:
  - `public_read_instrument_images` (SELECT): allows anon SELECT on `storage.objects` for bucket `instrument-images`.
  - `admin_write_only` (FOR ALL): allows authenticated admins to INSERT/UPDATE/DELETE across buckets using `is_active_admin()`.

> Note: The script uses `DO` blocks to avoid re-creating policies, but you should verify in Supabase's SQL editor and run them in a staging environment before production.

## Frontend Helpers

- `src/services/storage.ts` provides:
  - `uploadInstrumentImage(file, path): Promise<{ path, url }>` — uploads to `instrument-images` and returns a public URL.
  - `getPublicImageUrl(path): string` — returns the public URL for an image in `instrument-images`.
  - `getSignedDocumentUrl(path, expiresIn): Promise<{ signedUrl }>` — generates a signed URL for `documents` with `expiresIn` seconds.

These helpers are intentionally small and do not manipulate UI state; they throw explicit errors which Admin UI pages should catch and handle gracefully.

## Admin UI Workflow (High Level)

1. Admin uploads an instrument image via `uploadInstrumentImage()`; server returns a URL and path to store in instruments table.
2. Admin uploads a private document via `supabase.storage.from('documents').upload(...)` and obtains a path. To access the document, the UI calls `getSignedDocumentUrl(path, expiresIn)` and opens the signed URL.

## Notes & Deferred Items

- Bucket creation: Please create `instrument-images` (public) and `documents` (private) in the Supabase Storage UI.
- Document versioning and lifecycle policies (e.g., retention) are deferred for next phases.
- For media processing (resizing, thumbnails), use an Edge Function or server job in future phases.
