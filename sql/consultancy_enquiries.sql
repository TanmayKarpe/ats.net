-- consultancy_enquiries.sql
-- Idempotent migration to create the `consultancy_enquiries` table.
-- Columns: id, department_id, user_name, user_email, message, status, created_at, updated_at
-- RLS policies: public can INSERT; only admins can SELECT/UPDATE/DELETE

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.consultancy_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  user_name text NOT NULL,
  user_email text NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS consultancy_enquiries_department_idx ON public.consultancy_enquiries (department_id);
CREATE INDEX IF NOT EXISTS consultancy_enquiries_status_idx ON public.consultancy_enquiries (status);
CREATE INDEX IF NOT EXISTS consultancy_enquiries_created_at_idx ON public.consultancy_enquiries (created_at);

ALTER TABLE IF EXISTS public.consultancy_enquiries ENABLE ROW LEVEL SECURITY;

-- Remove existing policies if present
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'consultancy_enquiries' AND policyname = 'public_insert_consultancy_enquiries'
  ) THEN
    EXECUTE 'DROP POLICY public_insert_consultancy_enquiries ON public.consultancy_enquiries';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'consultancy_enquiries' AND policyname = 'admin_read_consultancy_enquiries'
  ) THEN
    EXECUTE 'DROP POLICY admin_read_consultancy_enquiries ON public.consultancy_enquiries';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'consultancy_enquiries' AND policyname = 'admin_update_delete_consultancy_enquiries'
  ) THEN
    EXECUTE 'DROP POLICY admin_update_delete_consultancy_enquiries ON public.consultancy_enquiries';
  END IF;
END
$$;

-- Public INSERT policy: allow unauthenticated or public users to insert enquiries
CREATE POLICY public_insert_consultancy_enquiries
  ON public.consultancy_enquiries
  FOR INSERT
  USING (true)
  WITH CHECK (true);

-- Admin SELECT policy: only admins can read enquiries
CREATE POLICY admin_read_consultancy_enquiries
  ON public.consultancy_enquiries
  FOR SELECT
  USING (
    public.is_requester_admin((select auth.uid()))
  );

-- Admin UPDATE/DELETE policy: allow admins full modification and deletion
CREATE POLICY admin_update_delete_consultancy_enquiries
  ON public.consultancy_enquiries
  FOR ALL
  USING (
    public.is_requester_admin((select auth.uid()))
  )
  WITH CHECK (
    public.is_requester_admin((select auth.uid()))
  );

-- Maintenance helper to set updated_at on update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_updated_at ON public.consultancy_enquiries;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.consultancy_enquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- End of consultancy_enquiries.sql
