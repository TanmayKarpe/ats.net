-- components.sql
-- Idempotent migration to create the `components` table.
-- Columns: id, slug, name, short_description, description, is_public, is_active, created_at, updated_at
-- RLS: public SELECT when is_public AND is_active; admins may perform all operations

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  short_description text,
  description text,
  is_public boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS components_slug_idx ON public.components (slug);
CREATE INDEX IF NOT EXISTS components_is_public_idx ON public.components (is_public);
CREATE INDEX IF NOT EXISTS components_is_active_idx ON public.components (is_active);

ALTER TABLE IF EXISTS public.components ENABLE ROW LEVEL SECURITY;

-- Remove existing policies if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'components' AND policyname = 'public_select_components'
  ) THEN
    EXECUTE 'DROP POLICY public_select_components ON public.components';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'components' AND policyname = 'admin_all_components'
  ) THEN
    EXECUTE 'DROP POLICY admin_all_components ON public.components';
  END IF;
END
$$;

-- Public SELECT: only when published and active
CREATE POLICY public_select_components
  ON public.components
  FOR SELECT
  USING (
    is_public = true AND is_active = true
  );

-- Admin full policy: allows admins to do everything
CREATE POLICY admin_all_components
  ON public.components
  FOR ALL
  USING (
    public.is_requester_admin((select auth.uid()))
  )
  WITH CHECK (
    public.is_requester_admin((select auth.uid()))
  );

-- Maintenance trigger for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.components;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.components
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- End of components.sql
