-- RLS Policy for instruments table
-- Purpose: Allow public read access to instruments without authentication

-- Enable RLS on instruments table
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public read access to instruments" ON public.instruments;

-- Create policy for public read access
CREATE POLICY "Allow public read access to instruments"
ON public.instruments
FOR SELECT
TO public
USING (true);

-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Grant select permission to anonymous users
GRANT SELECT ON public.instruments TO anon;
GRANT SELECT ON public.instruments TO authenticated;
