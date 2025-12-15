-- departments.sql
-- Idempotent migration to create the `departments` table and minimal RLS policies.
-- - Includes UUID PK, slug (unique), coordinator_email, is_public, is_active, metadata, timestamps
-- - Indexes on slug, is_public, is_active
-- - RLS enabled
-- - Two minimal policies:
--    1) public select: only rows where is_public = true AND is_active = true
--    2) admin full CRUD: allowed when public.is_requester_admin(auth_uid) returns true

-- Notes:
-- * This migration intentionally does NOT create seed data.
-- * It assumes a helper function `public.is_requester_admin(text)` exists and returns boolean.
-- * It uses (select auth.uid()) pattern for policy evaluation, which is efficient and recommended.
-- * Keep this file idempotent: safe to run repeatedly.

-- Ensure PG crypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create table
CREATE TABLE IF NOT EXISTS public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  coordinator_email text NOT NULL,
  is_public boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS departments_is_public_idx ON public.departments (is_public);
CREATE INDEX IF NOT EXISTS departments_is_active_idx ON public.departments (is_active);
-- slug: unique constraint creates an index; optionally create explicit index if desired
CREATE INDEX IF NOT EXISTS departments_slug_idx ON public.departments (slug);
-- Note: 'slug' already has a UNIQUE constraint, which creates an index; we don't create a duplicate index

-- Enable RLS (idempotent)
ALTER TABLE IF EXISTS public.departments ENABLE ROW LEVEL SECURITY;

-- Remove existing policies (if any) so we can re-add idempotently
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'departments' AND policyname = 'public_read_public_active_departments'
  ) THEN
    EXECUTE 'DROP POLICY public_read_public_active_departments ON public.departments';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'departments' AND policyname = 'admin_full_access_departments'
  ) THEN
    EXECUTE 'DROP POLICY admin_full_access_departments ON public.departments';
  END IF;
END
$$;

-- Public SELECT policy: allow only rows where is_public AND is_active are true
CREATE POLICY public_read_public_active_departments
  ON public.departments
  FOR SELECT
  USING (
    is_public = true AND is_active = true
  );

-- Admin 'ALL' policy: allow admin full CRUD based on a helper function and (select auth.uid()) pattern
-- Minimal policy: one policy covering SELECT/INSERT/UPDATE/DELETE for admin users
CREATE POLICY admin_full_access_departments
  ON public.departments
  FOR ALL
  USING (
    public.is_requester_admin((select auth.uid()))
  )
  WITH CHECK (
    public.is_requester_admin((select auth.uid()))
  );

-- Maintenance helper to keep updated_at current
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.departments;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- End of departments.sql
