-- SQL: Supabase Storage Policies for ATS
-- Purpose: Implement RLS for storage.objects tied to admin users
-- DISCLAIMER: Supabase Storage policies must be applied via the SQL Editor
-- Ensure policy names don't conflict; policies are idempotent where possible

-- NOTE: This script assumes Postgres extension 'pgcrypto' and functions like auth.uid() exist.

-- Create a helper function to check if auth.uid() maps to active admin
CREATE OR REPLACE FUNCTION public.is_active_admin() RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT EXISTS(
    SELECT 1 FROM public.admins a
    WHERE a.supabase_auth_id::text = auth.uid()::text
    AND a.is_active = true
  );
$$;

-- Ensure function will not recreate on subsequent runs (OK to replace)

-- Storage bucket-level policies (for storage.objects)
-- Only allow admins to insert/update/delete; public read only on instrument-images
-- Supabase storage objects table is usually: storage.objects (service schema 'storage' may vary)

-- For safety, use fully-qualified table: storage.objects
-- Policy: allow select on instrument-images for anon (public)
DO $$
BEGIN
  -- Grant public select via view or policy: public read on objects for instrument-images
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'public_read_instrument_images' AND polrelid = 'storage.objects'::regclass
  ) THEN
    EXECUTE $$
      CREATE POLICY public_read_instrument_images
      ON storage.objects
      FOR SELECT
      USING (
        bucket_id = 'instrument-images' AND
        (name IS NOT NULL)
      );
    $$;
  END IF;
END$$;

-- Policy: restrict write to authenticated admins (insert/update/delete) for any bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE polname = 'admin_write_only' AND polrelid = 'storage.objects'::regclass
  ) THEN
    EXECUTE $$
      CREATE POLICY admin_write_only
      ON storage.objects
      FOR ALL
      USING (public.is_active_admin())
      WITH CHECK (public.is_active_admin());
    $$;
  END IF;
END$$;

-- Policy: explicitly deny anon selects on 'documents' by not providing a public read policy
-- (We already did not add a public read policy for 'documents')

-- Additional note: Supabase Storage also relies on Bucket-level access. Ensure that 'instrument-images' is PUBLIC while 'documents' is PRIVATE.

-- End of policies
